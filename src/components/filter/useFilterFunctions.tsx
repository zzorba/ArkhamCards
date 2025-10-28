import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Brackets } from 'typeorm/browser';

import { useDispatch, useSelector } from 'react-redux';
import { pick } from 'lodash';
import { t, ngettext, msgid } from 'ttag';

import DatabaseContext from '@data/sqlite/DatabaseContext';
import { getFilterState, getDefaultFilterState, AppState, getCardFilterData } from '@reducers';
import FilterBuilder, { CardFilterData, DefaultCardFilterData, FilterState, defaultFilterState as DefaultFilterState } from '@lib/filters';
import { combineQueriesOpt, NO_CUSTOM_CARDS_QUERY } from '@data/sqlite/query';
import StyleContext from '@styles/StyleContext';
import { clearFilters, toggleFilter, updateFilter } from './actions';
import LanguageContext from '@lib/i18n/LanguageContext';
import deepEqual from 'deep-equal';
import { Slots } from '@actions/types';
import { useNavigation } from '@react-navigation/native';
import HeaderTitle from '@components/core/HeaderTitle';
import HeaderButton from '@components/core/HeaderButton';

export interface FilterFunctionProps {
  filterId: string;
  tabooSetId?: number;
  modal?: boolean;
  baseQuery?: (filters: FilterState | undefined, slots: Slots | undefined) => Brackets;
}

export interface WithFilterFunctionsOptions {
  clearTraits?: string[];
  title: string;
}

type ScreenName = 'SearchFilters.Asset' | 'SearchFilters.Enemy' | 'SearchFilters.Location' | 'SearchFilters.Packs';
interface FilterFunctions {
  filters: FilterState;
  defaultFilterState: FilterState;
  cardFilterData: CardFilterData;
  pushFilterView: (screenName: ScreenName) => void;
  onToggleChange: (key: keyof FilterState, value: boolean) => void;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export default function useFilterFunctions({
  filterId,
  tabooSetId,
  modal,
  baseQuery,
}: FilterFunctionProps,
{
  clearTraits,
  title,
}: WithFilterFunctionsOptions): FilterFunctions {
  const navigation = useNavigation();
  const { db } = useContext(DatabaseContext);
  const { colors } = useContext(StyleContext);
  const { useCardTraits } = useContext(LanguageContext);
  const currentFilters = useSelector<AppState, FilterState | undefined>(state => getFilterState(state, filterId));
  const defaultFilterState = useSelector<AppState, FilterState | undefined>(state => getDefaultFilterState(state, filterId));
  const cardFilterData = useSelector<AppState, CardFilterData | undefined>(state => getCardFilterData(state, filterId));
  const dispatch = useDispatch();
  const hasChanges = useMemo(() => {
    return !((clearTraits && clearTraits.length) ?
      deepEqual(
        pick(currentFilters, clearTraits),
        pick(defaultFilterState, clearTraits)
      ) :
      deepEqual(currentFilters, defaultFilterState));
  }, [defaultFilterState, clearTraits, currentFilters]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const filterParts: Brackets | undefined =
      currentFilters && new FilterBuilder('filters').filterToQuery(currentFilters, useCardTraits);
    let canceled = false;
    db.getCardCount(
      combineQueriesOpt(
        [
          ...(baseQuery ? [baseQuery(currentFilters, undefined)] : []),
          NO_CUSTOM_CARDS_QUERY,
          ...(filterParts ? [filterParts] : []),
        ],
        'and'
      ),
      currentFilters?.taboo_set || tabooSetId
    ).then(count => {
      if (!canceled) {
        setCount(count);
      }
    });
    return () => {
      canceled = true;
    }
  }, [currentFilters, baseQuery, tabooSetId, db, useCardTraits]);
  const onClear = useCallback(() => dispatch(clearFilters(filterId, clearTraits)), [dispatch, filterId, clearTraits]);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitle
          title={title}
          subtitle={ngettext(
            msgid`${count} Card`,
            `${count} Cards`,
            count
          )}
          color={colors.M}
        />
      ),
      headerRight: hasChanges ? () => (
        <HeaderButton
          text={t`Clear`}
          accessibilityLabel={t`Clear`}
          color={colors.M}
          onPress={onClear}
        />
      ) : undefined,
    });
  }, [count, hasChanges, colors.M, title, navigation, onClear]);

  const pushFilterView = useCallback((screenName: ScreenName) => {
    navigation.navigate(screenName, {
      filterId,
      tabooSetId,
      baseQuery,
      modal,
    });
  }, [navigation, filterId, tabooSetId, baseQuery, modal]);

  const onToggleChange = useCallback((key: keyof FilterState, value: boolean) => {
    dispatch(toggleFilter(filterId, key, value));
  }, [filterId, dispatch]);

  const onFilterChange = useCallback((key: keyof FilterState, selection: any) => {
    dispatch(updateFilter(filterId, key, selection));
  }, [filterId, dispatch]);

  return {
    // Note: these defaults should never come into play, but make type-system happy
    // with suitable defaults.
    filters: (currentFilters || defaultFilterState || DefaultFilterState),
    defaultFilterState: defaultFilterState || DefaultFilterState,
    cardFilterData: cardFilterData || DefaultCardFilterData,
    pushFilterView,
    onToggleChange,
    onFilterChange,
  };
}
