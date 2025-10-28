import { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Brackets } from 'typeorm/browser';
import { createSelector } from 'reselect';

import FilterBuilder, { CardFilterData, FilterState } from '@lib/filters';
import { getFilterState, getCardFilterData, AppState } from '@reducers';
import LanguageContext from '@lib/i18n/LanguageContext';
import { Slots } from '@actions/types';

const makeFilterSelector = (): (state: AppState, filterId: string, useCardTraits: boolean) => [boolean, CardFilterData | undefined] =>
  createSelector(
    (state: AppState, filterId: string) => getCardFilterData(state, filterId),
    (state: AppState, filterId: string) => getFilterState(state, filterId),
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


type Props = {
  filterId: string;
  baseQuery?: (filters: FilterState | undefined, slots: Slots | undefined) => Brackets;
  modal?: boolean;
};

export function useFilterButton({ filterId, baseQuery, modal }: Props): [boolean, () => void] {
  const { useCardTraits } = useContext(LanguageContext);
  const navigation = useNavigation();
  const filterSelector = useMemo(() => makeFilterSelector(), []);
  const [filters, cardData] = useSelector((state: AppState) => filterSelector(state, filterId, useCardTraits));
  const onPress = useCallback(() => {
    if (!cardData) {
      return;
    }
    navigation.navigate('SearchFilters', {
      filterId,
      baseQuery,
      modal,
    });
  }, [filterId, navigation, baseQuery, modal, cardData]);
  return [filters, onPress];
}