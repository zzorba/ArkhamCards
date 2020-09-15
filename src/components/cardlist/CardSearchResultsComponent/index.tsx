import React, { ReactNode } from 'react';
import { debounce } from 'throttle-debounce';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Brackets } from 'typeorm/browser';
import RegexEscape from 'regex-escape';
import { t } from 'ttag';

import {
  SORT_BY_ENCOUNTER_SET,
  SortType,
  Slots,
} from '@actions/types';
import QueryProvider from '@components/data/QueryProvider';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import CardResultList from './CardResultList';
import FilterBuilder, { FilterState } from '@lib/filters';
import { MYTHOS_CARDS_QUERY, PLAYER_CARDS_QUERY, where, combineQueries } from '@data/query';
import Card from '@data/Card';
import typography from '@styles/typography';
import { s, xs } from '@styles/space';
import COLORS from '@styles/colors';
import SearchResultButton from '../SearchResultButton';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

const DIGIT_REGEX = /^[0-9]+$/;

interface Props {
  componentId: string;
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
  renderHeader?: () => React.ReactElement;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => ReactNode;
  storyOnly?: boolean;

  initialSort?: SortType;
}

interface State {
  headerVisible: boolean;
  searchText: boolean;
  searchFlavor: boolean;
  searchBack: boolean;
  searchTerm?: string;
  searchCode?: number;
  searchQuery?: RegExp;
}

function searchOptionsHeight(fontScale: number) {
  return 20 + (fontScale * 20 + 8) * 3 + 12;
}

