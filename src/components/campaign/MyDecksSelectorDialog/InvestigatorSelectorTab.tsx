import React, { useCallback } from 'react';


import { SortType } from '@actions/types';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import Card from '@data/types/Card';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { useNavigation } from '@react-navigation/native';

interface Props {
  onInvestigatorSelect: (card: Card) => void;
  searchOptions?: SearchOptions;
  sort: SortType[];
  filterInvestigators: string[];
  includeParallel?: boolean;
}

export default function InvestigatorSelectorTab({
  searchOptions,
  filterInvestigators,
  sort,
  onInvestigatorSelect,
  includeParallel,
}: Props) {
  const navigation = useNavigation();
  const investigatorSelected = useCallback((card: Card) => {
    onInvestigatorSelect(card);
    navigation.goBack();
  }, [navigation, onInvestigatorSelect]);

  return (
    <InvestigatorsListComponent
      hideDeckbuildingRules
      sort={sort}
      searchOptions={searchOptions}
      onPress={investigatorSelected}
      filterInvestigators={filterInvestigators}
      includeParallelInvestigators={includeParallel}
    />
  );
}
