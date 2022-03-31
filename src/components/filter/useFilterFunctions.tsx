import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Brackets } from 'typeorm/browser';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { pick } from 'lodash';
import { t, ngettext, msgid } from 'ttag';

import DatabaseContext from '@data/sqlite/DatabaseContext';
import { getFilterState, getDefaultFilterState, AppState, getCardFilterData } from '@reducers';
import FilterBuilder, { CardFilterData, DefaultCardFilterData, FilterState, defaultFilterState as DefaultFilterState } from '@lib/filters';
import { combineQueriesOpt, NO_CUSTOM_CARDS_QUERY } from '@data/sqlite/query';
import StyleContext from '@styles/StyleContext';
import { useNavigationButtonPressed } from '@components/core/hooks';
import { clearFilters, toggleFilter, updateFilter } from './actions';
import { NavigationProps } from '@components/nav/types';
import LanguageContext from '@lib/i18n/LanguageContext';
import deepEqual from 'deep-equal';

export interface FilterFunctionProps {
  filterId: string;
  tabooSetId?: number;
  modal?: boolean;
  baseQuery?: Brackets;
}

export interface WithFilterFunctionsOptions {
  clearTraits?: string[];
  title: string;
}

interface FilterFunctions {
  filters: FilterState;
  defaultFilterState: FilterState;
  cardFilterData: CardFilterData;
  pushFilterView: (screenName: string) => void;
  onToggleChange: (key: keyof FilterState, value: boolean) => void;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export default function useFilterFunctions({
  componentId,
  filterId,
  tabooSetId,
  modal,
  baseQuery,
}: FilterFunctionProps & NavigationProps,
{
  clearTraits,
  title,
}: WithFilterFunctionsOptions): FilterFunctions {
  const { db } = useContext(DatabaseContext);
  const { colors } = useContext(StyleContext);
  const { useCardTraits } = useContext(LanguageContext);
  const currentFilters = useSelector<AppState, FilterState | undefined>(state => getFilterState(state, filterId));
  const defaultFilterState = useSelector<AppState, FilterState | undefined>(state => getDefaultFilterState(state, filterId));
  const cardFilterData = useSelector<AppState, CardFilterData | undefined>(state => getCardFilterData(state, filterId));
  const dispatch = useDispatch();
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'clear') {
      dispatch(clearFilters(filterId, clearTraits));
    } else if (buttonId === 'apply') {
      Navigation.pop(componentId);
    }
  }, componentId, [filterId, clearTraits]);

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
          ...(baseQuery ? [baseQuery as Brackets] : []),
          NO_CUSTOM_CARDS_QUERY,
          ...(filterParts ? [filterParts] : []),
        ],
        'and'
      ),
      tabooSetId
    ).then(count => {
      if (!canceled) {
        setCount(count);
      }
    });
    return () => {
      canceled = true;
    }
  }, [currentFilters, baseQuery, tabooSetId, db, useCardTraits]);
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: hasChanges ?
          [{
            text: t`Clear`,
            id: 'clear',
            color: colors.M,
            accessibilityLabel: t`Clear`,
          }] : [],
        title: {
          text: title,
          color: colors.M,
        },
        subtitle: {
          text: ngettext(
            msgid`${count} Card`,
            `${count} Cards`,
            count
          ),
          color: colors.M,
        },
      },
    });
  }, [count, hasChanges, colors.M, title, componentId]);

  const pushFilterView = useCallback((screenName: string) => {
    Navigation.push<FilterFunctionProps>(componentId, {
      component: {
        name: screenName,
        passProps: {
          filterId,
          tabooSetId,
          baseQuery,
          modal,
        },
      },
    });
  }, [componentId, filterId, tabooSetId, baseQuery, modal]);

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