type QueryProps = Pick<Props, 'baseQuery' | 'mythosToggle' | 'selectedSort' | 'mythosMode'>;
type FilterQueryProps = Pick<Props, 'filters'>
export default class CardSearchResultsComponent extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

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
      where('c.altArtInvestigator != true AND c.back_linked is null AND not c.hidden'),
      queryParts,
      'and'
    );
  }

  _debouncedUpdateSeacrh: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      headerVisible: true,
      searchText: false,
      searchFlavor: false,
      searchBack: false,
    };

    this._debouncedUpdateSeacrh = debounce(50, this._updateTermSearch);
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
    if (headerVisible && !searchTerm) {
      this.setState({
        headerVisible: false,
      });
    }
  }

  _toggleSearchText = () => {
    const searchText = !this.state.searchText;
    this.setState({
      searchText,
    });
  };

  _toggleSearchFlavor = () => {
    const searchFlavor = !this.state.searchFlavor;
    this.setState({
      searchFlavor,
    });
  };

  _toggleSearchBack = () => {
    const searchBack = !this.state.searchBack;
    this.setState({
      searchBack,
    });
  };

  _searchUpdated = (text: string) => {
    this.setState({
      searchTerm: text,
    }, () => {
      this._debouncedUpdateSeacrh();
    });
  };

  _clearSearchTerm = () => {
    this._searchUpdated('');
  };

  _updateTermSearch = async() => {
    const {
      searchTerm,
    } = this.state;
    if (!searchTerm) {
      this.setState({
        searchQuery: undefined,
        searchCode: undefined,
      });
      return;
    }
    const searchCode = DIGIT_REGEX.test(searchTerm) ? parseInt(searchTerm, 10) : undefined;
    const term = searchTerm.replace(/“|”/g, '"').replace(/‘|’/, '\'');
    this.setState({
      searchQuery: new RegExp(`.*${RegexEscape(term)}.*`, 'i'),
      searchCode,
    });
  };

  renderSearchOptions() {
    const {
      searchText,
      searchFlavor,
      searchBack,
    } = this.state;
    const { colors, fontScale } = this.context;
    return (
      <>
        <View style={[styles.column, { alignItems: 'center', flex: 1 }]}>
          <Text style={[typography.cardName, { color: colors.M, fontSize: 20 * fontScale, fontFamily: 'Alegreya-Bold' }]}>
            { t`Search in:` }
          </Text>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={[typography.searchLabel, styles.searchOption]}>
              { t`Game Text` }
            </Text>
            <ArkhamSwitch
              value={searchText}
              onValueChange={this._toggleSearchText}
            />
          </View>
          <View style={styles.row}>
            <Text style={[typography.searchLabel, styles.searchOption]}>
              { t`Flavor Text` }
            </Text>
            <ArkhamSwitch
              value={searchFlavor}
              onValueChange={this._toggleSearchFlavor}
            />
          </View>
          <View style={styles.row}>
            <Text style={[typography.searchLabel, styles.searchOption]}>
              { t`Card Backs` }
            </Text>
            <ArkhamSwitch
              value={searchBack}
              onValueChange={this._toggleSearchBack}
            />
          </View>
        </View>
      </>
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
          <SearchResultButton
            icon="search"
            onPress={toggleMythosMode}
            title={mythosMode ? t`Search player cards` : t`Search encounter cards`}
          />
        ) }
        { !!hasFilters && (
          <SearchResultButton
            icon="search"
            onPress={clearSearchFilters}
            title={t`Clear search filters`}
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
          <SearchResultButton
            icon="search"
            onPress={this._clearSearchTerm}
            title={t`Clear "${searchTerm}" search`}
          />
        ) }
        { !searchText && (
          <SearchResultButton
            icon="search"
            onPress={this._toggleSearchText}
            title={t`Search game text`}
          />
        ) }
        { !searchBack && (
          <SearchResultButton
            icon="search"
            onPress={this._toggleSearchBack}
            title={t`Search card backs`}
          />
        ) }
        { this.renderExpandModesButtons(hasFilters) }
      </View>
    );
  }

  _filterCardText = (card: Card): boolean => {
    const {
      searchText,
      searchFlavor,
      searchBack,
      searchTerm,
      searchQuery,
      searchCode,
    } = this.state;
    if (searchCode && card.position === searchCode) {
      return true;
    }
    if (!searchQuery || searchTerm === '' || !searchTerm) {
      return true;
    }
    if (searchBack) {
      if (searchQuery.test(card.name) ||
        (card.linked_card && searchQuery.test(card.linked_card.name)) ||
        (card.back_name && searchQuery.test(card.back_name)) ||
        (card.linked_card && card.linked_card.back_name && searchQuery.test(card.linked_card.back_name)) ||
        (card.subname && searchQuery.test(card.subname)) ||
        (card.linked_card && card.linked_card.subname && searchQuery.test(card.linked_card.subname))
      ) {
        return true;
      }
    } else {
      if (searchQuery.test(card.renderName) || (card.renderSubname && searchQuery.test(card.renderSubname))) {
        return true;
      }
    }
    if (searchText) {
      if (
        (card.real_text && searchQuery.test(card.real_text)) ||
        (card.linked_card && card.linked_card.real_text && searchQuery.test(card.linked_card.real_text)) ||
        (card.traits && searchQuery.test(card.traits)) ||
        (card.linked_card && card.linked_card.traits && searchQuery.test(card.linked_card.traits))
      ) {
        return true;
      }
      if (searchBack && (
        (card.back_text && searchQuery.test(card.back_text)) ||
        (card.linked_card && card.linked_card.back_text && searchQuery.test(card.linked_card.back_text))
      )) {
        return true;
      }
    }
    if (searchFlavor) {
      if (
        (card.flavor && searchQuery.test(card.flavor)) ||
        (card.linked_card && card.linked_card.flavor && searchQuery.test(card.linked_card.flavor))
      ) {
        return true;
      }
      if (searchBack && (
        (card.back_flavor && searchQuery.test(card.back_flavor)) ||
        (card.linked_card && card.linked_card.back_flavor && searchQuery.test(card.linked_card.back_flavor))
      )) {
        return true;
      }
    }
    return false;
  };

  render() {
    const {
      componentId,
      originalDeckSlots,
      deckCardCounts,
      onDeckCountChange,
      limits,
      renderHeader,
      renderFooter,
      showNonCollection,
      selectedSort,
      visible,
      tabooSetOverride,
      investigator,
      storyOnly,
      initialSort,
      mythosToggle,
      baseQuery,
      mythosMode,
      filters,
    } = this.props;
    const { fontScale } = this.context;
    const { searchTerm } = this.state;
    return (
      <CollapsibleSearchBox
        prompt={t`Search for a card`}
        advancedOptions={{
          controls: this.renderSearchOptions(),
          height: searchOptionsHeight(fontScale),
        }}
        searchTerm={searchTerm || ''}
        onSearchChange={this._searchUpdated}
      >
        { (handleScroll) => (
          <QueryProvider<QueryProps, Brackets>
            baseQuery={baseQuery}
            mythosToggle={mythosToggle}
            selectedSort={selectedSort}
            mythosMode={mythosToggle && mythosMode}
            getQuery={CardSearchResultsComponent.query}
          >
            { query => (
              <QueryProvider<FilterQueryProps, Brackets | undefined>
                filters={filters}
                getQuery={CardSearchResultsComponent.filterQuery}
              >
                { filterQuery => (
                  <>
                    <CardResultList
                      componentId={componentId}
                      tabooSetOverride={tabooSetOverride}
                      query={query}
                      filterQuery={filterQuery || undefined}
                      filterCard={this._filterCardText}
                      searchTerm={searchTerm}
                      sort={selectedSort}
                      investigator={investigator}
                      originalDeckSlots={originalDeckSlots}
                      deckCardCounts={deckCardCounts}
                      onDeckCountChange={onDeckCountChange}
                      limits={limits}
                      handleScroll={handleScroll}
                      expandSearchControls={this.renderExpandSearchButtons(!!filterQuery)}
                      visible={visible}
                      renderHeader={renderHeader}
                      renderFooter={renderFooter}
                      showNonCollection={showNonCollection}
                      storyOnly={storyOnly}
                      mythosToggle={mythosToggle}
                      mythosMode={mythosToggle && mythosMode}
                      initialSort={initialSort}
                    />
                    { !!renderFooter && <View style={styles.footer}>
                      { renderFooter() }
                    </View> }
                  </>
                ) }
              </QueryProvider>
            ) }
          </QueryProvider>
        ) }
      </CollapsibleSearchBox>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  searchOption: {
    marginLeft: s,
    marginRight: xs,
    color: COLORS.darkText,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
