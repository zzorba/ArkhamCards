import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import FilterBuilder, { CardFilterData } from '@lib/filters';
import { getFilterState, getCardFilterData, AppState } from '@reducers';
import { CardFilterProps } from '@components/filter/CardFilterView';

export function useFilterButton(filterId: string, baseQuery?: Brackets, modal?: boolean): [boolean, () => void] {
  const filterSelector = useCallback((state: AppState): [boolean, CardFilterData | undefined] => {
    const cardData = getCardFilterData(state, filterId);
    const filters = getFilterState(state, filterId);
    if (!filters) {
      return [false, cardData];
    }
    return [
      !!new FilterBuilder('default').filterToQuery(filters, true),
      cardData,
    ];
  }, [filterId]);
  const [filters, cardData] = useSelector(filterSelector);
  const onPress = useCallback(() => {
    if (!cardData) {
      return;
    }
    Navigation.push<CardFilterProps>(filterId, {
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
  }, [filterId, baseQuery, modal, cardData]);
  return [filters, onPress];
}