import React, { useMemo } from 'react';
import { flatMap, map } from 'lodash';
import { t } from 'ttag';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from '@data/types/Card';
import CardDetailSectionHeader from './CardDetailSectionHeader';
import FilterBuilder from '@lib/filters';
import { useTabooSetId } from '@components/core/hooks';
import useCardsFromQuery from '../useCardsFromQuery';
import { SortType, DEFAULT_SORT } from '@actions/types';

interface Props {
  componentId?: string;
  cards: Card[];
  width: number;
  tabooSetId?: number;
}

export function useBondedToCards(cards: Card[], tabooSetOverride?: number): [Card[], boolean] {
  const bondedToQuery = useMemo(() => {
    const eligibleCards = flatMap(cards, card => card.bonded_name ? [card] : [])
    if (!eligibleCards.length) {
      return undefined;
    }
    const filterBuilder = new FilterBuilder('bonded_to');
    const query = filterBuilder.bondedFilter(
      'real_name',
      flatMap(eligibleCards, card => card.bonded_name ? [card.bonded_name] : [])
    );
    return query;
  }, [cards]);
  return useCardsFromQuery({ query: bondedToQuery, tabooSetOverride });
}

export function useBondedFromCards(cards: Card[], sorts?: SortType[], tabooSetOverride?: number): [Card[], boolean] {
  const bondedFromQuery = useMemo(() => {
    const eligibleCards = flatMap(cards, card => card.bonded_name ? [] : [card])
    if (!eligibleCards.length) {
      return undefined;
    }
    const filterBuilder = new FilterBuilder('bonded_from');
    const query = filterBuilder.bondedFilter('bonded_name', map(eligibleCards, card => card.real_name));
    return query;
  }, [cards]);
  const sortQuery = useMemo(() => sorts ? Card.querySort(true, sorts) : undefined, [sorts]);
  return useCardsFromQuery({ query: bondedFromQuery, tabooSetOverride, sort: sortQuery });
}

export default function BondedCardsComponent({ componentId, cards, width, tabooSetId: tabooSetOverride }: Props) {
  const tabooSetId = useTabooSetId(tabooSetOverride);
  const [bondedToCards, bondedToCardsLoading] = useBondedToCards(cards, tabooSetId);
  const [bondedFromCards, bondedFromCardsLoading] = useBondedFromCards(cards, DEFAULT_SORT, tabooSetId);

  if (bondedToCardsLoading && bondedFromCardsLoading) {
    return null;
  }
  return (
    <>
      { (bondedToCards.length > 0) && (
        <>
          <CardDetailSectionHeader title={t`Bonded`} />
          { map(bondedToCards, card => (
            <TwoSidedCardComponent
              componentId={componentId}
              key={card.code}
              card={card}
              width={width}
            />
          )) }
        </>
      ) }
      { (bondedFromCards.length > 0) && (
        <>
          <CardDetailSectionHeader title={t`Bound Cards`} />
          { map(bondedFromCards, card => (
            <TwoSidedCardComponent
              key={card.code}
              componentId={componentId}
              card={card}
              width={width}
            />
          )) }
        </>
      ) }
    </>
  );
}
