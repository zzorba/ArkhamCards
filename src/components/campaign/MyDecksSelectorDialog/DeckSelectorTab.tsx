import React, { useCallback } from 'react';
import { Navigation } from 'react-native-navigation';

import MyDecksComponent from '@components/decklist/MyDecksComponent';
import { Deck, DeckId } from '@actions/types';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';

interface Props {
  componentId: string;
  onDeckSelect: (deck: Deck) => void;
  searchOptions?: SearchOptions;

  onlyDeckIds?: DeckId[];
  onlyInvestigators?: string[];
  filterDeckIds: DeckId[];
  filterInvestigators: string[];
}

export default function DeckSelectorTab({
  componentId,
  searchOptions,
  filterInvestigators,
  filterDeckIds,
  onlyDeckIds,
  onlyInvestigators,
  onDeckSelect,
}: Props) {
  const deckSelected = useCallback((deck: Deck) => {
    onDeckSelect(deck);
    Navigation.dismissModal(componentId);
  }, [onDeckSelect, componentId]);

  return (
    <MyDecksComponent
      componentId={componentId}
      searchOptions={searchOptions}
      deckClicked={deckSelected}
      onlyDeckIds={onlyDeckIds}
      onlyInvestigators={onlyInvestigators}
      filterDeckIds={filterDeckIds}
      filterInvestigators={filterInvestigators}
    />
  );
}
