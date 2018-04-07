import React from 'react';
import PropTypes from 'prop-types';
import { forEach, filter } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import SearchInput from 'react-native-search-filter';
import { connectRealm } from 'react-native-realm';

import { FACTION_CODES } from '../../../constants';
import CardResultList from './CardResultList';
import { iconsMap } from '../../../app/NavIcons';
import { applyFilters } from '../../../lib/filters';
import DefaultFilterState from '../FilterView/DefaultFilterState';

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
      filters: DefaultFilterState,
    };

    this._searchUpdated = this.searchUpdated.bind(this);
    this._applyFilters = this.applyFilters.bind(this);

    props.navigator.setButtons({
      rightButtons: [
        {
          icon: iconsMap.tune,
          id: 'filter',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  applyFilters(filters) {
    this.setState({
      filters,
    });
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'filter') {
        this.props.navigator.push({
          screen: 'SearchFilters',
          animationType: 'slide-down',
          backButtonTitle: 'Apply',
          passProps: {
            factions: this.state.factionCodes,
            applyFilters: this._applyFilters,
            currentFilters: this.state.filters,
            baseQuery: this.props.baseQuery,
          },
        });
      }
    }
  }

  componentDidMount() {
    const {
      baseQuery,
      cards,
    } = this.props;
    if (baseQuery) {
      setTimeout(() => {
        this.setState({
          factionCodes: filter(FACTION_CODES, faction_code =>
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

  query() {
    const {
      baseQuery,
    } = this.props;
    const queryParts = [];
    if (baseQuery) {
      queryParts.push(baseQuery);
    }
    this.applyQueryFilter(queryParts);
    forEach(
      applyFilters(this.state.filters),
      clause => queryParts.push(clause));
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
