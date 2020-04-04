import React from 'react';
import { map } from 'lodash';

import CardQueryWrapper from './CardQueryWrapper';
import Card from 'data/Card';

interface OwnProps<T> {
  cards: string[];
  render: (cards: Card[], extraArg: T) => React.ReactNode;
  extraArg: T;
}

type Props<T> = OwnProps<T>;

export default function CardListWrapper<T>({ cards, render, extraArg }: Props<T>) {
  const query = `(${map(cards, code => `(code == '${code}')`).join(' OR ')})`;
  return (
    <CardQueryWrapper
      query={query}
      render={render}
      extraArg={extraArg}
    />
  );
}
