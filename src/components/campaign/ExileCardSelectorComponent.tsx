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
  children: React.ReactNode;
  disabled?: boolean;
  alwaysShow?: boolean;
}

function isExile(card: Card) {
  return !!card.exile;
}

export default function ExileCardSelectorComponent({ alwaysShow, componentId, disabled, deck, exileCounts, updateExileCount, label, children }: Props) {
  if (!deck) {
    return <>{children}</>;
  }
  return (
    <>
      <CardSelectorComponent
        componentId={componentId}
        slots={deck.deck.slots || {}}
        counts={exileCounts}
        updateCount={updateExileCount}
        filterCard={isExile}
        header={label}
        forceHeader={!!children || (!disabled && !!alwaysShow)}
        locked={disabled}
      />
      { children }
    </>
  );
}
