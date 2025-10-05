import React, { useCallback } from 'react';


import MyDecksComponent from '@components/decklist/MyDecksComponent';
import { Deck } from '@actions/types';
import { SearchOptions } from '@components/core/CollapsibleSearchBox';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { useNavigation } from '@react-navigation/native';

interface Props {
  onDeckSelect: (deck: Deck) => Promise<void>;
  searchOptions?: SearchOptions;

  onlyDecks?: MiniDeckT[];
  filterDeck?: (deck: MiniDeckT) => string | undefined;
  renderExpandButton?: (reason: string) => React.ReactNode | null;
}

export default function DeckSelectorTab({
  searchOptions,
  filterDeck,
  onlyDecks,
  onDeckSelect,
  renderExpandButton,
}: Props) {
  const navigation = useNavigation();
  const deckSelected = useCallback(async(deck: LatestDeckT) => {
    onDeckSelect(deck.deck);
    navigation.goBack();
  }, [navigation, onDeckSelect]);
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
