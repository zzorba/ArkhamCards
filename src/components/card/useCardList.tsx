import { useMemo } from 'react';
import { forEach, flatMap } from 'lodash';

import Card, { CardsMap } from '@data/types/Card';
import { combineQueriesOpt } from '@data/sqlite/query';
import FilterBuilder from '@lib/filters';
import useCardsFromQuery from './useCardsFromQuery';
import { usePlayerCards } from '@components/core/hooks';

const FILTER_BUILDER = new FilterBuilder('clw');
const EMPTY_CODES: string[] = [];
const EMPTY_CARDS: Card[] = [];

export default function useCardList(codes: string[], type: 'player' | 'encounter', tabooSetOverride?: number): [Card[], boolean] {
  const [playerCodes, query] = useMemo(() => {
    if (type === 'player') {
      return [codes, undefined];
    }
    return [EMPTY_CODES, combineQueriesOpt(
      FILTER_BUILDER.equalsVectorClause(codes, 'code'),
      'and'
    )];
  }, [codes, type]);
  const [playerCards, playerCardsLoading] = usePlayerCards(playerCodes, tabooSetOverride);
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

export function useCardMap(codes: string[], type: 'player' | 'encounter', tabooSetOverride?: number): [CardsMap, boolean] {
  const [cards, loading] = useCardList(codes, type, tabooSetOverride);
  const cardMap = useMemo(() => {
    const r: CardsMap = {};
    forEach(cards, c => {
      r[c.code] = c;
    });
    return r;
  }, [cards]);
  return [cardMap, loading];
}