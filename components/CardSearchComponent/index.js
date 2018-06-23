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

import SearchBox from '../SearchBox';
import {
  SORT_BY_TYPE,
  SORT_BY_ENCOUNTER_SET,
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
    sort: PropTypes.string,

    // Keyed by code, count of current deck.
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
    backPressed: PropTypes.func,
    backButtonText: PropTypes.string,
    limits: PropTypes.object,
    footer: PropTypes.node,
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
      selectedSort: props.sort || SORT_BY_TYPE,
      filters: DefaultFilterState,
    };

    this._sortChanged = this.sortChanged.bind(this);
    this._searchUpdated = this.searchUpdated.bind(this);
    this._applyFilters = this.applyFilters.bind(this);

    const leftButton = Platform.OS === 'ios' ? {
      id: 'back',
      title: props.backButtonText,
    } : {
      id: 'back',
      icon: iconsMap['arrow-left'],
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
            query: this.query(),
            searchTerm: this.state.searchTerm,
          },
          style: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        });
      } else if (event.id === 'back') {
        this.handleBackPress();
      }
    } else if (event.id === 'willAppear') {
      this.backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackPress.bind(this));
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
        `traits contains[c] $0 or`,
        '(linked_card != null && (',
        `linked_card.name contains[c] $0 or `,
        `linked_card.real_text contains[c] $0 or `,
        `linked_card.traits contains[c] $0`,
        '))',
        ')',
      ].join(''));
    }
  }

  query() {
    const {
      baseQuery,
    } = this.props;
    const {
      selectedSort,
    } = this.state;
    const queryParts = [];
    if (baseQuery) {
      queryParts.push(baseQuery);
    }
    queryParts.push('back_linked != true');
    this.applyQueryFilter(queryParts);
    forEach(
      applyFilters(this.state.filters),
      clause => queryParts.push(clause));

    if (selectedSort === SORT_BY_ENCOUNTER_SET) {
      queryParts.push(`(encounter_code != null OR linked_card.encounter_code != null)`);
    }
    return queryParts.join(' and ');
  }

  render() {
    const {
      navigator,
      deckCardCounts,
      onDeckCountChange,
      limits,
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
          <SearchBox
            onChangeText={this._searchUpdated}
            placeholder="Search for a card"
          />
          <CardResultList
            navigator={navigator}
            query={query}
            searchTerm={searchTerm}
            sort={selectedSort}
            deckCardCounts={deckCardCounts}
            onDeckCountChange={onDeckCountChange}
            limits={limits}
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
});
