import React from 'react';
import PropTypes from 'prop-types';
import { sum, uniqBy } from 'lodash';
const {
  StyleSheet,
  SectionList,
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
    { type: 'Hand', data: filterBy(assets, cards, 'slot', 'Hand') },
    { type: 'Arcane', data: filterBy(assets, cards, 'slot', 'Arcane') },
    { type: 'Accessory', data: filterBy(assets, cards, 'slot', 'Accessory') },
    { type: 'Body', data: filterBy(assets, cards, 'slot', 'Body') },
    { type: 'Ally', data: filterBy(assets, cards, 'slot', 'Ally') },
    { type: 'Other', data: filterBy(assets, cards, 'slot', undefined) },
  ].filter(asset => asset.data.length > 0);
}

function isSpecialCard(card) {
  return card.subtype_code === 'weakeness' ||
    card.spoiler ||
    card.restrictions;
}

function splitCards(cardIds, cards) {
  const result = {};

  const groupedAssets = groupAssets(cardIds, cards);
  if (groupedAssets.length > 0) {
    result.assets = groupedAssets;
  }
  ['Event', 'Skill', 'Treachery', 'Enemy'].forEach(type_code => {
    const typeCards = filterBy(cardIds, cards, 'type_code', type_code.toLowerCase());
    if (typeCards.length > 0) {
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
  const investigator = deck.investigator_code;
  const specialCards = cardIds.filter(c => isSpecialCard(cards[c.id]));
  const normalCards = cardIds.filter(c => !isSpecialCard(cards[c.id]));
  return {
    investigator: cards[deck.investigator_code],
    meta: {
      normalCardCount: sum(normalCards.map(c => c.quantity)),
      totalCardCount: sum(cardIds.map(c => c.quantity)),
      experience: sum(cardIds.map(c => computeXp(cards[c.id]) * c.quantity)),
      packs: uniqBy(cardIds, c => cards[c.id].pack_code).length,
    },
    normal: splitCards(normalCards, cards, deck.slots),
    special: splitCards(specialCards, cards, deck.slots),
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

    this._renderCard = this.renderCard.bind(this);
    this._renderCardHeader = this.renderCardHeader.bind(this);
    this._keyForCard = this.keyForCard.bind(this);
  }

  componentDidMount() {
    this.props.getDeck(this.props.id);
  }

  keyForCard(item) {
    return item.id;
  }

  renderCardHeader({ section }) {
    console.log(section);
    return (
      <View>
        <Text>{section.title || section.subTitle} </Text>
      </View>
    );
  }

  renderCard({ item }) {
    const card = this.props.cards[item.id];
    if (!card) {
      console.log(`Could not find ${item.id}`);
      return null;
    }
    return (
      <View key={item.id}>
        <Text style={styles.defaultText}>
          {`${item.quantity}x `}
          <Text style={styles[card.faction_code]}>
            {card.name}
          </Text>
        </Text>
      </View>
    )
  }

  deckToSections(halfDeck) {
    const result = [];
    if (halfDeck.assets) {
      const assetCount = sum(halfDeck.assets.map(subAssets =>
         sum(subAssets.data.map(c => c.quantity))))
      result.push({
        title: `Assets (${assetCount})`,
        data: [],
      });
      halfDeck.assets.forEach(subAssets => {
        result.push({
          subTitle: subAssets.type,
          data: subAssets.data,
        });
      });
    }
    ['Event', 'Skill', 'Treachery', 'Enemy'].forEach(type => {
      if (halfDeck[type]) {
        const count = sum(halfDeck[type].map(c => c.quantity));
        result.push({
          title: `${type} (${count})`,
          data: halfDeck[type],
        });
      }
    });
    return result;
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

    const parsedDeck = parseDeck(deck, cards);

    const sections =
      this.deckToSections(parsedDeck.normal)
        .concat(this.deckToSections(parsedDeck.special));

    return (
      <View>
        <Text>{ deck.name }</Text>
        <SectionList
          renderItem={this._renderCard}
          keyExtractor={this._keyForCard}
          renderSectionHeader={this._renderCardHeader}
          sections={sections}
        />
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

var styles = StyleSheet.create({
  defaultText: {
    color: '#000000',
  },
  seeker: {
    color: '#ec8426',
  },
  guardian: {
    color: '#2b80c5',
  },
  mystic: {
    color: '#4331b9',
  },
  rogue: {
    color: '#107116',
  },
  survivor: {
    color: '#cc3038',
  },
  neutral: {
    color: '#606060',
  },
});
