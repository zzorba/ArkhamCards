import { forEach } from 'lodash';
import { connectRealm } from 'react-native-realm';
import hoistNonReactStatic from 'hoist-non-react-statics';

import { BASIC_WEAKNESS_QUERY } from '../../data/query';

export default function withWeaknessCards(WrappedComponent) {
  const result = connectRealm(WrappedComponent, {
    schemas: ['Card'],
    mapToProps(results) {
      const cards = results.cards.filtered(BASIC_WEAKNESS_QUERY).sorted([['name', false]]);
      const cardsMap = {};
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
