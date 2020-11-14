import React, { useCallback, useContext, useMemo, useState } from 'react';
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
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import FilterBuilder, { FilterState } from '@lib/filters';
import { MYTHOS_CARDS_QUERY, where, combineQueries, BASIC_QUERY, BROWSE_CARDS_QUERY, combineQueriesOpt } from '@data/query';
import Card from '@data/Card';
import { s, xs } from '@styles/space';
import ArkhamButton from '@components/core/ArkhamButton';
import StyleContext from '@styles/StyleContext';
import DbCardResultList from './DbCardResultList';
import DeckNavFooter from '@components/DeckNavFooter';
import { useSelector } from 'react-redux';
import { getLangPreference } from '@reducers';

const DIGIT_REGEX = /^[0-9]+$/;

interface Props {
  componentId: string;
  deckId?: number;
  baseQuery?: Brackets;
  mythosToggle?: boolean;
  showNonCollection?: boolean;
  selectedSort?: SortType;
  filters?: FilterState;
  mythosMode?: boolean;
  visible: boolean;
  toggleMythosMode: () => void;
  clearSearchFilters: () => void;

  investigator?: Card;
  header?: React.ReactElement;
  storyOnly?: boolean;

  initialSort?: SortType;
}

function searchOptionsHeight(fontScale: number) {
  return 20 + (fontScale * 20 + 8) * 3 + 12;
}

const FILTER_BUILDER = new FilterBuilder('filters');

interface SearchState {
  searchCode?: number;
  searchQuery?: RegExp;
}

function SearchOptions({
  searchText,
  searchFlavor,
  searchBack,
  toggleSearchText,
  toggleSearchFlavor,
  toggleSearchBack,
}: {
  searchText: boolean;
  searchFlavor: boolean;
  searchBack: boolean;
  toggleSearchText: () => void;
  toggleSearchFlavor: () => void;
  toggleSearchBack: () => void;
}) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  return (
    <>
      <View style={[styles.column, { alignItems: 'center', flex: 1 }]}>
        <Text style={[typography.large, { color: colors.M, fontSize: 20 * fontScale, fontFamily: 'Alegreya-Bold' }]}>
          { t`Search in:` }
        </Text>
      </View>
      <View style={styles.column}>
        <View style={styles.row}>
          <Text style={[typography.searchLabel, styles.searchOption, typography.dark]}>
            { t`Game Text` }
          </Text>
          <ArkhamSwitch
            useGestureHandler
            value={searchText}
            onValueChange={toggleSearchText}
          />
        </View>
        <View style={styles.row}>
          <Text style={[typography.searchLabel, styles.searchOption, typography.dark]}>
            { t`Flavor Text` }
          </Text>
          <ArkhamSwitch
            useGestureHandler
            value={searchFlavor}
            onValueChange={toggleSearchFlavor}
          />
        </View>
        <View style={styles.row}>
          <Text style={[typography.searchLabel, styles.searchOption, typography.dark]}>
            { t`Card Backs` }
          </Text>
          <ArkhamSwitch
            useGestureHandler
            value={searchBack}
            onValueChange={toggleSearchBack}
          />
        </View>
      </View>
    </>
  );
}

function ExpandModesButtons({
  hasFilters,
  mythosToggle,
  toggleMythosMode,
  clearSearchFilters,
  mythosMode,
}: {
  hasFilters: boolean;
  mythosToggle?: boolean;
  toggleMythosMode: () => void;
  clearSearchFilters: () => void;
  mythosMode?: boolean;
}) {
  if (!mythosToggle && !hasFilters) {
    return null;
  }
  return (
    <View>
      { !!mythosToggle && (
        <ArkhamButton
          icon="search"
          onPress={toggleMythosMode}
          title={mythosMode ? t`Search player cards` : t`Search encounter cards`}
        />
      ) }
      { !!hasFilters && (
        <ArkhamButton
          icon="search"
          onPress={clearSearchFilters}
          title={t`Clear search filters`}
        />
      ) }
    </View>
  );
}

