import React, { useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';

import Card from '@data/types/Card';
import { DeckId, Slots } from '@actions/types';
import { useSlotActions } from '@components/core/hooks';
import { useDeck } from '@data/hooks';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import LoadingCardSearchResult from '@components/cardlist/LoadingCardSearchResult';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BasicStackParamList } from '@navigation/types';

export interface SelectExileCardsProps {
  deckId: DeckId;
  selection: Slots;
  onExileCountChange: (card: Card, count: number) => void;
}

export default function SelectExileCardsView() {
  const route = useRoute<RouteProp<BasicStackParamList,'Guide.ExileSelector'>>();
  const { deckId, selection: initialSelection, onExileCountChange } = route.params;
  const deck = useDeck(deckId);
  const [selection, { setSlot }] = useSlotActions(initialSelection);
  const onUpdate = useCallback((card: Card, count: number) => {
    setSlot(card.code, count);
    onExileCountChange(card, count);
  }, [onExileCountChange, setSlot]);
  const slots = useMemo(() => deck?.deck.slots ?? {}, [deck?.deck.slots]);
  return (
    <ScrollView>
      { deck ? (
        <CardSelectorComponent
          slots={slots}
          counts={selection}
          updateCount={onUpdate}
        />
      ) : (
        <LoadingCardSearchResult />
      ) }
    </ScrollView>
  );
}
