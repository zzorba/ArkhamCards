import { forEach } from 'lodash';
import { connect } from 'react-redux';
import { Results } from 'realm';
import { connectRealm, CardAndTabooSetResults } from 'react-native-realm';
import hoistNonReactStatic from 'hoist-non-react-statics';

import Card, { CardsMap } from '../data/Card';
import FaqEntry from '../data/FaqEntry';
import TabooSet from '../data/TabooSet';
import { AppState, getTabooSet } from '../reducers';

export interface PlayerCardProps {
  realm: Realm;
  cards: CardsMap;
  investigators: CardsMap;
  tabooSetId?: number;
  tabooSets: Results<TabooSet>;
}

export interface TabooSetOverride {
  tabooSetOverride?: number;
}

export default function withPlayerCards<Props>(
  WrappedComponent: React.ComponentType<Props & PlayerCardProps>
): React.ComponentType<Props & TabooSetOverride> {
  interface ReduxProps {
    tabooSetId?: number;
  }
  const mapStateToProps = (
    state: AppState,
    props: Props & TabooSetOverride
  ): ReduxProps => {
    return {
      tabooSetId: getTabooSet(state, props.tabooSetOverride),
    };
  };
  const result = connect<ReduxProps, {}, Props & TabooSetOverride, AppState>(mapStateToProps)(
    connectRealm<Props & ReduxProps, PlayerCardProps, Card, FaqEntry, TabooSet>(
      WrappedComponent, {
        schemas: ['Card', 'TabooSet'],
        mapToProps(
          results: CardAndTabooSetResults<Card, TabooSet>,
          realm: Realm,
          props: Props & ReduxProps
        ): PlayerCardProps {
          const investigators: CardsMap = {};
          const cards: CardsMap = {};
          forEach(
            results.cards.filtered(
              `((type_code == "investigator" AND encounter_code == null) OR deck_limit > 0) and ${Card.tabooSetQuery(props.tabooSetId)}`),
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
            tabooSetId: props.tabooSetId,
            tabooSets: results.tabooSets,
          };
        },
      })
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & TabooSetOverride>;
}
