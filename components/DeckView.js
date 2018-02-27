import React from 'react';
import PropTypes from 'prop-types';
const {
  StyleSheet,
  ListView,
  View,
  Text,
  ActivityIndicator
} = require('react-native');

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions';

function filterBy(cardIds, cards, field, value) {
  return cardIds.filter(c => cards[c.id][field] === value);
}

function groupAssets(cardIds, cards) {
  const assets = filterBy(cardIds, cards, 'type_code', 'asset');
  return [
    { type: 'Hand', cardIds: filterBy(assets, cards, 'slot', 'Hand') },
    { type: 'Arcane', cardIds: filterBy(assets, cards, 'slot', 'Arcane') },
    { type: 'Accessory', cardIds: filterBy(assets, cards, 'slot', 'Accessory') },
    { type: 'Body', cardIds: filterBy(assets, cards, 'slot', 'Body') },
    { type: 'Ally', cardIds: filterBy(assets, cards, 'slot', 'Ally') },
    { type: 'Other', cardIds: filterBy(assets, cards, 'slot', undefined) },
  ].filter(asset => asset.cardIds.size > 0);
}

function isSpecialCard(card) {
  return card.subtype_code === 'weakeness' ||
    card.spoiler ||
    card.restrictions;
}

function splitCards(cardIds, cards) {
  const result = {};

  const groupedAssets = groupAssets(cardIds, cards);
  if (groupedAssets.size > 0) {
    result.assets = groupedAssets;
  }
  ['event', 'skill', 'treachery', 'enemy'].forEach(type_code => {
    const typeCards = filterBy(cardIds, cards, 'type_code', type_code);
    if (typeCards.size > 0) {
      result[type_code] = typeCards;
    }
  })
  return result;
}

function computeXp(card) {
  return (card.exceptional ? 2 : 1) * (card.xp);
}

function parseDeck(deck, cards) {
  if (!deck) {
    return {};
  }
  const cardIds = Object.keys(deck.slots).map(id => {
    return {
      id,
      quantity: deck.slots[id],
    };
  });
  const investigator = cardIds.find(c => cards[c.id].type_code === 'investigator');
  const specials = cardsIds.filter(c => isSpecialCard(cards[c.id]) && c.id !== investigator.id);
  const normalCards = specials.filter(c => !isSpecialCard(cards[c.id]) && c.id !== investigator.id);
  return {
    investigator: cards[investigator.id],
    meta: {
      normalCardCount: normalCards.map(c => c.quantity).sum(),
      totalCardCount: cardIds.map(c => c.quantity).sum(),
      experience: cardIds.map(c => computeXp(cards[c.id]) * c.quantity).sum(),
      packs: cardIds.map(c => cards[c.id].pack_code).distinct().size,
    },
    normal: splitCards(normalCards, cards, deck.slots),
    special: splitCards(special, cards, deck.slots),
  };
}

class DeckView extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    getDeck: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      ds,
      parsedDeck: parseDeck(props.deck, props.cards),
    };

    this._renderCard = this.renderCard.bind(this);
  }

  componentDidMount() {
    this.props.getDeck(this.props.id);
  }

  renderCard(rowData, sectionID, rowID) {
    const card = this.props.cards[rowData.cardId];
    return (
      <View>
        <Text>{`${rowData.quantity}x ${card.name}`}</Text>
      </View>
    )
  }

  render() {
    const {
      deck,
      cards,
    } = this.props
    if (!deck) {
      return (
        <View>
          <Text>Loading: { this.props.id }</Text>
        </View>
      );
    }

    const deckList = Object.keys(deck.slots).map(cardId => {
      return {
        cardId,
        quantity: deck.slots[cardId],
      };
    })
    return (
      <View>
        <Text>{ deck.name }</Text>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.ds.cloneWithRows(deckList)}
          renderRow={this._renderCard} />
      </View>
    );
  }
};

// The function takes data from the app current state,
// // and insert/links it into the props of our component.
// // This function makes Redux know that this component needs to be passed a piece of the state
function mapStateToProps(state, props) {
  if (props.id in state.decks.all) {
    return {
      deck: state.decks.all[props.id],
      cards: state.cards.all,
    };
  }
  return {
    deck: null,
  };
}

// Doing this merges our actions into the component’s props,
// while wrapping them in dispatch() so that they immediately dispatch an Action.
// Just by doing this, we will have access to the actions defined in out actions file (action/home.js)
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(DeckView);
