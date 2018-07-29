import React from 'react';
import PropTypes from 'prop-types';
import { findIndex, flatMap, forEach, keys, map, range } from 'lodash';
import {
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Dialog from '../core/Dialog';
import withTextEditDialog from '../core/withTextEditDialog';
import Button from '../core/Button';
import { iconsMap } from '../../app/NavIcons';
import * as Actions from '../../actions';
import { saveDeck } from '../../lib/authApi';
import DeckValidation from '../../lib/DeckValidation';
import { parseDeck } from '../parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '../DeckNavFooter';
import { getDeck } from '../../reducers';

class DeckDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool,
    modal: PropTypes.bool,
    // From realm.
    cards: PropTypes.object,
    // From redux.
    deck: PropTypes.object,
    previousDeck: PropTypes.object,
    updateDeck: PropTypes.func.isRequired,
    fetchPublicDeck: PropTypes.func.isRequired,
    fetchPrivateDeck: PropTypes.func.isRequired,
    showTextEditDialog: PropTypes.func.isRequired,
    captureViewRef: PropTypes.func.isRequired,
    viewRef: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const leftButtons = props.modal ? [
      Platform.OS === 'ios' ? {
        systemItem: 'done',
        id: 'back',
      } : {
        icon: iconsMap['chevron-left'],
        id: 'back',
      },
    ] : [];
    const rightButtons = props.isPrivate && props.modal && !props.deck.next_deck ? [
      {
        id: 'editName',
        icon: iconsMap.edit,
      },
    ] : [];

    this.state = {
      parsedDeck: null,
      cardsInDeck: {},
      slots: {},
      loaded: false,
      saving: false,
      leftButtons,
      nameChange: null,
      hasPendingEdits: false,
    };
    this._saveName = this.saveName.bind(this);
    this._onEditPressed = this.onEditPressed.bind(this);
    this._onUpgradePressed = this.onUpgradePressed.bind(this);
    this._clearEdits = this.clearEdits.bind(this);
    this._syncNavigatorButtons = this.syncNavigatorButtons.bind(this);
    this._updateSlots = this.updateSlots.bind(this);
    this._saveEdits = this.saveEdits.bind(this, false);
    this._clearEdits = this.clearEdits.bind(this);

    if (props.modal) {
      props.navigator.setButtons({
        leftButtons,
        rightButtons,
      });
    }
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    const {
      id,
      isPrivate,
      fetchPublicDeck,
      fetchPrivateDeck,
      deck,
      previousDeck,
    } = this.props;
    if (isPrivate) {
      fetchPrivateDeck(id);
    } else {
      fetchPublicDeck(id, false);
    }
    if (deck && deck.investigator_code) {
      if (deck && deck.previous_deck && !previousDeck) {
        if (isPrivate) {
          fetchPrivateDeck(deck.previous_deck);
        } else {
          fetchPublicDeck(deck.previous_deck, false);
        }
      } else {
        this.loadCards(deck, previousDeck);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      deck,
      isPrivate,
      previousDeck,
      fetchPrivateDeck,
      fetchPublicDeck,
    } = this.props;
    if (deck !== prevProps.deck && deck.previous_deck && !previousDeck) {
      if (isPrivate) {
        fetchPrivateDeck(deck.previous_deck);
      } else {
        fetchPublicDeck(deck.previous_deck, false);
      }
    }
    if (deck !== prevProps.deck || previousDeck !== prevProps.previousDeck) {
      if (deck && (!deck.previous_deck || previousDeck)) {
        this.loadCards(deck, previousDeck);
      }
    }
  }

  syncNavigatorButtons() {
    /* const {
      navigator,
    } = this.props;
    const {
      leftButtons,
      hasPendingEdits,
    } = this.state;

    if (hasPendingEdits) {
      navigator.setButtons({
        rightButtons: [
          {
            systemItem: 'save',
            id: 'save',
          },
        ],
      });
    } else {
      navigator.setButtons({
        rightButtons: [],
      });
    } */
  }

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'editName') {
        this.showEditNameDialog();
      } else if (event.id === 'edit') {
        this.onEditPressed();
      } else if (event.id === 'back') {
        if (this.state.hasPendingEdits) {
          Alert.alert(
            'Save deck changes?',
            'Looks like you have made some changes that have not been saved.',
            [{
              text: 'Save Changes',
              onPress: () => {
                this.saveEdits(true);
              },
            }, {
              text: 'Discard Changes',
              style: 'destructive',
              onPress: () => {
                navigator.dismissAllModals();
              }
            }, {
              text: 'Cancel',
              style: 'cancel',
            }],
          );
        } else {
          navigator.dismissAllModals();
        }
      }
    }
  }

  saveName(name) {
    const {
      slots,
    } = this.state;
    const pendingEdits = this.hasPendingEdits(name, slots);
    this.setState({
      nameChange: name,
      hasPendingEdits: pendingEdits,
      editNameDialogVisible: false,
    });
    this.props.navigator.setTitle({ title: name });
  }

  onEditPressed() {
    const {
      navigator,
      deck,
      previousDeck,
    } = this.props;
    navigator.push({
      screen: 'Deck.Edit',
      passProps: {
        deck,
        previousDeck,
        slots: this.state.slots,
        updateSlots: this._updateSlots,
      },
    });
  }

  onUpgradePressed() {
    const {
      navigator,
      deck,
    } = this.props;
    navigator.push({
      screen: 'Deck.Upgrade',
      title: 'Upgrade',
      backButtonTitle: 'Cancel',
      passProps: {
        id: deck.id,
      },
    });
  }

  saveEdits(dismissAfterSave) {
    const {
      navigator,
      deck,
      updateDeck,
    } = this.props;
    this.setState({
      saving: true,
    });
    const {
      parsedDeck,
      cardsInDeck,
      nameChange,
    } = this.state;
    const {
      slots,
      investigator,
    } = parsedDeck;

    const validator = new DeckValidation(investigator);
    const problemObj = validator.getProblem(flatMap(keys(slots), code => {
      const card = cardsInDeck[code];
      return map(range(0, slots[code]), () => card);
    }));
    const problem = problemObj ? problemObj.reason : '';

    saveDeck(
      deck.id,
      nameChange || deck.name,
      slots,
      problem,
      parsedDeck.spentXp
    ).then(deck => {
      updateDeck(deck.id, deck, true);
      if (dismissAfterSave) {
        navigator.dismissAllModals();
      } else {
        this.setState({
          saving: false,
          nameChange: null,
          hasPendingEdits: false,
        });
      }
    }, err => {
      this.setState({
        saving: false,
      });
      Alert.alert('Error', err.message || err);
    });
  }

  clearEdits() {
    const {
      deck,
      navigator,
    } = this.props;
    this.setState({
      nameChange: null,
    }, () => {
      navigator.setTitle({ title: deck.name });
      this.updateSlots(deck.slots);
    });
  }

  hasPendingEdits(nameChange, slots) {
    const {
      deck,
    } = this.props;

    const removals = {};
    forEach(keys(deck.slots), code => {
      const currentDeckCount = slots[code] || 0;
      if (deck.slots[code] > currentDeckCount) {
        removals[code] = deck.slots[code] - currentDeckCount;
      }
    });
    const additions = {};
    forEach(keys(slots), code => {
      const ogDeckCount = deck.slots[code] || 0;
      if (ogDeckCount < slots[code]) {
        removals[code] = slots[code] - ogDeckCount;
      }
    });

    return (nameChange && deck.name !== nameChange) ||
      keys(removals).length > 0 ||
      keys(additions).length > 0;
  }

  static getCardsInDeck(deck, cards, slots, previousDeck) {
    const cardsInDeck = {};
    cards.forEach(card => {
      if (slots[card.code] || deck.investigator_code === card.code ||
        (previousDeck &&
          (previousDeck.slots[card.code] || previousDeck.investigator_code === card.code))) {
        cardsInDeck[card.code] = card;
      }
    });
    return cardsInDeck;
  }

  updateSlots(newSlots) {
    const {
      deck,
      previousDeck,
      cards,
    } = this.props;
    const cardsInDeck = DeckDetailView.getCardsInDeck(deck, cards, newSlots, previousDeck);
    const parsedDeck = parseDeck(deck, newSlots, cardsInDeck, previousDeck);
    this.setState({
      slots: newSlots,
      cardsInDeck,
      parsedDeck,
      hasPendingEdits: this.hasPendingEdits(this.state.nameChange, newSlots),
    }, this._syncNavigatorButtons);
  }

  loadCards(deck, previousDeck) {
    const {
      cards,
    } = this.props;
    const {
      slots,
    } = this.state;
    if (findIndex(keys(slots), code => deck.slots[code] !== slots[code]) !== -1 ||
      findIndex(keys(deck.slots), code => deck.slots[code] !== slots[code]) !== -1) {
      const cardsInDeck = DeckDetailView.getCardsInDeck(deck, cards, deck.slots, previousDeck);
      const parsedDeck = parseDeck(deck, deck.slots, cardsInDeck, previousDeck);
      this.setState({
        slots: deck.slots,
        cardsInDeck,
        parsedDeck,
        hasPendingEdits: false,
        loaded: true,
      }, this._syncNavigatorButtons);
    }
  }

  showEditNameDialog() {
    const {
      deck,
      showTextEditDialog,
    } = this.props;
    showTextEditDialog(
      'Edit Deck Name',
      this.state.nameChange || deck.name,
      this._saveName
    );
  }

  renderSavingDialog() {
    const {
      viewRef,
    } = this.props;
    const {
      saving,
    } = this.state;
    return (
      <Dialog title="Saving" visible={saving} viewRef={viewRef}>
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          animating
        />
      </Dialog>
    );
  }

  renderButtons() {
    const {
      deck,
    } = this.props;
    const {
      hasPendingEdits,
    } = this.state;
    if (!deck || deck.next_deck) {
      return null;
    }
    return (
      <View>
        <View style={styles.buttonRow}>
          <Button
            style={styles.button}
            text="Edit"
            color="purple"
            icon={<MaterialIcons size={20} color="#FFFFFF" name="edit" />}
            onPress={this._onEditPressed}
          />
          { !hasPendingEdits && (
            <Button
              text="Upgrade Deck"
              color="yellow"
              icon={<MaterialCommunityIcons size={20} color="#FFFFFF" name="arrow-up-bold" />}
              onPress={this._onUpgradePressed}
            />
          ) }
        </View>
        { hasPendingEdits && (
          <View style={styles.buttonRow}>
            <Button
              style={styles.button}
              text="Save"
              color="green"
              onPress={this._saveEdits}
            />
            <Button
              text="Cancel Edits"
              color="red"
              onPress={this._clearEdits}
            />
          </View>
        ) }
      </View>
    );
  }

  render() {
    const {
      deck,
      navigator,
      isPrivate,
      captureViewRef,
    } = this.props;
    const {
      loaded,
      parsedDeck,
      cardsInDeck,
    } = this.state;

    if (!deck || !loaded || !parsedDeck) {
      return (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            style={styles.spinner}
            size="small"
            animating
          />
        </View>
      );
    }

    return (
      <View>
        <View style={styles.container} ref={captureViewRef}>
          <DeckViewTab
            navigator={navigator}
            deck={deck}
            parsedDeck={parsedDeck}
            cards={cardsInDeck}
            isPrivate={isPrivate}
            buttons={this.renderButtons()}
          />
          <DeckNavFooter
            navigator={navigator}
            parsedDeck={parsedDeck}
            cards={cardsInDeck}
          />
        </View>
        { this.renderSavingDialog() }
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  const deck = getDeck(state, props.id);
  return {
    deck,
    previousDeck: deck && deck.previous_deck && getDeck(state, deck.previous_deck),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(withTextEditDialog(DeckDetailView)),
  {
    schemas: ['Card'],
    mapToProps(results, realm) {
      return {
        realm,
        cards: results.cards,
      };
    },
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  spinner: {
    height: 80,
  },
  activityIndicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  buttonRow: {
    paddingTop: 8,
    flexDirection: 'row',
  },
  button: {
    marginRight: 8,
  },
});
