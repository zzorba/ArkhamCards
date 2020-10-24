import React, { useMemo } from 'react';
import { flatMap } from 'lodash';

import CardQueryWrapper from '@components/card/CardQueryWrapper';
import Card from '@data/Card';
import { combineQueriesOpt } from '@data/query';
import FilterBuilder from '@lib/filters';
import { useInvestigatorCards, usePlayerCards } from '@components/core/hooks';

interface Props<T> {
  codes: string[];
  type: 'player' | 'encounter';
  children: (cards: Card[], loading: boolean, extraProps?: T) => React.ReactNode | null;
  extraProps?: T;
}

const FILTER_BUILDER = new FilterBuilder('clw');

export default function CardListWrapper<T>({ codes, type, children, extraProps }: Props<T>) {
  const query = useMemo(() => {
    return combineQueriesOpt(
      FILTER_BUILDER.equalsVectorClause(codes, 'code'),
      'and'
    );
  }, [codes]);
  const investigators = useInvestigatorCards();
  const cards = usePlayerCards();

  if (type === 'player') {
    if (!cards || !investigators) {
      return null;
    }
    const playerCards = flatMap(codes, code => cards[code] || investigators[code] || []);
    return (
      <>
        { children(playerCards, false, extraProps) }
      </>
    );
  }
  if (!codes.length) {
    return (
      <>
        { children([], false, extraProps) }
      </>
    );
  }
  return (
    <CardQueryWrapper name="card-list" query={query} extraProps={extraProps}>
      { children }
    </CardQueryWrapper>
  );
}
