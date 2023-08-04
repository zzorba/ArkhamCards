import { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { Brackets } from 'typeorm/browser';
import { createSelector } from 'reselect';
import { t } from 'ttag';

import FilterBuilder, { CardFilterData, FilterState } from '@lib/filters';
import { getFilterState, getCardFilterData, AppState } from '@reducers';
import { CardFilterProps } from '@components/filter/CardFilterView';
import LanguageContext from '@lib/i18n/LanguageContext';

const makeFilterSelector = (): (state: AppState, filterId: string, useCardTraits: boolean) => [boolean, CardFilterData | undefined] =>
  createSelector(
    (state: AppState, filterId: string, useCardTraits: boolean) => getCardFilterData(state, filterId),
    (state: AppState, filterId: string, useCardTraits: boolean) => getFilterState(state, filterId),
    (state: AppState, filterId: string, useCardTraits: boolean) => useCardTraits,
    (cardData, filters, useCardTraits) => {
      if (!filters) {
        return [false, cardData];
      }
      return [
        !!new FilterBuilder('default').filterToQuery(filters, useCardTraits),
        cardData,
      ];
    }
  );



export function useFilterButton({ componentId, filterId, baseQuery, modal }: { componentId: string, filterId: string, baseQuery?: (filters: FilterState | undefined) => Brackets, modal?: boolean }): [boolean, () => void] {
  const { useCardTraits } = useContext(LanguageContext);
  const filterSelector = useMemo(() => makeFilterSelector(), []);
  const [filters, cardData] = useSelector((state: AppState) => filterSelector(state, filterId, useCardTraits));
  const onPress = useCallback(() => {
    if (!cardData) {
      return;
    }
    Navigation.push<CardFilterProps>(componentId, {
      component: {
        name: 'SearchFilters',
        passProps: {
          filterId,
          baseQuery,
          modal,
        },
        options: {
          topBar: {
            backButton: {
              title: t`Apply`,
            },
            title: {
              text: t`Filters`,
            },
          },
        },
      },
    });
  }, [filterId, componentId, baseQuery, modal, cardData]);
  return [filters, onPress];
}