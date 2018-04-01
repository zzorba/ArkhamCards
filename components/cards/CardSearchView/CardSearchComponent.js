import React from 'react';
import PropTypes from 'prop-types';
import { filter } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import SearchInput from 'react-native-search-filter';
import { connectRealm } from 'react-native-realm';

import FactionChooser from './FactionChooser';
import TypeChooser from './TypeChooser';
import XpChooser from './XpChooser';
import CardResultList from './CardResultList';

import { FACTION_CODES } from '../../../constants';
const CARD_FACTION_CODES = [...FACTION_CODES, 'mythos'];

class CardSearchComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    // Function that takes 'realm' and gives back a base query.
    baseQuery: PropTypes.string,
    cards: PropTypes.object,

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
  }

  componentDidMount() {
    const {
      baseQuery,
      cards,
    } = this.props;
    if (baseQuery) {
      setTimeout(() => {
        this.setState({
          factionCodes: filter(
            FACTION_CODES,
            faction_code =>
              cards.filtered(`faction_code == '${faction_code}'`).length > 0),
        });
      }, 0);
    }
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

  applyQueryFilter(query) {
    const {
      searchTerm,
    } = this.state;

    if (searchTerm !== '') {
      query.push([
        '(',
        `name contains[c] '${searchTerm}' or `,
        `real_text contains[c] '${searchTerm}' or `,
        `traits contains[c] '${searchTerm}'`,
        ')',
      ].join(''));
    }
  }

  applyFactionFilter(query) {
    const {
      factions,
    } = this.state;
    if (factions.length) {
      query.push([
        '(',
        factions.map(fc => `faction_code == '${fc}'`).join(' or '),
        ')',
      ].join(''));
    }
  }

  applyTypeFilter(query) {
    const {
      types,
    } = this.state;
    if (types.length) {
      return query.push([
        '(',
        types.map(tc => `type_code == '${tc}'`).join(' or '),
        ')',
      ].join(''));
    }
  }

  applyXpFilter(query) {
    const {
      xpLevels,
    } = this.state;
    if (xpLevels.length) {
      query.push([
        '(',
        xpLevels.map(xp => `xp == '${xp}'`).join(' or '),
        ')',
      ].join(''));
    }
  }

  query() {
    const {
      baseQuery,
    } = this.props;
    const queryParts = [];
    if (baseQuery) {
      queryParts.push(baseQuery);
    }
    this.applyQueryFilter(queryParts);
    this.applyFactionFilter(queryParts);
    this.applyTypeFilter(queryParts);
    this.applyXpFilter(queryParts);
    return queryParts.join(' and ');
  }

  render() {
    const {
      navigator,
      deckCardCounts,
      onDeckCountChange,
    } = this.props;
    const query = this.query();
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
        <CardResultList
          navigator={navigator}
          query={query}
          deckCardCounts={deckCardCounts}
          onDeckCountChange={onDeckCountChange}
        />
      </View>
    );
  }
}

export default connectRealm(CardSearchComponent, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    return {
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
