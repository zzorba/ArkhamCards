import React, { useCallback, useContext } from 'react';

import InvestigatorRow from '@components/core/InvestigatorRow';
import { Deck, DeckId } from '@actions/types';
import Card from '@data/types/Card';
import { useDeckWithFetch, useInvestigatorCards } from '@components/core/hooks';
import { TINY_PHONE } from '@styles/sizes';
import LanguageContext from '@lib/i18n/LanguageContext';
import { DeckActions } from '@data/remote/decks';

interface Props {
  id: DeckId;
  actions: DeckActions;
  deckRemoved?: (
    id: DeckId,
    deck?: Deck,
    investigator?: Card
  ) => void;
}

export default function InvestigatorDeckRow({ id, actions, deckRemoved }: Props) {
  const { lang } = useContext(LanguageContext);
  const deck = useDeckWithFetch(id, actions);
  const investigators = useInvestigatorCards(deck?.deck.taboo_id || 0);
  const investigator = deck && investigators && investigators[deck.deck.investigator_code];
  const onRemove = useCallback(() => {
    deckRemoved && deckRemoved(id, deck?.deck, investigator);
  }, [
    deckRemoved,
    id,
    deck,
    investigator,
  ]);
  if (!deck || !investigator) {
    return null;
  }
  return (
    <InvestigatorRow
      investigator={investigator}
      onRemove={deckRemoved ? onRemove : undefined}
      noFactionIcon={TINY_PHONE || lang !== 'en'}
    />
  );
}