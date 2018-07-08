import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, forEach, keys, map, range } from 'lodash';
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

import { iconsMap } from '../../app/NavIcons';
import * as Actions from '../../actions';
import { saveDeck } from '../../lib/authApi';
import DeckValidation from '../../lib/DeckValidation';
import { parseDeck } from '../parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '../DeckNavFooter';
import { getDeck } from '../../reducers';

const SHOW_EDIT_BUTTON = true;

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
    updateDeck: PropTypes.func.isRequired,
    fetchPublicDeck: PropTypes.func.isRequired,
    fetchPrivateDeck: PropTypes.func.isRequired,
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

    this.state = {
      parsedDeck: null,
      cardsInDeck: {},
      slots: {},
      loaded: false,
      saving: false,
      leftButtons,
      hasPendingEdits: false,
    };

    this._syncNavigatorButtons = this.syncNavigatorButtons.bind(this);
    this._updateSlots = this.updateSlots.bind(this);
    this._saveEdits = this.saveEdits.bind(this);
    this._clearEdits = this.clearEdits.bind(this);

    if (props.modal) {
      props.navigator.setButtons({
        leftButtons,
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
    } = this.props;
    if (isPrivate) {
      fetchPrivateDeck(id);
    } else {
      fetchPublicDeck(id, false);
    }
    if (deck && deck.investigator_code) {
      this.loadCards(this.props.deck);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deck !== this.props.deck) {
      this.loadCards(nextProps.deck);
    }
  }

  syncNavigatorButtons() {
    const {
      navigator,
      deck,
    } = this.props;
    const {
      leftButtons,
      hasPendingEdits,
    } = this.state;
    const rightButtons = (!deck.next_deck && SHOW_EDIT_BUTTON) ? [
      {
        icon: iconsMap.edit,
        id: 'edit',
      },
    ] : [];
    if (hasPendingEdits) {
      navigator.setButtons({
        leftButtons: [
          {
            systemItem: 'save',
            id: 'save',
          }, {
            systemItem: 'cancel',
            id: 'cancel',
          },
        ],
        rightButtons,
      });
    } else {
      navigator.setButtons({
        leftButtons: leftButtons,
        rightButtons,
      });
    }
  }

  onNavigatorEvent(event) {
    const {
      navigator,
      deck,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'edit') {
        navigator.push({
          screen: 'Deck.Edit',
          passProps: {
            deck,
            slots: this.state.slots,
            updateSlots: this._updateSlots,
          },
        });
      } else if (event.id === 'back') {
        navigator.dismissAllModals();
      } else if (event.id === 'cancel') {
        this.clearEdits();
      } else if (event.id === 'save') {
        this.saveEdits();
      }
    }
  }

  saveEdits() {
    const {
      deck,
      navigator,
      updateDeck,
    } = this.props;
    Alert.alert('Coming soon!', 'Sorry!\nSave functionality is coming very soon.');
    return;
    const {
      parsedDeck: {
        slots,
        investigator,
      },
      cardsInDeck,
    } = this.state;
    const validator = new DeckValidation(investigator);
    const problemObj = validator.getProblem(flatMap(keys(slots), code => {
      const card = cardsInDeck[code];
      return map(range(0, slots[code]), () => card);
    }));
    const problem = problemObj ? problemObj.reason : '';
    saveDeck(deck.id, deck.name, slots, problem).then(deck => {
      updateDeck(deck.id, deck);
    }, err => {
      Alert.alert('Error', err.message || err);
    });
  }

  clearEdits() {
    this.updateSlots(this.props.deck.slots);
  }

  hasPendingEdits(slots) {
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

    return (keys(removals).length > 0 || keys(additions).length > 0);
  }

  static getCardsInDeck(deck, cards, slots) {
    const cardsInDeck = {};
    cards.forEach(card => {
      if (slots[card.code] || deck.investigator_code === card.code) {
        cardsInDeck[card.code] = card;
      }
    });
    return cardsInDeck;
  }

  updateSlots(newSlots) {
    const {
      deck,
      cards,
    } = this.props;
    const cardsInDeck = DeckDetailView.getCardsInDeck(deck, cards, newSlots);
    const parsedDeck = parseDeck(deck, newSlots, cardsInDeck);
    this.setState({
      slots: newSlots,
      cardsInDeck,
      parsedDeck,
      hasPendingEdits: this.hasPendingEdits(newSlots),
    }, this._syncNavigatorButtons);
  }

  loadCards(deck) {
    const {
      cards,
    } = this.props;
    const cardsInDeck = DeckDetailView.getCardsInDeck(deck, cards, deck.slots);
    const parsedDeck = parseDeck(deck, deck.slots, cardsInDeck);
    this.setState({
      slots: deck.slots,
      cardsInDeck,
      parsedDeck,
      hasPendingEdits: false,
      loaded: true,
    }, this._syncNavigatorButtons);
  }

  render() {
    const {
      deck,
      cards,
      navigator,
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
            style={[{ height: 80 }]}
            size="small"
            animating
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <DeckViewTab
          navigator={navigator}
          parsedDeck={parsedDeck}
          cards={cardsInDeck}
        />
        <DeckNavFooter
          navigator={navigator}
          parsedDeck={parsedDeck}
          cards={cardsInDeck}
        />
      </View>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(DeckDetailView),
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
    height: '100%',
    width: '100%',
  },
  activityIndicatorContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
