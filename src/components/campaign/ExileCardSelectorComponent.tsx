import React from 'react';

import { Slots } from '@actions/types';
import Card from '@data/types/Card';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import LatestDeckT from '@data/interfaces/LatestDeckT';

interface Props {
  componentId: string;
  deck?: LatestDeckT;
  exileCounts: Slots;
  updateExileCount: (card: Card, count: number) => void;
  label?: React.ReactNode;
}

function isExile(card: Card) {
  return !!card.exile;
}

export default function ExileCardSelectorComponent({ componentId, deck, exileCounts, updateExileCount, label }: Props) {
  if (!deck) {
    return null;
  }
  return (
    <CardSelectorComponent
      componentId={componentId}
      slots={deck.deck.slots || {}}
      counts={exileCounts}
      updateCount={updateExileCount}
      filterCard={isExile}
      header={label}
    />
  );
}
