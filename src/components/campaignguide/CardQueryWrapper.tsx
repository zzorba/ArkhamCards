import React from 'react';
import { forEach } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';

import Card from 'data/Card';

interface OwnProps<T> {
  query: string;
  render: (cards: Card[], extraArg: T) => Element | null;
  extraArg: T;
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
      if (!props.query) {
        return {
          cards: [],
        };
      }
      const cards = results.cards.filtered(
        `((${props.query}) AND (taboo_set_id == 0 or taboo_set_id == null))`,
      ).sorted([['renderName', false], ['xp', false]]);
      const result: Card[] = [];
      forEach(cards, card => result.push(card));
      return {
        cards: result,
      };
    },
  }
);
