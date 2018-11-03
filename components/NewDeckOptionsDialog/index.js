import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { countBy, find, forEach, map, throttle } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import DialogComponent from 'react-native-dialog';

import RequiredCardSwitch from './RequiredCardSwitch';
import { handleAuthErrors } from '../authHelper';
import { showDeckModal } from '../navHelper';
import Dialog from '../core/Dialog';
import * as Actions from '../../actions';
import { newDeck, saveDeck } from '../../lib/authApi';
import L from '../../app/i18n';
import typography from '../../styles/typography';
import space from '../../styles/space';
import { COLORS } from '../../styles/colors';

class NewDeckOptionsDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    //
    toggleVisible: PropTypes.func.isRequired,
    investigatorId: PropTypes.string,
    viewRef: PropTypes.object,
    onCreateDeck: PropTypes.func,

    // from realm
    investigators: PropTypes.object.isRequired,
    requiredCards: PropTypes.object.isRequired,
    // from redux
    login: PropTypes.func.isRequired,
    setNewDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      deckName: null,
      optionSelected: [true],
    };

    this._toggleOptionsSelected = this.toggleOptionsSelected.bind(this);
    this._processNewDeckOptions = this.processNewDeckOptions.bind(this);
    this._onDeckNameChange = this.onDeckNameChange.bind(this);
    this._onOkayPress = throttle(this.onOkayPress.bind(this), 200);
    this._captureTextInputRef = this.captureTextInputRef.bind(this);
    this._textInputRef = null;
  }

  componentDidUpdate(prevProps) {
    const {
      investigatorId,
    } = this.props;
    if (investigatorId && investigatorId !== prevProps.investigatorId) {
      this.resetForm();
    }
  }

  onDeckNameChange(value) {
    this.setState({
      deckName: value,
    });
  }

  toggleOptionsSelected(index, value) {
    const optionSelected = this.state.optionSelected.slice();
    optionSelected[index] = value;

    this.setState({
      optionSelected,
    });
  }

  captureTextInputRef(ref) {
    this._textInputRef = ref;
  }

  resetForm() {
    this.setState({
      deckName: this.deckName(),
      saving: false,
      optionSelected: [true],
    });
  }

  showNewDeck(deck) {
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

  processNewDeckOptions(deck) {
    const {
      optionSelected,
    } = this.state;

    if (optionSelected[0] === true && countBy(optionSelected) === 1) {
      // Deck is good as is...
      this.showNewDeck(deck);
    } else {
      const options = this.requiredCardOptions();
      forEach(optionSelected, (include, index) => {
        const cards = options[index];
        forEach(cards, card => {
          if (include) {
            deck.slots[card.code] = card.deck_limit || card.quantity;
          } else if (deck.slots[card.code]) {
            delete deck.slots[card.code];
          }
        });
      });
      const savePromise = saveDeck(
        deck.id,
        deck.name,
        deck.slots,
        deck.problem,
        0
      );
      handleAuthErrors(
        savePromise,
        // onSuccess
        deck => this.showNewDeck(deck),
        // onFailure
        () => {
          this.setState({
            saving: false,
          });
        },
        // retry
        () => {
          this.processNewDeckOptions(deck);
        },
        // login
        this.props.login
      );
    }
  }

  onOkayPress() {
    const {
      login,
    } = this.props;
    const {
      deckName,
    } = this.state;
    const investigator = this.investigator();
    if (investigator && !this.state.saving) {
      this.setState({
        saving: true,
      });
      handleAuthErrors(
        newDeck(investigator.code, deckName),
        this._processNewDeckOptions,
        () => {
          this.setState({
            saving: false,
          });
        },
        () => this.onOkayPress(),
        login
      );
    }
  }

  investigator() {
    const {
      investigatorId,
      investigators,
    } = this.props;
    return investigatorId ? investigators[investigatorId] : null;
  }

  deckName() {
    const investigator = this.investigator();
    if (!investigator) {
      return null;
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
    const result = [[]];
    forEach(
      investigator.deck_requirements.card,
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
    } = this.props;
    const {
      saving,
      deckName,
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

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(NewDeckOptionsDialog), {
    schemas: ['Card'],
    mapToProps(results) {
      const investigators = {};
      forEach(
        results.cards.filtered(`type_code == 'investigator'`),
        card => {
          if (!card.spoiler) {
            investigators[card.code] = card;
          }
        }
      );
      const requiredCards = {};
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
