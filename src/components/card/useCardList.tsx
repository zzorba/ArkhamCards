import { useMemo } from 'react';
import { forEach, flatMap } from 'lodash';

import Card, { CardsMap } from '@data/types/Card';
import { combineQueriesOpt } from '@data/sqlite/query';
import FilterBuilder from '@lib/filters';
import useCardsFromQuery from './useCardsFromQuery';
import { usePlayerCards } from '@components/core/hooks';
import { Brackets } from 'typeorm/browser';

const FILTER_BUILDER = new FilterBuilder('clw');
const EMPTY_CODES: string[] = [];
const EMPTY_CARDS: Card[] = [];

export default function useCardList(codes: string[], type: 'player' | 'encounter', store: boolean, tabooSetOverride?: number): [Card[], boolean] {
  const [playerCodes, query] = useMemo(() => {
    if (type === 'player') {
      return [codes, undefined];
    }
    return [EMPTY_CODES, combineQueriesOpt(
      FILTER_BUILDER.equalsVectorClause(codes, 'code'),
      'and'
    )];
  }, [codes, type]);
  const [playerCards, playerCardsLoading] = usePlayerCards(playerCodes, store, tabooSetOverride);
  const [queryCards, queryCardsLoading] = useCardsFromQuery({ query, tabooSetOverride });
  return useMemo(() => {
    if (!codes.length) {
      return [EMPTY_CARDS, false];
    }
    if (type === 'player') {
      return [playerCards ? flatMap(codes, c => {
        const card = playerCards[c];
        return card ? card : [];
      }) : EMPTY_CARDS, !playerCards];
    }

    return [queryCards, queryCardsLoading];
  }, [codes, type, playerCards, queryCards, queryCardsLoading]);
}

function toCardMap(cards: Card[]): CardsMap {
  const r: CardsMap = {};
  forEach(cards, c => {
    r[c.code] = c;
  });
  return r;
}

export function useCardMap(codes: string[], type: 'player' | 'encounter', store: boolean, tabooSetOverride?: number): [CardsMap, boolean] {
  const [cards, loading] = useCardList(codes, type, store, tabooSetOverride);
  const cardMap = useMemo(() => toCardMap(cards), [cards]);
  return [cardMap, loading];
}

export function useCardMapFromQuery(query: Brackets): [CardsMap, boolean] {
  const [cards, loading] = useCardsFromQuery({ query });
  const cardMap = useMemo(() => toCardMap(cards), [cards]);
  return [cardMap, loading];
}