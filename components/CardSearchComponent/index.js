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

import L from '../../app/i18n';
import CardSearchBox from './CardSearchBox';
import {
  SORT_BY_TYPE,
  SORT_BY_ENCOUNTER_SET,
} from '../CardSortDialog/constants';
import CardResultList from './CardResultList';
import Switch from '../core/Switch';
import { iconsMap } from '../../app/NavIcons';
import { applyFilters } from '../../lib/filters';
import calculateDefaultFilterState from '../filter/DefaultFilterState';
import { MYTHOS_CARDS_QUERY, PLAYER_CARDS_QUERY } from '../../data/query';
import typography from '../../styles/typography';

class CardSearchComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    // Function that takes 'realm' and gives back a base query.
    defaultFilterState: PropTypes.object,
    baseQuery: PropTypes.string,
    mythosToggle: PropTypes.bool,
    sort: PropTypes.string,

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
    this._setFilters = this.setFilters.bind(this);
    this._clearSearchFilters = this.clearSearchFilters.bind(this);
    const rightButtons = [
      {
        icon: iconsMap.tune,
        id: 'filter',
      },
      {
        icon: iconsMap['sort-by-alpha'],
        id: 'sort',
      },
    ];
    if (props.mythosToggle) {
      rightButtons.push({
        icon: iconsMap.auto_fail,
        id: 'mythos',
      });
    }
    props.navigator.setButtons({
      rightButtons,
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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
      defaultFilterState,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'filter') {
        this.isOnTop = false;
        navigator.push({
          screen: 'SearchFilters',
          animationType: 'slide-down',
          backButtonTitle: L('Apply'),
          passProps: {
            applyFilters: this._setFilters,
            defaultFilterState: defaultFilterState,
            currentFilters: this.state.filters,
            baseQuery: baseQuery,
          },
        });
      } else if (event.id === 'sort') {
        this.isOnTop = false;
        Keyboard.dismiss();
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
      } else if (event.id === 'mythos') {
        this.toggleMythosMode();
      }
    } else if (event.id === 'willDisappear') {
      this.setState({
        visible: false,
      });
    } else if (event.id === 'willAppear') {
      this.setState({
        visible: true,
      });
    }
  }

  toggleMythosMode() {
    const {
      navigator,
    } = this.props;
    const {
      mythosMode,
    } = this.state;
    this.setState({
      mythosMode: !mythosMode,
    });

    const rightButtons = [
      {
        icon: iconsMap.tune,
        id: 'filter',
      }, {
        icon: iconsMap['sort-by-alpha'],
        id: 'sort',
      }, {
        icon: mythosMode ? iconsMap.auto_fail : iconsMap.per_investigator,
        id: 'mythos',
      },
    ];
    navigator.setButtons({
      rightButtons,
    });
    navigator.setTitle({
      title: mythosMode ? L('Player Cards') : L('Encounter Cards'),
    });

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
    return applyFilters(filters);
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
    } = this.state;
    return (
      <CardSearchBox
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
        { }
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
      navigator,
      originalDeckSlots,
      deckCardCounts,
      onDeckCountChange,
      limits,
      footer,
    } = this.props;
    const {
      selectedSort,
      searchTerm,
      visible,
    } = this.state;
    const query = this.query();
    return (
      <View style={styles.wrapper}>
        { this.renderHeader() }
        <View style={styles.container}>
          <CardResultList
            navigator={navigator}
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
