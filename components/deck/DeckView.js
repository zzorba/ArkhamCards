import React from 'react';
import PropTypes from 'prop-types';
import { delay, forEach, keys } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { iconsMap } from '../../app/NavIcons';
import * as Actions from '../../actions';
import { parseDeck } from './parseDeck';
import DeckViewTab from './DeckViewTab';
import DeckNavFooter from './DeckNavFooter';

class DeckView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    isPrivate: PropTypes.bool,
    // From realm.
    cards: PropTypes.object,
    // From redux.
    deck: PropTypes.object,
    getDeck: PropTypes.func.isRequired,
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

    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.edit,
          id: 'edit',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.props.getDeck(this.props.id, this.props.isPrivate);
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
    this.setState({
      saving: true,
    });
    delay(() => this.props.navigator.pop(), 3000);
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
        <View>
          <Text>Loading: { this.props.id }</Text>
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
  if (props.id in state.decks.all) {
    return {
      deck: state.decks.all[props.id],
    };
  }
  return {
    deck: null,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(DeckView),
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
});
