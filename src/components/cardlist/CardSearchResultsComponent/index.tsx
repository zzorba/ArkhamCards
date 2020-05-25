import React, { ReactNode } from 'react';
import { debounce, throttle } from 'throttle-debounce';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import {
  SORT_BY_ENCOUNTER_SET,
  SortType,
  Slots,
} from 'actions/types';
import QueryProvider from 'components/data/QueryProvider';
import CardSearchBox from './CardSearchBox';
import CardResultList from './CardResultList';
import Switch from 'components/core/Switch';
import FilterBuilder, { FilterState } from 'lib/filters';
import { MYTHOS_CARDS_QUERY, PLAYER_CARDS_QUERY, where, combineQueries } from 'data/query';
import Card from 'data/Card';
import typography from 'styles/typography';
import space from 'styles/space';
import COLORS from 'styles/colors';

interface Props {
  componentId: string;
  fontScale: number;
  baseQuery?: Brackets;
  mythosToggle?: boolean;
  showNonCollection?: boolean;
  selectedSort?: SortType;
  filters?: FilterState;
  mythosMode?: boolean;
  visible: boolean;
  toggleMythosMode: () => void;
  clearSearchFilters: () => void;
  tabooSetOverride?: number;

  investigator?: Card;
  originalDeckSlots?: Slots;
  deckCardCounts?: Slots;
  onDeckCountChange?: (code: string, count: number) => void;
  limits?: Slots;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  storyOnly?: boolean;

  initialSort?: SortType;
}

interface State {
  headerVisible: boolean;
  searchText: boolean;
  searchFlavor: boolean;
  searchBack: boolean;
  searchTerm: string;

  searchKey: string;
  termQuery: Brackets | null;
}

type QueryProps = Pick<Props, 'baseQuery' | 'mythosToggle' | 'selectedSort' | 'mythosMode'>;
type FilterQueryProps = Pick<Props, 'filters'>
export default class CardSearchResultsComponent extends React.Component<Props, State> {
  static filterBuilder = new FilterBuilder('filters');

  static filterQuery({
    filters,
  }: FilterQueryProps): Brackets | undefined {
    return filters && CardSearchResultsComponent.filterBuilder.filterToQuery(filters);
  }

  static query({
    baseQuery,
    mythosToggle,
    selectedSort,
    mythosMode,
  }: QueryProps): Brackets {
    const queryParts: Brackets[] = [];
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
    if (selectedSort === SORT_BY_ENCOUNTER_SET) {
      queryParts.push(where(`c.encounter_code is not null OR linked_card.encounter_code is not null`));
    }
    return combineQueries(
      where('c.altArtInvestigator != true AND c.back_linked is null'),
      queryParts,
      'and'
    );
  }

  _throttledUpdateSearch: (search: string) => void;
  _debouncedUpdateSeacrh: (search: string) => void;

  static searchKey(searchTerm: string, searchText: boolean, searchFlavor: boolean, searchBack: boolean) {
    return JSON.stringify({
      searchTerm,
      searchText,
      searchBack,
      searchFlavor,
    });
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      headerVisible: true,
      searchText: false,
      searchFlavor: false,
      searchBack: false,
      searchTerm: '',
      searchKey: CardSearchResultsComponent.searchKey('', false, false, false),
      termQuery: null,
    };

