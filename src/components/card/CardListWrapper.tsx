import React from 'react';
import { flatMap } from 'lodash';
import { Brackets } from 'typeorm/browser';

import CardQueryWrapper from '@components/card/CardQueryWrapper';
import QueryProvider from '@components/data/QueryProvider';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import Card from '@data/Card';
import { combineQueriesOpt } from '@data/query';
import FilterBuilder from '@lib/filters';

interface Props<T> {
  codes: string[];
  type: 'player' | 'encounter';
  children: (cards: Card[], loading: boolean, extraProps?: T) => React.ReactNode | null;
  extraProps?: T;
}

type QueryProps<T> = Pick<Props<T>, 'codes'>

class CardListWrapper<T> extends React.Component<Props<T> & PlayerCardProps> {
  static FILTER_BUILDER = new FilterBuilder('clw');

  static query({ codes }: { codes: string[] }) {
    return combineQueriesOpt(
      CardListWrapper.FILTER_BUILDER.equalsVectorClause(codes, 'code'),
      'and'
    );
  }

  render() {
    const { cards, investigators, codes, children, type, extraProps } = this.props;
    if (type === 'player') {
      const playerCards = flatMap(codes, code => cards[code] || investigators[code] || []);
      return children(playerCards, false, extraProps);
    }
    if (!codes.length) {
      return children([], false, extraProps);
    }
    return (
      <QueryProvider<QueryProps<T>, Brackets | undefined>
        codes={codes}
        getQuery={CardListWrapper.query}
      >
        { query => (
          <CardQueryWrapper name="card-list" query={query} extraProps={extraProps}>
            { children }
          </CardQueryWrapper>
        ) }
      </QueryProvider>
    );
  }
}

export default withPlayerCards(CardListWrapper);
