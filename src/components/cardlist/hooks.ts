import { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import FilterBuilder, { CardFilterData, FilterState } from '@lib/filters';
import { getFilterState, getCardFilterData, AppState } from '@reducers';
import { CardFilterProps } from '@components/filter/CardFilterView';
import LanguageContext from '@lib/i18n/LanguageContext';

export function useFilterButton({ componentId, filterId, baseQuery, modal }: { componentId: string, filterId: string, baseQuery?: (filters: FilterState | undefined) => Brackets, modal?: boolean }): [boolean, () => void] {
  const { useCardTraits } = useContext(LanguageContext);
  const filterSelector = useCallback((state: AppState): [boolean, CardFilterData | undefined] => {
    const cardData = getCardFilterData(state, filterId);
    const filters = getFilterState(state, filterId);
    if (!filters) {
      return [false, cardData];
    }
    return [
      !!new FilterBuilder('default').filterToQuery(filters, useCardTraits),
      cardData,
    ];
  }, [filterId, useCardTraits]);
  const [filters, cardData] = useSelector(filterSelector);
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