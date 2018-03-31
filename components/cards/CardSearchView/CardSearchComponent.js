import React from 'react';
import PropTypes from 'prop-types';
import { filter, find } from 'lodash';
import {
  StyleSheet,
  FlatList,
  VirtualizedList,
  View,
} from 'react-native';
import SearchInput from 'react-native-search-filter';
import RealmQuery from 'realm-query';
import { connectRealm } from 'react-native-realm';

import FactionChooser from './FactionChooser';
import TypeChooser from './TypeChooser';
import XpChooser from './XpChooser';
import CardSearchResult from './CardSearchResult';

import { FACTION_CODES } from '../../../constants';
const CARD_FACTION_CODES = [...FACTION_CODES, 'mythos'];

class CardSearchComponent extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    // Function that takes 'realm' and gives back a base query.
    baseQuery: PropTypes.string,

    // Keyed by code, count of current deck.
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      factionCodes: CARD_FACTION_CODES,
      searchTerm: '',
      factions: [],
      types: [],
      xpLevels: [],
    };

    this._searchUpdated = this.searchUpdated.bind(this);

    this._selectedFactionsChanged = this.selectedFactionsChanged.bind(this);
    this._selectedTypesChanged = this.selectedTypesChanged.bind(this);
    this._selectedXpChanged = this.selectedXpChanged.bind(this);

    this._getItem = this.getItem.bind(this);
    this._getItemLayout = this.getItemLayout.bind(this);
    this._getItemCount = this.getItemCount.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._cardToKey = this.cardToKey.bind(this);
    this._renderCard = this.renderCard.bind(this);
  }

  componentDidMount() {
    const {
      baseQuery,
      cards,
    } = this.props;
    if (baseQuery) {
      this.setState({
        factionCodes: filter(
          FACTION_CODES,
          faction_code =>
            cards.filtered(`faction_code == '${faction_code}'`).length > 0),
      });
    }
  }

  cardToKey(card) {
    return card.code;
  }

  searchUpdated(text) {
    this.setState({
      searchTerm: text,
    });
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

  getItemLayout(data, index) {
    return {
      length: 26,
      offset: 26 * index,
      index,
    };
  }

  getItem(data, index) {
    return data[index];
  }

  getItemCount(data) {
    return data.length;
  }

  applyQueryFilter(cards) {
    const {
      searchTerm,
    } = this.state;

    if (searchTerm === '') {
      return cards;
    }

    return cards.filtered(
      [
        `name contains[c] '${searchTerm}' or `,
        `real_text contains[c] '${searchTerm}' or `,
        `traits contains[c] '${searchTerm}'`,
      ].join('')
    );
  }

  applyFactionFilter(cards) {
    const {
      factions,
    } = this.state;
    if (factions.length === 0) {
      return cards;
    }
    return cards.filtered(
      factions.map(fc => `faction_code == '${fc}'`).join(' or '),
    );
  }

  applyTypeFilter(cards) {
    const {
      types,
    } = this.state;
    if (types.length === 0) {
      return cards;
    }
    return cards.filtered(
      types.map(tc => `type_code == '${tc}'`).join(' or '),
    );
  }

  applyXpFilter(cards) {
    const {
      xpLevels,
    } = this.state;
    if (xpLevels.length === 0) {
      return cards;
    }
    return cards.filtered(
      xpLevels.map(xp => `xp == '${xp}'`).join(' or '),
    );
  }

  filteredCards() {
    const {
      cards,
    } = this.props;
    const textCards = this.applyQueryFilter(cards);
    const factionCards = this.applyFactionFilter(textCards);
    const typeCards = this.applyTypeFilter(factionCards);
    const result = this.applyXpFilter(typeCards);
    return result;
  }

  render() {
    const results = this.filteredCards();
    return (
      <View style={styles.container}>
        <SearchInput
          onChangeText={this._searchUpdated}
          style={styles.searchInput}
          placeholder="Search for a card"
        />
        <FactionChooser
          onChange={this._selectedFactionsChanged}
          factions={this.state.factionCodes}
        />
        <View style={styles.row}>
          <TypeChooser onChange={this._selectedTypesChanged} />
          <XpChooser onChange={this._selectedXpChanged} />
        </View>
        <VirtualizedList
          data={results}
          getItem={this._getItem}
          getItemLayout={this._getItemLayout}
          getItemCount={this._getItemCount}
          renderItem={this._renderCard}
          keyExtractor={this._cardToKey}
          windowSize={20}
        />
      </View>
    );
  }
}

export default connectRealm(CardSearchComponent, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    return {
      realm,
      cards: props.baseQuery ? results.cards.filtered(props.baseQuery) : results.cards,
    };
  },
});

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
