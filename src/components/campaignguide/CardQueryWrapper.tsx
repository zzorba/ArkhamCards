import React from 'react';
import { forEach } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';

import Card from 'data/Card';

interface OwnProps {
  query: string;
  render: (cards: Card[]) => React.ReactNode;
}

interface RealmProps {
  cards: Card[];
}

type Props = OwnProps & RealmProps;

class CardQueryWrapper extends React.Component<Props> {
  render() {
    const { render, cards } = this.props;
    return render(cards);
  }
}

export default connectRealm<OwnProps, RealmProps, Card>(
  CardQueryWrapper,
  {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps
    ) {
      const cards = results.cards.filtered(props.query);
      const result: Card[] = [];
      forEach(cards, card => result.push(card));
      return {
        cards: result,
      };
    },
  }
);
