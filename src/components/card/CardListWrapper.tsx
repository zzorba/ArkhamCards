import React from 'react';
import { flatMap } from 'lodash';

import CardQueryWrapper from 'components/card/CardQueryWrapper';
import QueryProvider from 'components/data/QueryProvider';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import Card from 'data/Card';
import { combineQueriesOpt } from 'data/query';
import FilterBuilder from 'lib/filters';

interface Props {
  codes: string[];
  type: 'player' | 'encounter';
  children: (cards: Card[]) => React.ReactNode | null;
}

class CardListWrapper extends React.Component<Props & PlayerCardProps> {
  static FILTER_BUILDER = new FilterBuilder('clw');

  static query({ codes }: { codes: string[] }) {
    return combineQueriesOpt(
      CardListWrapper.FILTER_BUILDER.equalsVectorClause(codes, 'code'),
      'and'
    );
  }

  render() {
    const { cards, investigators, codes, children, type } = this.props;
    if (type === 'player') {
      const playerCards = flatMap(codes, code => cards[code] || investigators[code] || []);
      return children(playerCards);
    }
    if (!codes.length) {
      return children([]);
    }
    return (
      <QueryProvider codes={codes} getQuery={CardListWrapper.query}>
        { query => (
          <CardQueryWrapper name="card-list" query={query}>
            { children }
          </CardQueryWrapper>
        ) }
      </QueryProvider>
    );
  }
}

export default withPlayerCards(CardListWrapper);
