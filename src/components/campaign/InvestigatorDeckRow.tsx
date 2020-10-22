import React, { useCallback } from 'react';

import InvestigatorRow from '@components/core/InvestigatorRow';
import { Deck } from '@actions/types';
import Card from '@data/Card';
import { useDeck, useInvestigatorCards } from '@components/core/hooks';

interface Props {
  id: number;
  deckRemoved?: (
    id: number,
    deck?: Deck,
    investigator?: Card
  ) => void;
}

export default function InvestigatorDeckRow({ id, deckRemoved }: Props) {
  const [theDeck] = useDeck(id, true);
  const investigators = useInvestigatorCards(theDeck?.taboo_id || 0);
  const investigator = theDeck && investigators && investigators[theDeck.investigator_code];
  const onRemove = useCallback(() => {
    deckRemoved && deckRemoved(id, theDeck, investigator);
  }, [
    deckRemoved,
    id,
    theDeck,
    investigator,
  ]);
  if (!theDeck || !investigator) {
    return null;
  }
  return (
    <InvestigatorRow
      investigator={investigator}
      onRemove={deckRemoved ? onRemove : undefined}
    />
  );
}