function ExpandSearchButtons({
  hasFilters,
  mythosToggle,
  toggleMythosMode,
  clearSearchFilters,
  mythosMode,
  searchTerm,
  searchText,
  searchBack,
  clearSearchTerm,
  toggleSearchText,
  toggleSearchBack,
}: {
  hasFilters: boolean;
  mythosToggle?: boolean;
  toggleMythosMode: () => void;
  clearSearchFilters: () => void;
  searchText: boolean;
  searchTerm?: string;
  searchBack: boolean;
  mythosMode?: boolean;
  clearSearchTerm: () => void;
  toggleSearchText: () => void;
  toggleSearchBack: () => void;
}) {
  if (!searchTerm) {
    return (
      <ExpandModesButtons
        hasFilters={hasFilters}
        mythosToggle={mythosToggle}
        toggleMythosMode={toggleMythosMode}
        clearSearchFilters={clearSearchFilters}
        mythosMode={mythosMode}
      />
    );
  }
  return (
    <View>
      { !!searchTerm && (
        <ArkhamButton
          icon="search"
          onPress={clearSearchTerm}
          title={t`Clear "${searchTerm}" search`}
        />
      ) }
      { !searchText && (
        <ArkhamButton
          icon="search"
          onPress={toggleSearchText}
          title={t`Search game text`}
        />
      ) }
      { !searchBack && (
        <ArkhamButton
          icon="search"
          onPress={toggleSearchBack}
          title={t`Search card backs`}
        />
      ) }
      <ExpandModesButtons
        hasFilters={hasFilters}
        mythosToggle={mythosToggle}
        toggleMythosMode={toggleMythosMode}
        clearSearchFilters={clearSearchFilters}
        mythosMode={mythosMode}
      />
    </View>
  );
}

