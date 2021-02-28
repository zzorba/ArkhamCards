import React from 'react';

import { Deck, DeckId, Slots } from '@actions/types';
import Card from '@data/types/Card';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import { useDeck } from '@components/core/hooks';

interface OwnProps {
  componentId: string;
  id: DeckId;
  exileCounts: Slots;
  updateExileCount: (card: Card, count: number) => void;
  label?: React.ReactNode;
}

interface ReduxProps {
  deck?: Deck;
}

type Props = OwnProps & ReduxProps;

function isExile(card: Card) {
  return !!card.exile;
}

export default function ExileCardSelectorComponent({ componentId, id, exileCounts, updateExileCount, label }: Props) {
  const [deck] = useDeck(id);
  if (!deck) {
    return null;
  }
  return (
    <CardSelectorComponent
      componentId={componentId}
      slots={deck.slots || {}}
      counts={exileCounts}
      updateCount={updateExileCount}
      filterCard={isExile}
      header={label}
    />
  );
}
