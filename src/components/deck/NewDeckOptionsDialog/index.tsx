import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { find, forEach, map, sumBy, throttle } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { SettingsSwitch } from 'react-native-settings-components';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import EditText from '@components/core/EditText';
import RequiredCardSwitch from './RequiredCardSwitch';
import { showDeckModal } from '@components/nav/helper';
import TabooSetPicker from '@components/core/TabooSetPicker';
import CardSectionHeader from '@components/core/CardSectionHeader';
import NavButton from '@components/core/NavButton';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import BasicButton from '@components/core/BasicButton';
import withNetworkStatus, { NetworkStatusProps } from '@components/core/withNetworkStatus';
import withLoginState, { LoginStateProps } from '@components/core/withLoginState';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { saveNewDeck, NewDeckParams } from '@components/deck/actions';
import { NavigationProps } from '@components/nav/types';
import { Deck, Slots } from '@actions/types';
import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import Card from '@data/Card';
import { getTabooSet, AppState } from '@reducers';
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';
import starterDecks from '../../../../assets/starter-decks';

export interface NewDeckOptionsProps {
  investigatorId: string;
  onCreateDeck: (deck: Deck) => void;
}

interface ReduxProps {
  defaultTabooSetId?: number;
}

interface ReduxActionProps {
  saveNewDeck: (params: NewDeckParams) => Promise<Deck>;
}

type Props = NavigationProps &
  NewDeckOptionsProps &
  PlayerCardProps &
  ReduxProps &
  ReduxActionProps &
  NetworkStatusProps &
  LoginStateProps &
  DimensionsProps;

interface State {
  saving: boolean;
  deckName?: string;
  offlineDeck: boolean;
  tabooSetId?: number;
  starterDeck: boolean;
  optionSelected: boolean[];
}