export default function({
  componentId,
  deckId,
  baseQuery,
  mythosToggle,
  showNonCollection,
  selectedSort,
  filters,
  mythosMode,
  toggleMythosMode,
  clearSearchFilters,
  investigator,
  header,
  storyOnly,
  initialSort,
}: Props) {
  const { fontScale } = useContext(StyleContext);
  const lang = useSelector(getLangPreference);
  const [searchText, setSearchText] = useState(false);
  const [searchFlavor, setSearchFlavor] = useState(false);
  const [searchBack, setSearchBack] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [searchState, setSearchState] = useState<SearchState>({});
  const toggleSearchText = useCallback(() => setSearchText(!searchText), [searchText]);
  const toggleSearchFlavor = useCallback(() => setSearchFlavor(!searchFlavor), [searchFlavor]);
  const toggleSearchBack = useCallback(() => setSearchBack(!searchBack), [searchBack]);
  const clearSearchTerm = useCallback(() => setSearchTerm(''), []);
  const updateSearch = useCallback((searchTerm: string) => {
    if (!searchTerm) {
      setSearchState({});
      return;
    }
    const searchCode = DIGIT_REGEX.test(searchTerm) ? parseInt(searchTerm, 10) : undefined;
    const term = searchTerm.replace(/“|”/g, '"').replace(/‘|’/, '\'');
    setSearchState({
      searchQuery: new RegExp(`.*${RegexEscape(term)}.*`, 'i'),
      searchCode,
    });
  }, []);
  const debouncedUpdateSearch = debounce(50, updateSearch);
  const searchUpdated = useCallback((text: string) => {
    setSearchTerm(text);
    debouncedUpdateSearch(text);
  }, [setSearchTerm, debouncedUpdateSearch]);

  const textQuery = useMemo(() => {
    const {
      searchCode,
    } = searchState;
    const parts: Brackets[] = [];
    if (searchCode) {
      parts.push(where(`c.position = :searchCode`, { searchCode }));
    }
    if (searchTerm === '' || !searchTerm) {
      return combineQueriesOpt(parts, 'and');
    }
    const safeSearchTerm = `%${searchTerm.toLocaleLowerCase(lang)}%`;
    parts.push(where('c.s_search_name like :searchTerm', { searchTerm: safeSearchTerm }));
    if (searchBack) {
      parts.push(where([
        'c.s_search_name_back like :searchTerm',
        '(c.linked_card is not null AND c.linked_card.s_search_name like :searchTerm)',
        '(c.linked_card is not null AND c.linked_card.s_search_name_back like :searchTerm)',
      ].join(' OR '), { searchTerm: safeSearchTerm }
      ));
    }
    if (searchText) {
      parts.push(where('c.s_search_game like :searchTerm', { searchTerm: safeSearchTerm }));
      if (searchBack) {
        parts.push(where([
          'c.s_search_game_back like :searchTerm',
          '(c.linked_card is not null AND c.linked_card.s_search_game like :searchTerm)',
          '(c.linked_card is not null AND c.linked_card.s_search_game_back like :searchTerm)',
        ].join(' OR '), { searchTerm: safeSearchTerm }));
      }
    }
    if (searchFlavor) {
      parts.push(where('(c.s_search_flavor like :searchTerm)', { searchTerm: safeSearchTerm }));
      if (searchBack) {
        parts.push(where([
          '(c.s_search_flavor_back like :searchTerm)',
          '(c.linked_card is not null AND c.linked_card.s_search_flavor like :searchTerm)',
          '(c.linked_card is not null AND c.linked_card.s_search_flavor_back like :searchTerm)',
        ].join(' OR '), { searchTerm: safeSearchTerm }));
      }
    }
    return combineQueriesOpt(parts, 'or');
  }, [searchState, searchBack, searchFlavor, searchText, searchTerm, lang]);

  const controls = (
    <SearchOptions
      searchText={searchText}
      searchFlavor={searchFlavor}
      searchBack={searchBack}
      toggleSearchText={toggleSearchText}
      toggleSearchFlavor={toggleSearchFlavor}
      toggleSearchBack={toggleSearchBack}
    />
  );

  const query = useMemo(() => {
    const queryParts: Brackets[] = [];
    if (mythosToggle) {
      if (mythosMode) {
        queryParts.push(MYTHOS_CARDS_QUERY);
      } else {
        queryParts.push(BROWSE_CARDS_QUERY);
      }
    }
    if (baseQuery) {
      queryParts.push(baseQuery);
    }
    if (selectedSort === SORT_BY_ENCOUNTER_SET) {
      // queryParts.push(where(`c.encounter_code is not null OR linked_card.encounter_code is not null`));
    }
    return combineQueries(
      BASIC_QUERY,
      queryParts,
      'and'
    );
  }, [baseQuery, mythosToggle, selectedSort, mythosMode]);
  const filterQuery = useMemo(() => filters && FILTER_BUILDER.filterToQuery(filters), [filters]);
  return (
    <CollapsibleSearchBox
      prompt={t`Search for a card`}
      advancedOptions={{
        controls,
        height: searchOptionsHeight(fontScale),
      }}
      searchTerm={searchTerm || ''}
      onSearchChange={searchUpdated}
    >
      { (handleScroll, showHeader) => (
        <>
          <DbCardResultList
            componentId={componentId}
            deckId={deckId}
            query={query}
            filterQuery={filterQuery || undefined}
            textQuery={textQuery}
            searchTerm={searchTerm}
            sort={selectedSort}
            investigator={investigator}
            handleScroll={handleScroll}
            showHeader={showHeader}
            expandSearchControls={(
              <ExpandSearchButtons
                hasFilters={!!filterQuery}
                mythosToggle={mythosToggle}
                toggleMythosMode={toggleMythosMode}
                clearSearchFilters={clearSearchFilters}
                mythosMode={mythosMode}
                searchTerm={searchTerm}
                searchText={searchText}
                searchBack={searchBack}
                clearSearchTerm={clearSearchTerm}
                toggleSearchText={toggleSearchText}
                toggleSearchBack={toggleSearchBack}
              />
            )}
            header={header}
            showNonCollection={showNonCollection}
            storyOnly={storyOnly}
            mythosToggle={mythosToggle}
            //            mythosMode={mythosToggle && mythosMode}
            initialSort={initialSort}
          />
          { deckId !== undefined && (
            <View style={styles.footer}>
              <DeckNavFooter deckId={deckId} componentId={componentId} />
            </View>
          ) }
        </>
      ) }
    </CollapsibleSearchBox>
  );
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
