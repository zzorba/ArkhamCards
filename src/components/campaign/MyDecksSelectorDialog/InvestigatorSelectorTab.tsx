import React, { useCallback } from 'react';
import { Navigation } from 'react-native-navigation';

import { DeckId, SortType } from '@actions/types';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import Card from '@data/types/Card';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';

interface Props {
  componentId: string;
  onInvestigatorSelect: (card: Card) => void;
  searchOptions?: SearchOptions;
  sort: SortType;

  onlyDeckIds?: DeckId[];
  filterDeckIds: DeckId[];
  filterInvestigators: string[];
}

export default function InvestigatorSelectorTab({
  componentId,
  searchOptions,
  filterInvestigators,
  sort,
  onInvestigatorSelect,
}: Props) {
  const investigatorSelected = useCallback((card: Card) => {
    onInvestigatorSelect(card);
    Navigation.dismissModal(componentId);
  }, [onInvestigatorSelect, componentId]);

  return (
    <InvestigatorsListComponent
      componentId={componentId}
      hideDeckbuildingRules
      sort={sort}
      searchOptions={searchOptions}
      onPress={investigatorSelected}
      filterInvestigators={filterInvestigators}
    />
  );
}