    this._throttledUpdateSearch = throttle(300, this._updateTermSearch);
    this._debouncedUpdateSeacrh = debounce(300, this._updateTermSearch);
  }

  _showHeader = () => {
    if (!this.state.headerVisible) {
      this.setState({
        headerVisible: true,
      });
    }
  };

  _hideHeader = () => {
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

  _toggleSearchText = () => {
    const searchText = !this.state.searchText;
    this.setState({
      searchText,
    }, () => this._updateTermSearch(this.state.searchTerm));
  };

  _toggleSearchFlavor = () => {
    const searchFlavor = !this.state.searchFlavor;
    this.setState({
      searchFlavor,
    }, () => this._updateTermSearch(this.state.searchTerm));
  };

  _toggleSearchBack = () => {
    const searchBack = !this.state.searchBack;
    this.setState({
      searchBack,
    }, () => this._updateTermSearch(this.state.searchTerm));
  };

  _searchUpdated = (text: string) => {
    this.setState({
      searchTerm: text,
    }, () => {
      const { searchTerm } = this.state;
      if (searchTerm.length < 5) {
        this._throttledUpdateSearch(this.state.searchTerm);
      } else {
        this._debouncedUpdateSeacrh(this.state.searchTerm);
      }
    });
  };

  _clearSearchTerm = () => {
    this._searchUpdated('');
  };

  _updateTermSearch = async(searchTerm: string) => {
    const {
      searchText,
      searchFlavor,
      searchBack,
      searchKey,
    } = this.state;
    const newSearchKey = CardSearchResultsComponent.searchKey(
      searchTerm, searchText, searchFlavor, searchBack
    );
    if (searchKey === newSearchKey) {
      return;
    }
    if (searchTerm === '') {
      this.setState({
        termQuery: null,
      });
      return;
    }
    const parts = searchBack ? [
      'c.name LIKE :searchTerm',
      'linked_card.name LIKE :searchTerm',
      'c.back_name LIKE :searchTerm',
      'linked_card.back_name LIKE :searchTerm',
      'c.subname LIKE :searchTerm',
      'linked_card.subname LIKE :searchTerm',
    ] : [
      'c.renderName LIKE :searchTerm',
      'c.renderSubname LIKE :searchTerm',
    ];
    if (searchText) {
      parts.push('c.real_text LIKE :searchTerm');
      parts.push('linked_card.real_text LIKE :searchTerm');
      parts.push('c.traits LIKE :searchTerm');
      parts.push('linked_card.traits LIKE :searchTerm');
      if (searchBack) {
        parts.push('c.back_text LIKE :searchTerm');
        parts.push('linked_card.back_text LIKE :searchTerm');
      }
    }

    if (searchFlavor) {
      parts.push('c.flavor LIKE :searchTerm');
      parts.push('linked_card.flavor LIKE :searchTerm');
      if (searchBack) {
        parts.push('c.back_flavor LIKE :searchTerm');
        parts.push('linked_card.back_flavor LIKE :searchTerm');
      }
    }
    const lang = 'en';
    this.setState({
      searchKey: newSearchKey,
      termQuery: where(
        parts.join(' OR '),
        {
          searchTerm: `%${searchTerm
            .replace(/[\u2018\u2019]/g, '\'')
            .replace(/[\u201C\u201D]/g, '"')
            .toLocaleUpperCase(lang)}%`,
        },
      ),
    });
  };

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

  renderExpandModesButtons(hasFilters: boolean) {
    const {
      mythosToggle,
      toggleMythosMode,
      clearSearchFilters,
      mythosMode,
    } = this.props;
    if (!mythosToggle && !hasFilters) {
      return null;
    }
    return (
      <View>
        { !!mythosToggle && (
          <BasicButton
            onPress={toggleMythosMode}
            title={mythosMode ? t`Search Player Cards` : t`Search Encounter Cards`}
          />
        ) }
        { !!hasFilters && (
          <BasicButton
            onPress={clearSearchFilters}
            title={t`Clear Search Filters`}
          />
        ) }
      </View>
    );
  }

  renderExpandSearchButtons(hasFilters: boolean) {
    const {
      searchTerm,
      searchText,
      searchBack,
    } = this.state;
    if (!searchTerm) {
      return this.renderExpandModesButtons(hasFilters);
    }
    return (
      <View>
        { !!searchTerm && (
          <BasicButton
            onPress={this._clearSearchTerm}
            title={t`Clear "${searchTerm}" search`}
          />
        ) }
        { !searchText && (
          <View style={[styles.toggle, space.marginS]}>
            <Text style={[typography.text, styles.toggleText]}>
              { t`Search Game Text` }
            </Text>
            <Switch value={false} onValueChange={this._toggleSearchText} />
          </View>
        ) }
        { !searchBack && (
          <View style={[styles.toggle, space.marginS]}>
            <Text style={[typography.text, styles.toggleText]}>
              { t`Search Card Backs` }
            </Text>
            <Switch value={false} onValueChange={this._toggleSearchBack} />
          </View>
        ) }
        { this.renderExpandModesButtons(hasFilters) }
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
      renderFooter,
      showNonCollection,
      selectedSort,
      visible,
      tabooSetOverride,
      investigator,
      storyOnly,
      fontScale,
      initialSort,
      mythosToggle,
      baseQuery,
      mythosMode,
      filters,
    } = this.props;
    const {
      searchTerm,
      termQuery,
    } = this.state;
    return (
      <View style={styles.wrapper}>
        { this.renderHeader() }
        <View style={styles.container}>
          <QueryProvider<QueryProps, Brackets>
            baseQuery={baseQuery}
            mythosToggle={mythosToggle}
            selectedSort={selectedSort}
            mythosMode={mythosMode}
            getQuery={CardSearchResultsComponent.query}
          >
            { query => (
              <QueryProvider<FilterQueryProps, Brackets | undefined>
                filters={filters}
                getQuery={CardSearchResultsComponent.filterQuery}
              >
                { filterQuery => (
                  <CardResultList
                    componentId={componentId}
                    fontScale={fontScale}
                    tabooSetOverride={tabooSetOverride}
                    query={query}
                    filterQuery={filterQuery || undefined}
                    termQuery={termQuery || undefined}
                    searchTerm={searchTerm}
                    sort={selectedSort}
                    investigator={investigator}
                    originalDeckSlots={originalDeckSlots}
                    deckCardCounts={deckCardCounts}
                    onDeckCountChange={onDeckCountChange}
                    limits={limits}
                    showHeader={this._showHeader}
                    hideHeader={this._hideHeader}
                    expandSearchControls={this.renderExpandSearchButtons(!!filterQuery)}
                    visible={visible}
                    renderFooter={renderFooter}
                    showNonCollection={showNonCollection}
                    storyOnly={storyOnly}
                    mythosToggle={mythosToggle}
                    initialSort={initialSort}
                  />
                ) }
              </QueryProvider>
            ) }
          </QueryProvider>
        </View>
        { !!renderFooter && <View style={[
          styles.footer,
        ]}>{ renderFooter() }</View> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    backgroundColor: COLORS.backgroundColor,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    minWidth: '60%',
  },
});
