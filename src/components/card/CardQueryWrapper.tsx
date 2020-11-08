import React from 'react';
import { Brackets } from 'typeorm/browser';

import Card from '@data/Card';
import { QuerySort } from '@data/types';
import useCardsFromQuery from './useCardsFromQuery';

interface Props<T> {
  name: string;
  query?: Brackets;
  sort?: QuerySort[];
  children: (cards: Card[], loading: boolean, extraProps?: T) => React.ReactNode;
  extraProps?: T;
}

export default function CardQueryWrapper<T=undefined>({ query, sort, children, extraProps }: Props<T>) {
  const [cards, loading] = useCardsFromQuery({ query, sort });
  return children(cards, loading, extraProps);
}
