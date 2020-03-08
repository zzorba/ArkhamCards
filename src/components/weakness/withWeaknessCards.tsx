import { forEach } from 'lodash';
import { Results } from 'realm';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';
import hoistNonReactStatic from 'hoist-non-react-statics';

import Card, { CardsMap } from 'data/Card';
import { BASIC_WEAKNESS_QUERY } from 'data/query';
import { AppState, getTabooSet } from 'reducers';

export interface WeaknessCardProps {
  cards: Results<Card>;
  cardsMap: CardsMap;
}

export default function withWeaknessCards<Props>(
  WrappedComponent: React.ComponentType<Props & WeaknessCardProps>
): React.ComponentType<Props> {
  interface ReduxProps {
    tabooSetId?: number;
  }
  const mapStateToProps = (state: AppState): ReduxProps => {
    return {
      tabooSetId: getTabooSet(state),
    };
  };
  const result = connect<ReduxProps, {}, Props, AppState>(mapStateToProps)(
    // @ts-ignore TS2345
    connectRealm<Props & ReduxProps, WeaknessCardProps, Card>(
      WrappedComponent, {
        schemas: ['Card'],
        mapToProps(
          results: CardResults<Card>,
          realm: Realm,
          props: Props & ReduxProps
        ): WeaknessCardProps {
          const cards = results.cards
            .filtered(`${BASIC_WEAKNESS_QUERY} and ${Card.tabooSetQuery(props.tabooSetId)}`)
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
      })
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props>;
}
