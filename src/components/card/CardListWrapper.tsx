import React from 'react';

import CardQueryWrapper from 'components/card/CardQueryWrapper';
import Card from 'data/Card';
import { combineQueriesOpt } from 'data/query';
import FilterBuilder from 'lib/filters';

interface OwnProps<T> {
  cards: string[];
  extraArg: T;
  children: (cards: Card[], extraArg: T) => React.ReactNode;
}

type Props<T> = OwnProps<T>;

export default class CardListWrapper<T> extends React.Component<Props<T>> {
  filterBuilder = new FilterBuilder('clw');

  render() {
    const { cards, children, extraArg } = this.props;
    if (!cards.length) {
      return children([], extraArg);
    }
    return (
      <CardQueryWrapper
        query={combineQueriesOpt(this.filterBuilder.equalsVectorClause(cards, 'code'), 'and')}
        extraArg={extraArg}
      >
        { children }
        </CardQueryWrapper>
    );
  }
}
