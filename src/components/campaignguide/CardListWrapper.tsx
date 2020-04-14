import React from 'react';
import { map } from 'lodash';

import CardQueryWrapper from './CardQueryWrapper';
import Card from 'data/Card';

interface OwnProps<T> {
  cards: string[];
  render: (cards: Card[], extraArg: T) => Element | null;
  extraArg: T;
}

type Props<T> = OwnProps<T>;

export default class CardListWrapper<T> extends React.Component<Props<T>> {
  render() {
    const { cards, render, extraArg } = this.props;
    if (!cards.length) {
      return render([], extraArg);
    }
    const query = `(${map(cards, code => `(code == '${code}')`).join(' OR ')})`;
    return (
      <CardQueryWrapper
        query={query}
        render={render}
        extraArg={extraArg}
      />
    );
  }
}
