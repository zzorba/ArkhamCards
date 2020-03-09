import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { connectRealm, CardResults } from 'react-native-realm';

import Card from 'data/Card';

interface OwnProps {
  code: string;
  render: (card: Card) => React.ReactNode;
}

interface RealmProps {
  card?: Card;
}

type Props = OwnProps & RealmProps;

class CardWrapper extends React.Component<Props> {
  render() {
    const { render, card, code} = this.props;
    if (!card) {
      return <Text>Unknown {code}</Text>;
    }
    return render(card);
  }
}

export default connectRealm<OwnProps, RealmProps, Card>(
  CardWrapper,
  {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps
    ) {
      const { code } = props;
      const cards = results.cards.filtered(`(code == "${code}")`);
      if (cards.length) {
        return {
          card: cards[0],
        };
      }
      return {};
    },
  }
)

const styles = StyleSheet.create({
  iconPile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  icon: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
})
