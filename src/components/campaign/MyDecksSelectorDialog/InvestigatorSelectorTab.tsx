import React, { useCallback } from 'react';


import { SortType } from '@actions/types';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import Card from '@data/types/Card';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import { useNavigation } from '@react-navigation/native';
import useInvestigatorPrintingSelector from './InvestigatorPrintingSelectorDialog';

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

  const handlePrintingSelected = useCallback((card: Card) => {
    // Pass the printing code to the callback
    // The callback will need to know both the canonical code and the printing
    onInvestigatorSelect(card);
    navigation.goBack();
  }, [onInvestigatorSelect, navigation]);

  const [dialog, showDialog] = useInvestigatorPrintingSelector({
    onSelectPrinting: handlePrintingSelected,
    includeParallel,
  });

  const investigatorSelected = useCallback(async(card: Card) => {
    const shouldShowDialog = await showDialog(card);
    if (!shouldShowDialog) {
      onInvestigatorSelect(card);
      navigation.goBack();
    }
  }, [navigation, onInvestigatorSelect, showDialog]);

  return (
    <>
      <InvestigatorsListComponent
        hideDeckbuildingRules
        sort={sort}
        searchOptions={searchOptions}
        onPress={investigatorSelected}
        filterInvestigators={filterInvestigators}
      />
      {dialog}
    </>
  );
}