class NewDeckOptionsDialog extends React.Component<Props, State> {
  _onOkayPress!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      saving: false,
      deckName: this.deckName(),
      offlineDeck: !props.signedIn || !props.isConnected || props.networkType === NetInfoStateType.none,
      optionSelected: [true],
      tabooSetId: props.defaultTabooSetId,
      starterDeck: false,
    };

    this._onOkayPress = throttle(this.onOkayPress.bind(this), 200);
  }

  _onDeckTypeChange = (value: boolean) => {
    this.setState({
      offlineDeck: !value,
    });
  };

  _onStarterDeckChange = (value: boolean) => {
    this.setState({
      starterDeck: value,
    });
  }

  _onDeckNameChange = (value: string) => {
    this.setState({
      deckName: value,
    });
  };

  _toggleOptionsSelected = (index: number, value: boolean) => {
    const optionSelected = this.state.optionSelected.slice();
    optionSelected[index] = value;

    this.setState({
      optionSelected,
    });
  };

  _showNewDeck = (deck: Deck) => {
    const {
      componentId,
      onCreateDeck,
    } = this.props;
    const investigator = this.investigator();
    this.setState({
      saving: false,
    });
    // Change the deck options for required cards, if present.
    onCreateDeck && onCreateDeck(deck);
    showDeckModal(componentId, deck, investigator);
  };

  getSlots() {
    const {
      cards,
    } = this.props;
    const {
      optionSelected,
    } = this.state;
    const slots: Slots = {
      // Random basic weakness.
      [RANDOM_BASIC_WEAKNESS]: 1,
    };

    // Seed all the 'basic' requirements from the investigator.
    const investigator = this.investigator();
    if (investigator && investigator.deck_requirements) {
      forEach(investigator.deck_requirements.card, cardRequirement => {
        const card = cardRequirement.code && cards[cardRequirement.code];
        if (!card) {
          return;
        }
        slots[card.code] = card.deck_limit || card.quantity || 0;
      });
    }

    if (optionSelected[0] !== true ||
      sumBy(optionSelected, x => x ? 1 : 0) !== 1) {
      // Now sub in the options that were asked for if we aren't going
      // with the defaults.
      const options = this.requiredCardOptions();
      forEach(optionSelected, (include, index) => {
        const cards = options[index];
        forEach(cards, card => {
          if (include) {
            slots[card.code] = card.deck_limit || card.quantity || 0;
          } else if (slots[card.code]) {
            delete slots[card.code];
          }
        });
      });
    }

    return slots;
  }

  onOkayPress(isRetry?: boolean) {
    const {
      signedIn,
      networkType,
      isConnected,
      saveNewDeck,
    } = this.props;
    const {
      deckName,
      offlineDeck,
      saving,
      starterDeck,
      tabooSetId,
    } = this.state;
    const investigator = this.investigator();
    if (investigator && (!saving || isRetry)) {
      const local = (offlineDeck || !signedIn || !isConnected || networkType === NetInfoStateType.none);
      let slots = this.getSlots();
      if (starterDeck && starterDecks[investigator.code]) {
        slots = starterDecks[investigator.code];
      }
      this.setState({
        saving: true,
      });
      saveNewDeck({
        local,
        deckName: deckName || t`New Deck`,
        investigatorCode: investigator.code,
        slots: slots,
        tabooSetId,
      }).then(
        this._showNewDeck,
        () => {
          // TODO: error
          this.setState({
            saving: false,
          });
        }
      );
    }
  }

  investigator(): Card | undefined {
    const {
      investigatorId,
      investigators,
    } = this.props;
    return investigators[investigatorId] || undefined;
  }

  deckName() {
    const investigator = this.investigator();
    if (!investigator) {
      return undefined;
    }
    switch (investigator.faction_code) {
      case 'guardian':
        return t`The Adventures of ${investigator.name}`;
      case 'seeker':
        return t`${investigator.name} Investigates`;
      case 'mystic':
        return t`The ${investigator.name} Mysteries`;
      case 'rogue':
        return t`The ${investigator.name} Job`;
      case 'survivor':
        return t`${investigator.name} on the Road`;
      default:
        return t`${investigator.name} Does It All`;
    }
  }

  requiredCardOptions() {
    const {
      cards,
    } = this.props;
    const investigator = this.investigator();
    if (!investigator) {
      return [];
    }
    const result: Card[][] = [[]];
    forEach(
      investigator.deck_requirements ? investigator.deck_requirements.card : [],
      cardRequirement => {
        const code = cardRequirement.code;
        if (code && cards[code]) {
          result[0].push(cards[code]);
        }
        if (cardRequirement.alternates && cardRequirement.alternates.length) {
          forEach(cardRequirement.alternates, (altCode, index) => {
            while (result.length <= index + 1) {
              result.push([]);
            }
            result[index + 1].push(cards[altCode]);
          });
        }
      }
    );
    return result;
  }

  _setTabooSetId = (tabooSetId?: number) => {
    this.setState({
      tabooSetId,
    });
  };

  renderFormContent(investigator: Card) {
    const {
      investigatorId,
      signedIn,
      login,
      refreshNetworkStatus,
      networkType,
      isConnected,
      fontScale,
    } = this.props;
    const {
      saving,
      deckName,
      offlineDeck,
      optionSelected,
      starterDeck,
      tabooSetId,
    } = this.state;
    if (saving) {
      return (
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          animating
        />
      );
    }
    const cardOptions = this.requiredCardOptions();
    let hasStarterDeck = false;
    if (investigatorId) {
      hasStarterDeck = starterDecks[investigatorId] !== undefined;
    }
    return (
      <>
        <EditText
          title={t`Name`}
          dialogDescription={t`Enter a name for this deck.`}
          onValueChange={this._onDeckNameChange}
          value={deckName}
        />
        <TabooSetPicker
          color={COLORS.faction[investigator.factionCode()].background}
          tabooSetId={tabooSetId}
          setTabooSet={this._setTabooSetId}
        />
        <CardSectionHeader
          fontScale={fontScale}
          investigator={investigator}
          section={{ superTitle: t`Required Cards` }}
        />
        { map(cardOptions, (requiredCards, index) => {
          return (
            <RequiredCardSwitch
              key={`${investigatorId}-${index}`}
              index={index}
              disabled={(index === 0 && cardOptions.length === 1) || starterDeck}
              label={map(requiredCards, card => card.name).join('\n')}
              value={optionSelected[index] || false}
              onValueChange={this._toggleOptionsSelected}
            />
          );
        }) }
        <CardSectionHeader
          fontScale={fontScale}
          investigator={investigator}
          section={{ superTitle: t`Deck Type` }}
        />
        { signedIn ? (
          <SettingsSwitch
            title={t`Create on ArkhamDB`}
            containerStyle={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLORS.divider }}
            value={!offlineDeck}
            disabled={!signedIn || !isConnected || networkType === NetInfoStateType.none}
            onValueChange={this._onDeckTypeChange}
          />
        ) : (
          <NavButton
            indent
            fontScale={fontScale}
            text={t`Sign in to ArkhamDB`}
            onPress={login}
          />
        ) }
        { (!isConnected || networkType === NetInfoStateType.none) && (
          <TouchableOpacity onPress={refreshNetworkStatus}>
            <Text style={[typography.small, { color: COLORS.red }, space.marginBottomS]}>
              { t`You seem to be offline. Refresh Network?` }
            </Text>
          </TouchableOpacity>
        ) }
        { hasStarterDeck && (
          <SettingsSwitch
            title={t`Use Starter Deck`}
            titleStyle={{ color: COLORS.darkText }}
            value={starterDeck}
            containerStyle={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLORS.divider, backgroundColor: COLORS.background }}
            disabledOverlayStyle={{ backgroundColor: 'transparent' }}
            onValueChange={this._onStarterDeckChange}
          />
        ) }
      </>
    );
  }

  _cancelPressed = () => {
    const { componentId } = this.props;
    Navigation.pop(componentId);
  };

  render() {
    const {
      saving,
      optionSelected,
    } = this.state;
    const investigator = this.investigator();
    if (!investigator) {
      return null;
    }
    const okDisabled = saving || !find(optionSelected, selected => selected);
    return (
      <ScrollView>
        { this.renderFormContent(investigator) }
        { !saving && (
          <>
            <BasicButton
              title={t`Create deck`}
              disabled={okDisabled}
              onPress={this._onOkayPress}
            />
            <BasicButton
              title={t`Cancel`}
              color={COLORS.red}
              onPress={this._cancelPressed}
            />
          </>
        ) }
      </ScrollView>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    defaultTabooSetId: getTabooSet(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({ saveNewDeck } as any, dispatch);
}

export default withPlayerCards<NavigationProps & NewDeckOptionsProps>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withLoginState<NavigationProps & NewDeckOptionsProps & ReduxProps & ReduxActionProps & PlayerCardProps>(
      withDimensions<NavigationProps & NewDeckOptionsProps & ReduxProps & ReduxActionProps & PlayerCardProps & LoginStateProps>(
        withNetworkStatus<NavigationProps & NewDeckOptionsProps & ReduxProps & ReduxActionProps & PlayerCardProps & LoginStateProps & DimensionsProps>(
          NewDeckOptionsDialog
        )
      ),
      { noWrapper: true }
    )
  )
);

const styles = StyleSheet.create({
  spinner: {
    height: 80,
  },
});
