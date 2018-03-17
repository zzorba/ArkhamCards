import React from 'react';
import PropTypes from 'prop-types';
import { filter, groupBy, values } from 'lodash';
const {
  StyleSheet,
  FlatList,
  View,
} = require('react-native');
import SearchInput from 'react-native-search-filter';

import FactionChooser from './FactionChooser';
import TypeChooser from './TypeChooser';
import XpChooser from './XpChooser';
import CardSearchResult from './CardSearchResult';
import { FACTION_CODES } from '../../../constants';

const CARD_FACTION_CODES = [...FACTION_CODES, 'mythos'];

export default class CardSearchComponent extends React.Component {
  static propTypes = {
    cards: PropTypes.object,
    navigator: PropTypes.object.isRequired,
    // Keyed by code, count of current deck.
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      factions: [],
      types: [],
      xpLevels: [],
    };

    this._searchUpdated = this.searchUpdated.bind(this);

    this._selectedFactionsChanged = this.selectedFactionsChanged.bind(this);
    this._selectedTypesChanged = this.selectedTypesChanged.bind(this);
    this._selectedXpChanged = this.selectedXpChanged.bind(this);

    this._cardPressed = this.cardPressed.bind(this);
    this._cardToKey = this.cardToKey.bind(this);
    this._renderCard = this.renderCard.bind(this);
  }

  cardToKey(card) {
    return card.code;
  }

  selectedFactionsChanged(factions) {
    this.setState({
      factions,
    });
  }

  selectedTypesChanged(types) {
    this.setState({
      types,
    });
  }

  selectedXpChanged(xpLevels) {
    this.setState({
      xpLevels,
    });
  }

  cardPressed(cardId) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: cardId,
      },
    });
  }

  renderCard({ item }) {
    const {
      deckCardCounts = {},
      onDeckCountChange,
    } = this.props;
    return (
      <CardSearchResult
        card={item}
        count={deckCardCounts[item.code]}
        onDeckCountChange={onDeckCountChange}
        onPress={this._cardPressed}
      />
    );
  }

  searchUpdated(text) {
    this.setState({
      searchTerm: text,
    });
  }

  applyQueryFilter(cards) {
    const {
      searchTerm,
    } = this.state;

    if (searchTerm === '') {
      return cards;
    }

    return filter(cards, card => {
      return (card.name && card.name.indexOf(searchTerm) !== -1) ||
        (card.real_text && card.real_text.indexOf(searchTerm) !== -1) ||
        (card.traits && card.traits.indexOf(searchTerm) !== -1);
    });
  }

  applyFactionFilter(cards) {
    const {
      factions,
    } = this.state;
    if (factions.length === 0) {
      return cards;
    }
    return filter(cards, card => factions.indexOf(card.faction_code) !== -1);
  }

  applyTypeFilter(cards) {
    const {
      types,
    } = this.state;
    if (types.length === 0) {
      return cards;
    }
    return filter(cards, card => types.indexOf(card.type_code) !== -1);
  }

  applyXpFilter(cards) {
    const {
      xpLevels,
    } = this.state;
    if (xpLevels.length === 0) {
      return cards;
    }
    return filter(cards, card => xpLevels.indexOf(card.xp || 0) !== -1);
  }

  filteredCards() {
    const {
      cards,
    } = this.props;
    const cardsList = Object.keys(cards).map(id => cards[id]);
    const queryCards = this.applyQueryFilter(cardsList);
    const factionCards = this.applyFactionFilter(queryCards);
    const typeCards = this.applyTypeFilter(factionCards);
    return this.applyXpFilter(typeCards);
  }

  render() {
    const results = this.filteredCards();
    const eligibleFactionCounts = groupBy(
      filter(
        values(this.props.cards),
        card => card.faction_code),
      card => card.faction_code
    );
    const factions = filter(
      CARD_FACTION_CODES,
      faction_code => eligibleFactionCounts[faction_code]);

    return (
      <View style={styles.container}>
        <SearchInput
          onChangeText={this._searchUpdated}
          style={styles.searchInput}
          placeholder="Search for a card"
        />
        <FactionChooser
          onChange={this._selectedFactionsChanged}
          factions={factions}
        />
        <View style={styles.row}>
          <TypeChooser onChange={this._selectedTypesChanged} />
          <XpChooser onChange={this._selectedXpChanged} />
        </View>
        <FlatList
          data={results}
          renderItem={this._renderCard}
          keyExtractor={this._cardToKey}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
