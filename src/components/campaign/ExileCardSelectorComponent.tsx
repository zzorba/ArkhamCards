import React, { useCallback } from 'react';

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
  storyCards?: Slots;
}

function isExile(card: Card) {
  return !!card.exile;
}

export default function ExileCardSelectorComponent({ alwaysShow, componentId, disabled, deck, exileCounts, updateExileCount, label, children, storyCards }: Props) {
  const isStandardExile = useCallback((card: Card) => {
    // We handle story cards somewhere else.
    return isExile(card) && (!storyCards || !storyCards[card.code]);
  }, [storyCards]);

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
        filterCard={isStandardExile}
        header={label}
        forceHeader={!!children || (!disabled && !!alwaysShow)}
        locked={disabled}
      />
      { children }
    </>
  );
}
