import React from 'react';
import { flatMap } from 'lodash';

import CardQueryWrapper from 'components/card/CardQueryWrapper';
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
  filterBuilder = new FilterBuilder('clw');

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
      <CardQueryWrapper
        query={combineQueriesOpt(this.filterBuilder.equalsVectorClause(codes, 'code'), 'and')}
      >
        { children }
      </CardQueryWrapper>
    );
  }
}

export default withPlayerCards(CardListWrapper);
