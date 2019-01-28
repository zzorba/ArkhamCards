import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';

import L from '../../app/i18n';
import CardSearchBox from './CardSearchBox';
import {
  SORT_BY_TYPE,
  SORT_BY_ENCOUNTER_SET,
} from '../CardSortDialog/constants';
import CardResultList from './CardResultList';
import Switch from '../core/Switch';
import { iconsMap } from '../../app/NavIcons';
import { filterToQuery } from '../../lib/filters';
import calculateDefaultFilterState from '../filter/DefaultFilterState';
import { MYTHOS_CARDS_QUERY, PLAYER_CARDS_QUERY } from '../../data/query';
import typography from '../../styles/typography';

class CardSearchComponent extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    // Function that takes 'realm' and gives back a base query.
    defaultFilterState: PropTypes.object,
    baseQuery: PropTypes.string,
    mythosToggle: PropTypes.bool,
    sort: PropTypes.string,
    showNonCollection: PropTypes.bool,

    // Keyed by code, count of current deck.
    originalDeckSlots: PropTypes.object,
    deckCardCounts: PropTypes.object,
    onDeckCountChange: PropTypes.func,
    limits: PropTypes.object,
    footer: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      headerVisible: true,
      searchText: false,
      searchFlavor: false,
      searchBack: false,
      searchTerm: '',
      selectedSort: props.sort || SORT_BY_TYPE,
      filters: props.defaultFilterState,
      mythosMode: false,
      visible: true,
    };

    this._showHeader = this.showHeader.bind(this);
    this._hideHeader = this.hideHeader.bind(this);
    this._cardPressed = this.cardPressed.bind(this);
    this._toggleMythosMode = this.toggleMythosMode.bind(this);
    this._toggleSearchText = this.toggleSearchMode.bind(this, 'searchText');
    this._toggleSearchFlavor = this.toggleSearchMode.bind(this, 'searchFlavor');
    this._toggleSearchBack = this.toggleSearchMode.bind(this, 'searchBack');
    this._sortChanged = this.sortChanged.bind(this);
    this._searchUpdated = this.searchUpdated.bind(this);
    this._clearSearchTerm = this.searchUpdated.bind(this, '');
    this._setFilters = this.setFilters.bind(this);
    this._clearSearchFilters = this.clearSearchFilters.bind(this);
    this._showSearchFilters = this.showSearchFilters.bind(this);
    this._showSortDialog = this.showSortDialog.bind(this);
    this._syncNavigationButtons = this.syncNavigationButtons.bind(this);

    const rightButtons = [{
      id: 'filter',
      component: {
        name: 'TuneButton',
        passProps: {
          onPress: this._showSearchFilters,
          filters: props.defaultFilterState,
          defaultFilters: props.defaultFilterState,
          lightButton: !!props.onDeckCountChange,
        },
      },
    },{
      icon: iconsMap['sort-by-alpha'],
      id: 'sort',
    }];
    if (props.mythosToggle) {
      rightButtons.push({
        icon: iconsMap.auto_fail,
        id: 'mythos',
      });
    }
    if (props.onDeckCountChange) {
      forEach(rightButtons, button => {
        button.color = 'white';
      });
    }
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons,
      },
    });
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  showHeader() {
    if (!this.state.headerVisible) {
      this.setState({
        headerVisible: true,
      });
    }
  }

  hideHeader() {
    const {
      headerVisible,
      searchTerm,
    } = this.state;
    if (headerVisible && searchTerm === '') {
      this.setState({
        headerVisible: false,
      });
    }
  }

  cardPressed() {
    this.isOnTop = false;
  }

  toggleSearchMode(mode) {
    this.setState({
      [mode]: !this.state[mode],
    });
  }

  clearSearchFilters() {
    const {
      defaultFilterState,
    } = this.props;
    this.setState({
      filters: defaultFilterState,
    });
  }

  setFilters(filters) {
    this.setState({
      filters: filters,
    });
    this.syncNavigationButtons(this.state.mythosMode, filters);
  }

  sortChanged(selectedSort) {
    this.setState({
      selectedSort,
    });
  }

  showSearchFilters() {
    const {
      componentId,
      baseQuery,
      defaultFilterState,
    } = this.props;
    this.isOnTop = false;
    Navigation.push(componentId, {
      component: {
        name: 'SearchFilters',
        passProps: {
          applyFilters: this._setFilters,
          defaultFilterState: defaultFilterState,
          currentFilters: this.state.filters,
          baseQuery: baseQuery,
        },
        options: {
          topBar: {
            backButton: {
              title: L('Apply'),
            },
            title: {
              text: L('Filters'),
            },
          },
        },
      },
    });
  }

  showSortDialog() {
    this.isOnTop = false;
    Keyboard.dismiss();
    Navigation.showOverlay({
      component: {
        name: 'Dialog.Sort',
        passProps: {
          sortChanged: this._sortChanged,
          selectedSort: this.state.selectedSort,
          query: this.query(),
          searchTerm: this.state.searchTerm,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'filter') {
      this._showSearchFilters();
    } else if (buttonId === 'sort') {
      this._showSortDialog();
    } else if (buttonId === 'mythos') {
      this._toggleMythosMode();
    }
  }

  componentDidAppear() {
    this.setState({
      visible: true,
    });
  }

  componentDidDisappear() {
    this.setState({
      visible: false,
    });
  }

  syncNavigationButtons(mythosMode, filters) {
    const {
      componentId,
      onDeckCountChange,
      defaultFilterState,
    } = this.props;
    const rightButtons = [{
      id: 'filter',
      component: {
        name: 'TuneButton',
        passProps: {
          onPress: this._showSearchFilters,
          filters: filters,
          defaultFilters: defaultFilterState,
          lightButton: !!onDeckCountChange,
        },
      },
    }, {
      icon: iconsMap['sort-by-alpha'],
      id: 'sort',
      color: onDeckCountChange ? 'white' : undefined,
    }, {
      icon: mythosMode ? iconsMap.per_investigator : iconsMap.auto_fail,
      id: 'mythos',
      color: onDeckCountChange ? 'white' : undefined,
    }];

    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: mythosMode ? L('Encounter Cards') : L('Player Cards'),
        },
        rightButtons,
      },
    });
  }

  toggleMythosMode() {
    const {
      mythosMode,
      filters,
    } = this.state;
    this.setState({
      mythosMode: !mythosMode,
    });
    this.syncNavigationButtons(!mythosMode, filters);
  }

  searchUpdated(text) {
    this.setState({
      searchTerm: text,
    });
  }

  applyQueryFilter(query) {
    const {
      searchTerm,
      searchText,
      searchFlavor,
      searchBack,
    } = this.state;

    if (searchTerm !== '') {
      const parts = searchBack ? [
        'name contains[c] $0',
        'linked_card.name contains[c] $0',
        'back_name contains[c] $0',
        'linked_card.back_name contains[c] $0',
        'subname contains[c] $0',
        'linked_card.subname contains[c] $0',
      ] : [
        'renderName contains[c] $0',
        'renderSubname contains[c] $0',
      ];
      if (searchText) {
        parts.push('real_text contains[c] $0');
        parts.push('linked_card.real_text contains[c] $0');
        parts.push('traits contains[c] $0');
        parts.push('linked_card.traits contains[c] $0');
        if (searchBack) {
          parts.push('back_text contains[c] $0');
          parts.push('linked_card.back_text contains[c] $0');
        }
      }

      if (searchFlavor) {
        parts.push('flavor contains[c] $0');
        parts.push('linked_card.flavor contains[c] $0');
        if (searchBack) {
          parts.push('back_flavor contains[c] $0');
          parts.push('linked_card.back_flavor contains[c] $0');
        }
      }
      query.push(`(${parts.join(' or ')})`);
    }
  }

  filterQueryParts() {
    const {
      filters,
    } = this.state;
    return filterToQuery(filters);
  }

  query() {
    const {
      baseQuery,
      mythosToggle,
    } = this.props;
    const {
      selectedSort,
      mythosMode,
    } = this.state;
    const queryParts = [];
    if (mythosToggle) {
      if (mythosMode) {
        queryParts.push(MYTHOS_CARDS_QUERY);
      } else {
        queryParts.push(PLAYER_CARDS_QUERY);
      }
    }
    if (baseQuery) {
      queryParts.push(baseQuery);
    }
    queryParts.push('(altArtInvestigator != true)');
    queryParts.push('(back_linked != true)');
    this.applyQueryFilter(queryParts);
    forEach(
      this.filterQueryParts(),
      clause => queryParts.push(clause));

    if (selectedSort === SORT_BY_ENCOUNTER_SET) {
      queryParts.push(`(encounter_code != null OR linked_card.encounter_code != null)`);
    }
    return queryParts.join(' and ');
  }

  renderHeader() {
    const {
      searchText,
      searchFlavor,
      searchBack,
      searchTerm,
    } = this.state;
    return (
      <CardSearchBox
        value={searchTerm}
        visible={this.state.headerVisible}
        onChangeText={this._searchUpdated}
        searchText={searchText}
        searchFlavor={searchFlavor}
        searchBack={searchBack}
        toggleSearchText={this._toggleSearchText}
        toggleSearchFlavor={this._toggleSearchFlavor}
        toggleSearchBack={this._toggleSearchBack}
      />
    );
  }

  renderExpandModesButtons() {
    const {
      mythosToggle,
    } = this.props;
    const {
      mythosMode,
    } = this.state;
    const hasFilters = this.filterQueryParts().length > 0;
    if (!mythosToggle && !hasFilters) {
      return null;
    }
    return (
      <View>
        { !!mythosToggle && (
          <View style={styles.button}>
            <Button
              onPress={this._toggleMythosMode}
              title={mythosMode ? L('Search Player Cards') : L('Search Encounter Cards')}
            />
          </View>
        ) }
        { !!hasFilters && (
          <View style={styles.button}>
            <Button
              onPress={this._clearSearchFilters}
              title={L('Clear Search Filters')}
            />
          </View>
        ) }
      </View>
    );
  }

  renderExpandSearchButtons() {
    const {
      searchTerm,
      searchText,
      searchBack,
    } = this.state;
    if (!searchTerm) {
      return this.renderExpandModesButtons();
    }
    return (
      <View>
        { searchTerm && (
          <View style={styles.button}>
            <Button
              onPress={this._clearSearchTerm}
              title={L('Clear "{{searchTerm}}" search', { searchTerm })}
            />
          </View>
        ) }
        { !searchText && (
          <View style={styles.toggle}>
            <Text style={[typography.text, styles.toggleText]}>
              { L('Search Game Text') }
            </Text>
            <Switch value={false} onValueChange={this._toggleSearchText} />
          </View>
        ) }
        { !searchBack && (
          <View style={styles.toggle}>
            <Text style={[typography.text, styles.toggleText]}>
              { L('Search Card Backs') }
            </Text>
            <Switch value={false} onValueChange={this._toggleSearchBack} />
          </View>
        ) }
        { this.renderExpandModesButtons() }
      </View>
    );
  }

  render() {
    const {
      componentId,
      originalDeckSlots,
      deckCardCounts,
      onDeckCountChange,
      limits,
      footer,
      showNonCollection,
    } = this.props;
    const {
      selectedSort,
      searchTerm,
      visible,
      mythosMode,
    } = this.state;
    const query = this.query();
    return (
      <View style={styles.wrapper}>
        { this.renderHeader() }
        <View style={styles.container}>
          <CardResultList
            componentId={componentId}
            query={query}
            searchTerm={searchTerm}
            sort={selectedSort}
            originalDeckSlots={originalDeckSlots}
            deckCardCounts={deckCardCounts}
            onDeckCountChange={onDeckCountChange}
            limits={limits}
            cardPressed={this._cardPressed}
            showHeader={this._showHeader}
            hideHeader={this._hideHeader}
            expandSearchControls={this.renderExpandSearchButtons()}
            visible={visible}
            showNonCollection={mythosMode || showNonCollection}
          />
        </View>
        { !!footer && <View style={[
          styles.footer,
        ]}>{ footer }</View> }
      </View>
    );
  }
}

export default connectRealm(CardSearchComponent, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    const cards = props.baseQuery ?
      results.cards.filtered(props.baseQuery) :
      results.cards;

    return {
      defaultFilterState: calculateDefaultFilterState(cards),
    };
  },
});

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderColor: '#bbb',
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
  },
  button: {
    margin: 8,
  },
  toggle: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    minWidth: '60%',
  },
});
