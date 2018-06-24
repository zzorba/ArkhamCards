import React from 'react';
import PropTypes from 'prop-types';
import { forEach, keys } from 'lodash';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { iconsMap } from '../../app/NavIcons';
import * as Actions from '../../actions';
import { saveDeck } from '../../lib/authApi';
import { parseDeck } from '../parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from '../DeckNavFooter';
import { getDeck } from '../../reducers';

const SHOW_EDIT_BUTTON = false;

class DeckDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool,
    // From realm.
    cards: PropTypes.object,
    // From redux.
    deck: PropTypes.object,
    fetchDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      slots: {},
      loaded: false,
      saving: false,
    };

    this._updateSlots = this.updateSlots.bind(this);
    this._saveEdits = this.saveEdits.bind(this);
    this._clearEdits = this.clearEdits.bind(this);

    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.props.fetchDeck(this.props.id, this.props.isPrivate);
    if (this.props.deck && this.props.deck.investigator_code) {
      this.loadCards(this.props.deck);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deck !== this.props.deck) {
      this.loadCards(nextProps.deck);
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
          backButtonTitle: 'Save',
          passProps: {
            deck,
            slots: this.state.slots,
            updateSlots: this._updateSlots,
          },
          navigatorStyle: {
            tabBarHidden: true,
          },
        });
      }
    }
  }

  saveEdits() {
    const {
      deck,
    } = this.props;
    const {
      slots,
    } = this.state;
    saveDeck(deck.id, deck.name, slots);
  }

  clearEdits() {
    this.setState({
      slots: this.props.deck ? this.props.deck.slots : {},
    });
  }

  hasPendingEdits() {
    const {
      deck,
    } = this.props;

    const {
      slots,
    } = this.state;

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

  updateSlots(newSlots) {
    this.setState({
      slots: newSlots,
    });
  }

  loadCards(deck) {
    if (!deck.next_deck) {
      const rightButtons = SHOW_EDIT_BUTTON ? [
        {
          icon: iconsMap.edit,
          id: 'edit',
        },
      ] : [];
      this.props.navigator.setButtons({
        rightButtons,
      });
    }
    this.setState({
      slots: deck.slots,
      loaded: true,
    });
  }

  render() {
    const {
      deck,
      cards,
      navigator,
    } = this.props;

    if (!deck || !this.state.loaded) {
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

    const {
      slots,
    } = this.state;
    const cardsInDeck = {};
    cards.forEach(card => {
      if (slots[card.code] || deck.investigator_code === card.code) {
        cardsInDeck[card.code] = card;
      }
    });

    const pDeck = parseDeck(deck, slots, cardsInDeck);
    return (
      <View style={styles.container}>
        <DeckViewTab
          navigator={navigator}
          parsedDeck={pDeck}
          cards={cardsInDeck}
        />
        <DeckNavFooter
          navigator={navigator}
          parsedDeck={pDeck}
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
