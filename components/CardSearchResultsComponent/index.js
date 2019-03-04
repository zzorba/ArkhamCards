import React from 'react';
import PropTypes from 'prop-types';
import { forEach } from 'lodash';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import L from '../../app/i18n';
import CardSearchBox from './CardSearchBox';
import {
  SORT_BY_ENCOUNTER_SET,
} from '../CardSortDialog/constants';
import CardResultList from './CardResultList';
import Switch from '../core/Switch';
import { filterToQuery } from '../../lib/filters';
import { MYTHOS_CARDS_QUERY, PLAYER_CARDS_QUERY } from '../../data/query';
import typography from '../../styles/typography';

export default class CardSearchResultComponent extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    // Function that takes 'realm' and gives back a base query.
    baseQuery: PropTypes.string,
    mythosToggle: PropTypes.bool,
    showNonCollection: PropTypes.bool,

    selectedSort: PropTypes.string,
    filters: PropTypes.object,
    mythosMode: PropTypes.bool,
    visible: PropTypes.bool,

    // Functions
    toggleMythosMode: PropTypes.func.isRequired,
    clearSearchFilters: PropTypes.func.isRequired,

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
    };

    this._showHeader = this.showHeader.bind(this);
    this._hideHeader = this.hideHeader.bind(this);
    this._toggleSearchText = this.toggleSearchMode.bind(this, 'searchText');
    this._toggleSearchFlavor = this.toggleSearchMode.bind(this, 'searchFlavor');
    this._toggleSearchBack = this.toggleSearchMode.bind(this, 'searchBack');
    this._searchUpdated = this.searchUpdated.bind(this);
    this._clearSearchTerm = this.searchUpdated.bind(this, '');
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

  toggleSearchMode(mode) {
    this.setState({
      [mode]: !this.state[mode],
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
    } = this.props;
    return filterToQuery(filters);
  }

  query() {
    const {
      baseQuery,
      mythosToggle,
      selectedSort,
      mythosMode,
    } = this.props;
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
      toggleMythosMode,
      clearSearchFilters,
      mythosMode,
    } = this.props;
    const hasFilters = this.filterQueryParts().length > 0;
    if (!mythosToggle && !hasFilters) {
      return null;
    }
    return (
      <View>
        { !!mythosToggle && (
          <View style={styles.button}>
            <Button
              onPress={toggleMythosMode}
              title={mythosMode ? L('Search Player Cards') : L('Search Encounter Cards')}
            />
          </View>
        ) }
        { !!hasFilters && (
          <View style={styles.button}>
            <Button
              onPress={clearSearchFilters}
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
      selectedSort,
      mythosMode,
      visible,
    } = this.props;
    const {
      searchTerm,
    } = this.state;
    return (
      <View style={styles.wrapper}>
        { this.renderHeader() }
        <View style={styles.container}>
          <CardResultList
            componentId={componentId}
            query={this.query()}
            searchTerm={searchTerm}
            sort={selectedSort}
            originalDeckSlots={originalDeckSlots}
            deckCardCounts={deckCardCounts}
            onDeckCountChange={onDeckCountChange}
            limits={limits}
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
