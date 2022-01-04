import { useMemo } from 'react';
import { flatMap, forEach } from 'lodash';

import Card, { CardsMap } from '@data/types/Card';
import { combineQueriesOpt } from '@data/sqlite/query';
import FilterBuilder from '@lib/filters';
import { useInvestigatorCards, usePlayerCards } from '@components/core/hooks';
import useCardsFromQuery from './useCardsFromQuery';

const FILTER_BUILDER = new FilterBuilder('clw');

export default function useCardList(codes: string[], type: 'player' | 'encounter', tabooSetOverride?: number): [Card[], boolean] {
  const query = useMemo(() => {
    //if (!codes.length || type === 'player') {
    //  return undefined;
    //}
    return combineQueriesOpt(
      FILTER_BUILDER.equalsVectorClause(codes, 'code'),
      'and'
    );
  }, [codes, type]);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();
  const [queryCards, queryCardsLoading] = useCardsFromQuery({ query, tabooSetOverride });
  return useMemo(() => {
    if (!codes.length) {
      return [[], false];
    }/*
    if (type === 'player') {
      if (!cards || !investigators) {
        return [[], true];
      }
      const playerCards = flatMap(codes, code => cards[code] || investigators[code] || []);
      return [playerCards, false];
    }*/
    return [queryCards, queryCardsLoading];
  }, [codes, type, cards, investigators, queryCards, queryCardsLoading]);
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