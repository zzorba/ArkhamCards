import React from 'react';
import {
  ActivityIndicator,
  Platform,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { find, forEach, map, sumBy, throttle } from 'lodash';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import DialogComponent from 'react-native-dialog';
import { NetInfoStateType } from '@react-native-community/netinfo';

import RequiredCardSwitch from './RequiredCardSwitch';
import TabooSetDialogOptions from './TabooSetDialogOptions';
import { showDeckModal } from 'components/nav/helper';
import Dialog from 'components/core/Dialog';
import withNetworkStatus, { NetworkStatusProps } from 'components/core/withNetworkStatus';
import withLoginState, { LoginStateProps } from 'components/core/withLoginState';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import { saveNewDeck, NewDeckParams } from 'components/deck/actions';
import { Deck, Slots } from 'actions/types';
import { RANDOM_BASIC_WEAKNESS } from 'constants';
import Card from 'data/Card';
import { getTabooSet, AppState } from 'reducers';
import { t } from 'ttag';
import typography from 'styles/typography';
import space from 'styles/space';
import { COLORS } from 'styles/colors';
import starterDecks from '../../../assets/starter-decks';

interface OwnProps {
  componentId: string;
  toggleVisible: () => void;
  investigatorId?: string;
  viewRef?: View;
  onCreateDeck: (deck: Deck) => void;
}

interface ReduxProps {
  defaultTabooSetId?: number;
}

interface ReduxActionProps {
  saveNewDeck: (params: NewDeckParams) => Promise<Deck>;
}

type Props = OwnProps &
  PlayerCardProps & ReduxProps & ReduxActionProps &
  NetworkStatusProps & LoginStateProps;

interface State {
  saving: boolean;
  deckName?: string;
  offlineDeck: boolean;
  tabooSetId?: number;
  starterDeck: boolean;
  optionSelected: boolean[];
}

class NewDeckOptionsDialog extends React.Component<Props, State> {
  _textInputRef?: TextInput;
  _onOkayPress!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      saving: false,
      offlineDeck: !props.signedIn || !props.isConnected || props.networkType === NetInfoStateType.none,
      optionSelected: [true],
      tabooSetId: props.defaultTabooSetId,
      starterDeck: false,
    };

    this._onOkayPress = throttle(this.onOkayPress.bind(this), 200);
  }

  componentDidUpdate(prevProps: Props) {
    const {
      investigatorId,
    } = this.props;
    if (investigatorId && investigatorId !== prevProps.investigatorId) {
      this.resetForm();
    }
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

  _captureTextInputRef = (ref: TextInput) => {
    this._textInputRef = ref;
  };

  resetForm() {
    this.setState({
      deckName: this.deckName(),
      saving: false,
      optionSelected: [true],
    });
  }

  _showNewDeck = (deck: Deck) => {
    const {
      componentId,
      onCreateDeck,
      toggleVisible,
    } = this.props;
    const investigator = this.investigator();
    this.setState({
      saving: false,
    });
    if (Platform.OS === 'android') {
      toggleVisible();
    }
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
        const card = cards[cardRequirement.code];
        slots[cardRequirement.code] = card.deck_limit || card.quantity || 0;
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

  investigator() {
    const {
      investigatorId,
      investigators,
    } = this.props;
    return investigatorId ? investigators[investigatorId] : undefined;
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
        result[0].push(cards[cardRequirement.code]);
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

  renderFormContent() {
    const {
      investigatorId,
      signedIn,
      refreshNetworkStatus,
      networkType,
      isConnected,
      tabooSets,
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
      <React.Fragment>
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`Name` }
        </DialogComponent.Description>
        <DialogComponent.Input
          textInputRef={this._captureTextInputRef}
          value={deckName}
          onChangeText={this._onDeckNameChange}
          returnKeyType="done"
        />
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`Required Cards` }
        </DialogComponent.Description>
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
        <TabooSetDialogOptions
          tabooSets={tabooSets}
          tabooSetId={tabooSetId}
          setTabooSetId={this._setTabooSetId}
        />
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`Deck Type` }
        </DialogComponent.Description>
        <DialogComponent.Switch
          label={t`Create on ArkhamDB`}
          value={!offlineDeck}
          disabled={!signedIn || !isConnected || networkType === NetInfoStateType.none}
          onValueChange={this._onDeckTypeChange}
          trackColor={COLORS.switchTrackColor}
        />
        { !signedIn && (
          <DialogComponent.Description style={[typography.small, space.marginBottomS, styles.networkMessage]}>
            { t`Visit Settings to sign in to ArkhamDB.` }
          </DialogComponent.Description>
        ) }
        { (!isConnected || networkType === NetInfoStateType.none) && (
          <TouchableOpacity onPress={refreshNetworkStatus}>
            <DialogComponent.Description style={[typography.small, { color: COLORS.red }, space.marginBottomS]}>
              { t`You seem to be offline. Refresh Network?` }
            </DialogComponent.Description>
          </TouchableOpacity>
        ) }
        { hasStarterDeck && (
          <DialogComponent.Switch
            label={t`Use Starter Deck?`}
            value={starterDeck}
            onValueChange={this._onStarterDeckChange}
            trackColor={COLORS.switchTrackColor}
          />
        ) }
      </React.Fragment>
    );
  }

  render() {
    const {
      toggleVisible,
      viewRef,
      investigatorId,
    } = this.props;
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
      <Dialog
        title={t`New Deck`}
        visible={!!investigatorId}
        viewRef={viewRef}
      >
        { this.renderFormContent() }
        <DialogComponent.Button
          label={t`Cancel`}
          onPress={toggleVisible}
        />
        <DialogComponent.Button
          label={t`Okay`}
          color={okDisabled ? COLORS.darkGray : COLORS.lightBlue}
          disabled={okDisabled}
          onPress={this._onOkayPress}
        />
      </Dialog>
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

export default withPlayerCards<OwnProps>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withLoginState<OwnProps & ReduxProps & ReduxActionProps & PlayerCardProps>(
      withNetworkStatus(NewDeckOptionsDialog),
      { noWrapper: true }
    )
  )
);

const styles = StyleSheet.create({
  spinner: {
    height: 80,
  },
  networkMessage: {
    marginLeft: Platform.OS === 'ios' ? 28 : 8,
    marginRight: Platform.OS === 'ios' ? 28 : 8,
  },
});
