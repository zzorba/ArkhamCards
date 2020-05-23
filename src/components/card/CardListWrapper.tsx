import React from 'react';
import { map } from 'lodash';

import CardQueryWrapper from 'components/card/CardQueryWrapper';
import Card from 'data/Card';
import { equalsVectorClause } from 'lib/filters';

interface OwnProps<T> {
  cards: string[];
  extraArg: T;
  children: (cards: Card[], extraArg: T) => React.ReactNode;
}

type Props<T> = OwnProps<T>;

export default class CardListWrapper<T> extends React.Component<Props<T>> {
  render() {
    const { cards, children, extraArg } = this.props;
    if (!cards.length) {
      return children([], extraArg);
    }
    return (
      <CardQueryWrapper
        query={equalsVectorClause(cards, 'code')}
        extraArg={extraArg}
      >
        { children }
        </CardQueryWrapper>
    );
  }
}
