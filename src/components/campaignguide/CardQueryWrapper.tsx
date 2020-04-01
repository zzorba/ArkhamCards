import React from 'react';
import { Text } from 'react-native';
import { forEach } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';

import Card from 'data/Card';

interface OwnProps<T> {
  query: string;
  render: (cards: Card[], extraArg: T) => React.ReactNode;
  extraArg: T
}

interface RealmProps {
  cards: Card[];
}

type Props<T> = OwnProps<T> & RealmProps;

class CardQueryWrapper<T> extends React.Component<Props<T>> {
  render() {
    const { cards, extraArg } = this.props;
    return this.props.render(cards, extraArg);
  }
}

export default connectRealm<OwnProps<any>, RealmProps, Card>(
  CardQueryWrapper,
  {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps<any>
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
