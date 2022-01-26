import React, { useCallback } from 'react';
import { Navigation } from 'react-native-navigation';

import MyDecksComponent from '@components/decklist/MyDecksComponent';
import { Deck } from '@actions/types';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';

interface Props {
  componentId: string;
  onDeckSelect: (deck: Deck) => Promise<void>;
  searchOptions?: SearchOptions;

  onlyDecks?: MiniDeckT[];
  filterDeck?: (deck: MiniDeckT) => string | undefined;
  renderExpandButton?: (reason: string) => React.ReactNode | null;
}

export default function DeckSelectorTab({
  componentId,
  searchOptions,
  filterDeck,
  onlyDecks,
  onDeckSelect,
  renderExpandButton,
}: Props) {
  const deckSelected = useCallback(async(deck: LatestDeckT) => {
    onDeckSelect(deck.deck);
    Navigation.dismissModal(componentId);
  }, [onDeckSelect, componentId]);
  return (
    <MyDecksComponent
      searchOptions={searchOptions}
      deckClicked={deckSelected}
      onlyDecks={onlyDecks}
      filterDeck={filterDeck}
      renderExpandButton={renderExpandButton}
    />
  );
}
