import { forEach } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';
import hoistNonReactStatic from 'hoist-non-react-statics';

import Card, { CardsMap } from '../../data/Card';
import { BASIC_WEAKNESS_QUERY } from '../../data/query';

export interface WeaknessCardProps {
  cards: Card[];
  cardsMap: CardsMap
}

export default function withWeaknessCards<Props>(
  WrappedComponent: React.ComponentType<Props & WeaknessCardProps>
): React.ComponentType<Props> {
  const result = connectRealm<Props, WeaknessCardProps, Card>(
    WrappedComponent, {
    schemas: ['Card'],
    mapToProps(results: CardResults<Card>): WeaknessCardProps {
      const cards = results.cards
        .filtered(BASIC_WEAKNESS_QUERY)
        .sorted([['name', false]]);
      const cardsMap: CardsMap = {};
      forEach(cards, card => {
        cardsMap[card.code] = card;
      });
      return {
        cards,
        cardsMap,
      };
    },
  });
  hoistNonReactStatic(result, WrappedComponent);
  return result;
}
