import { forEach } from 'lodash';
import { connectRealm } from 'react-native-realm';
import hoistNonReactStatic from 'hoist-non-react-statics';

export default function withPlayerCards(WrappedComponent) {
  const result = connectRealm(WrappedComponent, {
    schemas: ['Card'],
    mapToProps(results, realm) {
      const investigators = {};
      const cards = {};
      forEach(
        results.cards.filtered('(type_code == "investigator" AND encounter_code == null) OR deck_limit > 0'),
        card => {
          cards[card.code] = card;
          if (card.type_code === 'investigator') {
            investigators[card.code] = card;
          }
        });
      return {
        realm,
        cards,
        investigators,
      };
    },
  });
  hoistNonReactStatic(result, WrappedComponent);
  return result;
}
