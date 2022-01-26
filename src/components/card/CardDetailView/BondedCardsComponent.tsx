import React, { useMemo } from 'react';
import { find, flatMap, map } from 'lodash';
import { t } from 'ttag';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from '@data/types/Card';
import CardDetailSectionHeader from './CardDetailSectionHeader';
import FilterBuilder from '@lib/filters';
import { useTabooSetId } from '@components/core/hooks';
import useCardsFromQuery from '../useCardsFromQuery';

interface Props {
  componentId?: string;
  cards: Card[];
  width: number;
}

export function useBondedToCards(cards: Card[], tabooSetOverride?: number): [Card[], boolean] {
  const bondedToQuery = useMemo(() => {
    if (!find(cards, card => !!card.bonded_name)) {
      return undefined;
    }
    const filterBuilder = new FilterBuilder('bonded_to');
    const query = filterBuilder.bondedFilter(
      'real_name',
      flatMap(cards, card => card.bonded_name ? [card.bonded_name] : [])
    );
    return query;
  }, [cards]);
  return useCardsFromQuery({ query: bondedToQuery, tabooSetOverride });
}

export function useBondedFromCards(cards: Card[], tabooSetOverride?: number): [Card[], boolean] {
  const bondedFromQuery = useMemo(() => {
    if (!find(cards, card => !!card.bonded_from)) {
      return undefined;
    }
    const filterBuilder = new FilterBuilder('bonded_from');
    const query = filterBuilder.bondedFilter('bonded_name', map(cards, card => card.real_name));
    return query;
  }, [cards]);
  return useCardsFromQuery({ query: bondedFromQuery, tabooSetOverride });
}

export default function BondedCardsComponent({ componentId, cards, width }: Props) {
  const tabooSetId = useTabooSetId();
  const [bondedToCards, bondedToCardsLoading] = useBondedToCards(cards, tabooSetId);
  const [bondedFromCards, bondedFromCardsLoading] = useBondedFromCards(cards, tabooSetId);

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
