import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';

import { NavigationProps } from '@components/nav/types';
import Card from '@data/types/Card';
import { DeckId, Slots } from '@actions/types';
import { useSlotActions } from '@components/core/hooks';
import { useDeck } from '@data/hooks';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';

export interface SelectExileCardsProps {
  deckId: DeckId;
  selection: Slots;
  onExileCountChange: (card: Card, count: number) => void;
}

type Props = SelectExileCardsProps & NavigationProps;

export default function SelectExileCardsView({ componentId, deckId, selection: initialSelection, onExileCountChange }: Props) {
  const deck = useDeck(deckId);
  const [selection, { setSlot }] = useSlotActions(initialSelection);
  const onUpdate = useCallback((card: Card, count: number) => {
    setSlot(card.code, count);
    onExileCountChange(card, count);
  }, [onExileCountChange, setSlot]);
  return (
    <ScrollView>
      { deck ? (
        <CardSelectorComponent
          componentId={componentId}
          slots={deck.deck.slots || {}}
          counts={selection}
          updateCount={onUpdate}
        />
      ) : (
        <LoadingCardSearchResult />
      ) }
    </ScrollView>
  );
}
