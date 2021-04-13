import React, { useCallback } from 'react';
import { Navigation } from 'react-native-navigation';

import MyDecksComponent from '@components/decklist/MyDecksComponent';
import { Deck } from '@actions/types';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import MiniDeckT from '@data/interfaces/MiniDeckT';

interface Props {
  componentId: string;
  onDeckSelect: (deck: Deck) => void;
  searchOptions?: SearchOptions;

  onlyDecks?: MiniDeckT[];
  filterDeck?: (deck: MiniDeckT) => boolean;
}

export default function DeckSelectorTab({
  componentId,
  searchOptions,
  filterDeck,
  onlyDecks,
  onDeckSelect,
}: Props) {
  const deckSelected = useCallback((deck: Deck) => {
    onDeckSelect(deck);
    Navigation.dismissModal(componentId);
  }, [onDeckSelect, componentId]);

  return (
    <MyDecksComponent
      searchOptions={searchOptions}
      deckClicked={deckSelected}
      onlyDecks={onlyDecks}
      filterDeck={filterDeck}
    />
  );
}
