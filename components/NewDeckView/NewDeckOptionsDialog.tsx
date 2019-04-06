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
import { connectRealm, CardResults } from 'react-native-realm';
import DialogComponent from 'react-native-dialog';

import RequiredCardSwitch from './RequiredCardSwitch';
import { handleAuthErrors } from '../authHelper';
import { showDeckModal } from '../navHelper';
import { newLocalDeck } from '../decks/localHelper';
import Dialog from '../core/Dialog';
import withNetworkStatus, { InjectedNetworkStatusProps } from '../core/withNetworkStatus';
import withLoginState, { LoginStateProps } from '../withLoginState';
import { setNewDeck } from '../../actions';
import { Deck, Slots } from '../../actions/types';
import { RANDOM_BASIC_WEAKNESS } from '../../constants';
import Card, { CardsMap } from '../../data/Card';
import { newCustomDeck } from '../../lib/authApi';
import { getNextLocalDeckId, AppState } from '../../reducers';
import L from '../../app/i18n';
import typography from '../../styles/typography';
import space from '../../styles/space';
import { COLORS } from '../../styles/colors';

interface OwnProps {
  componentId: string;
  toggleVisible: () => void;
  investigatorId?: string;
  viewRef?: View;
  onCreateDeck: (deck: Deck) => void;
}

interface RealmProps {
  investigators: CardsMap;
  requiredCards: CardsMap;
}

interface ReduxProps {
  nextLocalDeckId: number;
}

interface ReduxActionProps {
  setNewDeck: (id: number, deck: Deck) => void;
}

type Props = OwnProps &
  RealmProps & ReduxProps & ReduxActionProps &
  InjectedNetworkStatusProps & LoginStateProps;

interface State {
  saving: boolean;
  deckName?: string;
  offlineDeck: boolean;
  optionSelected: boolean[];
}

class NewDeckOptionsDialog extends React.Component<Props, State> {
  _textInputRef?: TextInput;
  _onOkayPress!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      saving: false,
      offlineDeck: !props.signedIn || props.networkType === 'none',
      optionSelected: [true],
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

  showNewDeck(deck: Deck) {
    const {
      componentId,
      setNewDeck,
      onCreateDeck,
      toggleVisible,
    } = this.props;
    const investigator = this.investigator();
    setNewDeck(deck.id, deck);
    this.setState({
      saving: false,
    });
    if (Platform.OS === 'android') {
      toggleVisible();
    }
    // Change the deck options for required cards, if present.
    onCreateDeck && onCreateDeck(deck);
    showDeckModal(componentId, deck, investigator);
  }

  getSlots() {
    const {
      requiredCards,
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
        const card = requiredCards[cardRequirement.code];
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
      login,
      signedIn,
      nextLocalDeckId,
      networkType,
    } = this.props;
    const {
      deckName,
      offlineDeck,
      saving,
    } = this.state;
    const investigator = this.investigator();
    if (investigator && (!saving || isRetry)) {
      if (offlineDeck || !signedIn || networkType === 'none') {
        const deck = newLocalDeck(
          nextLocalDeckId,
          deckName || 'New Deck',
          investigator.code,
          this.getSlots()
        );
        this.showNewDeck(deck);
      } else {
        this.setState({
          saving: true,
        });
        const newDeckPromise = newCustomDeck(
          investigator.code,
          deckName || 'New Deck',
          this.getSlots(),
          {},
          'too_few_cards'
        );
        handleAuthErrors(
          newDeckPromise,
          deck => this.showNewDeck(deck),
          () => {
            this.setState({
              saving: false,
            });
          },
          () => this.onOkayPress(true),
          login
        );
      }
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
        return L('The Adventures of {{name}}', { name: investigator.name });
      case 'seeker':
        return L('{{name}} Investigates', { name: investigator.name });
      case 'mystic':
        return L('The {{name}} Mysteries', { name: investigator.name });
      case 'rogue':
        return L('The {{name}} Job', { name: investigator.name });
      case 'survivor':
        return L('{{name}} on the Road', { name: investigator.name });
      default:
        return L('{{name}} Does It All', { name: investigator.name });
    }
  }

