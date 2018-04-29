import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  BackHandler,
  Dimensions,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import SearchInput from 'react-native-search-filter';

import {
  SORT_BY_TYPE,
} from '../CardSortDialog/constants';
import CardResultList from './CardResultList';
import { iconsMap } from '../../app/NavIcons';
import { applyFilters } from '../../lib/filters';
import DefaultFilterState from '../CardFilterView/DefaultFilterState';

export default class CardSearchComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    // Function that takes 'realm' and gives back a base query.
    baseQuery: PropTypes.string,

    // Keyed by code, count of current deck.
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
    backPressed: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const {
      height,
      width,
    } = Dimensions.get('window');

    this.state = {
      width,
      height,
      searchTerm: '',
      selectedSort: SORT_BY_TYPE,
      filters: DefaultFilterState,
    };

    this._sortChanged = this.sortChanged.bind(this);
    this._searchUpdated = this.searchUpdated.bind(this);
    this._applyFilters = this.applyFilters.bind(this);

    const leftButton = Platform.OS === 'ios' ? {
      id: 'save',
      title: 'Save',
    } : {
      icon: iconsMap['arrow-left'],
      id: 'save',
    };
    const defaultButton = Platform.OS === 'ios' ? [] : null;
    props.navigator.setButtons({
      leftButtons: props.backPressed ? [leftButton] : defaultButton,
      rightButtons: [
        {
          icon: iconsMap.tune,
          id: 'filter',
        },
        {
          icon: iconsMap['sort-by-alpha'],
          id: 'sort',
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

  sortChanged(selectedSort) {
    this.setState({
      selectedSort,
    });
  }

  onNavigatorEvent(event) {
    const {
      navigator,
      baseQuery,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'filter') {
        navigator.push({
          screen: 'SearchFilters',
          animationType: 'slide-down',
          backButtonTitle: 'Apply',
          passProps: {
            applyFilters: this._applyFilters,
            currentFilters: this.state.filters,
            baseQuery: baseQuery,
          },
        });
      } else if (event.id === 'sort') {
        navigator.showLightBox({
          screen: 'Dialog.Sort',
          passProps: {
            sortChanged: this._sortChanged,
            selectedSort: this.state.selectedSort,
          },
          style: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        });
      } else if (event.id === 'save') {
        this.handleBackPress();
      }
    } else if (event.id === 'willAppear') {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
    } else if (event.id === 'willDisappear') {
      this.backHandler.remove();
    }
  }

  handleBackPress() {
    const {
      backPressed,
    } = this.props;
    backPressed && backPressed();
    this.props.navigator.pop();
    return true;
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
        `name contains[c] $0 or `,
        `real_text contains[c] $0 or `,
        `traits contains[c] $0`,
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
    const {
      width,
      height,
      selectedSort,
      searchTerm,
    } = this.state;
    const query = this.query();
    return (
      <View style={[styles.wrapper, { width, height }]}>
        <View style={[styles.container, { width, height }]}>
          <SearchInput
            onChangeText={this._searchUpdated}
            style={styles.searchInput}
            placeholder="Search for a card"
          />
          <CardResultList
            navigator={navigator}
            query={query}
            searchTerm={searchTerm}
            sort={selectedSort}
            deckCardCounts={deckCardCounts}
            onDeckCountChange={onDeckCountChange}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
  },
});
