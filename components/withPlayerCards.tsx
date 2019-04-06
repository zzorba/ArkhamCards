import { forEach } from 'lodash';
import { connectRealm, CardResults } from 'react-native-realm';
import hoistNonReactStatic from 'hoist-non-react-statics';

import Card, { CardsMap } from '../data/Card';

export interface PlayerCardProps {
  realm: Realm;
  cards: CardsMap;
  investigators: CardsMap;
}

export default function withPlayerCards<Props>(
  WrappedComponent: React.ComponentType<Props & PlayerCardProps>
): React.ComponentType<Props> {
  const result = connectRealm<Props, PlayerCardProps, Card>(
    WrappedComponent, {
    schemas: ['Card'],
    mapToProps(results: CardResults<Card>, realm: Realm): PlayerCardProps {
      const investigators: CardsMap = {};
      const cards: CardsMap = {};
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