  requiredCardOptions() {
    const {
      requiredCards,
    } = this.props;
    const investigator = this.investigator();
    if (!investigator) {
      return [];
    }
    const result: Card[][] = [[]];
    forEach(
      investigator.deck_requirements ? investigator.deck_requirements.card : [],
      cardRequirement => {
        result[0].push(requiredCards[cardRequirement.code]);
        if (cardRequirement.alternates && cardRequirement.alternates.length) {
          forEach(cardRequirement.alternates, (altCode, index) => {
            while (result.length <= index + 1) {
              result.push([]);
            }
            result[index + 1].push(requiredCards[altCode]);
          });
        }
      }
    );
    return result;
  }

  renderFormContent() {
    const {
      investigatorId,
      signedIn,
      refreshNetworkStatus,
      networkType,
    } = this.props;
    const {
      saving,
      deckName,
      offlineDeck,
      optionSelected,
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
    return (
      <React.Fragment>
        <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
          { L('NAME') }
        </DialogComponent.Description>
        <DialogComponent.Input
          textInputRef={this._captureTextInputRef}
          value={deckName}
          onChangeText={this._onDeckNameChange}
          returnKeyType="done"
        />
        <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
          { L('REQUIRED CARDS') }
        </DialogComponent.Description>
        { map(cardOptions, (requiredCards, index) => {
          return (
            <RequiredCardSwitch
              key={`${investigatorId}-${index}`}
              index={index}
              disabled={index === 0 && cardOptions.length === 1}
              label={map(requiredCards, card => card.name).join('\n')}
              value={optionSelected[index] || false}
              onValueChange={this._toggleOptionsSelected}
            />
          );
        }) }
        <DialogComponent.Description style={[typography.smallLabel, space.marginBottomS]}>
          { L('DECK TYPE') }
        </DialogComponent.Description>
        <DialogComponent.Switch
          label={L('Create on ArkhamDB')}
          value={!offlineDeck}
          disabled={!signedIn || networkType === 'none'}
          onValueChange={this._onDeckTypeChange}
          trackColor={COLORS.switchTrackColor}
        />
        { !signedIn && (
          <DialogComponent.Description style={[typography.small, space.marginBottomS]}>
            { L('Visit Settings to sign in to ArkhamDB.') }
          </DialogComponent.Description>
        ) }
        { networkType === 'none' && (
          <TouchableOpacity onPress={refreshNetworkStatus}>
            <DialogComponent.Description style={[typography.small, { color: COLORS.red }, space.marginBottomS]}>
              { L('You seem to be offline. Refresh Network?') }
            </DialogComponent.Description>
          </TouchableOpacity>
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
        title={L('New Deck')}
        visible={!!investigatorId}
        viewRef={viewRef}
      >
        { this.renderFormContent() }
        <DialogComponent.Button
          label={L('Cancel')}
          onPress={toggleVisible}
        />
        <DialogComponent.Button
          label={L('Okay')}
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
    nextLocalDeckId: getNextLocalDeckId(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({ setNewDeck }, dispatch);
}

export default connectRealm<OwnProps, RealmProps, Card>(
  connect<ReduxProps, ReduxActionProps, OwnProps & RealmProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(
    withLoginState<OwnProps & ReduxProps & ReduxActionProps & RealmProps>(
      withNetworkStatus(NewDeckOptionsDialog),
      { noWrapper: true }
    )
  ), {
    schemas: ['Card'],
    mapToProps(results: CardResults<Card>) {
      const investigators: CardsMap = {};
      forEach(
        results.cards.filtered(`type_code == 'investigator'`),
        card => {
          if (!card.spoiler) {
            investigators[card.code] = card;
          }
        }
      );
      const requiredCards: CardsMap = {};
      forEach(
        results.cards.filtered(`has_restrictions == true`),
        card => {
          requiredCards[card.code] = card;
        }
      );
      return {
        investigators,
        requiredCards,
      };
    },
  });

const styles = StyleSheet.create({
  spinner: {
    height: 80,
  },
});
