import React from 'react';

import { Deck, Slots } from '@actions/types';
import Card from '@data/Card';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import { useDeck } from '@components/core/hooks';

interface OwnProps {
  componentId: string;
  id: number;
  exileCounts: Slots;
  updateExileCounts: (exileCounts: Slots) => void;
  label?: React.ReactNode;
}

interface ReduxProps {
  deck?: Deck;
}

type Props = OwnProps & ReduxProps;

function isExile(card: Card) {
  return !!card.exile;
}

export default function ExileCardSelectorComponent({ componentId, id, exileCounts, updateExileCounts, label }: Props) {
  const [deck] = useDeck(id, {});
  if (!deck) {
    return null;
  }
  return (
    <CardSelectorComponent
      componentId={componentId}
      slots={deck.slots}
      counts={exileCounts}
      updateCounts={updateExileCounts}
      filterCard={isExile}
      header={label}
    />
  );
}
