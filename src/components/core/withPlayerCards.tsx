import React from 'react';
import { forEach } from 'lodash';
import { connect } from 'react-redux';
import { Results } from 'realm';
import { connectRealm, CardAndTabooSetResults } from 'react-native-realm';
import hoistNonReactStatic from 'hoist-non-react-statics';

import Card, { CardsMap } from 'data/Card';
import { PLAYER_CARDS_QUERY } from 'data/query';
import TabooSet from 'data/TabooSet';
import { AppState, getTabooSet } from 'reducers';

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

interface ReduxProps {
  tabooSetId?: number;
}
const NULL_EXTRA_PROPS = {};

export default function withPlayerCards<Props, ExtraProps={}>(
  WrappedComponent: React.ComponentType<Props & PlayerCardProps & ExtraProps>,
  computeExtraProps?: (cards: Results<Card>, props: Props) => ExtraProps
): React.ComponentType<Props & TabooSetOverride> {
  const mapStateToProps = (
    state: AppState,
    props: Props & TabooSetOverride
  ): ReduxProps => {
    return {
      tabooSetId: getTabooSet(state, props.tabooSetOverride),
    };
  };
  const WrappingComponent = function(props: Props & PlayerCardProps & ExtraProps) {
    return <WrappedComponent {...props} />;
  };
  const result = connect<ReduxProps, {}, Props & TabooSetOverride, AppState>(mapStateToProps)(
    // @ts-ignore TS2345
    connectRealm<Props & ReduxProps, PlayerCardProps & ExtraProps, Card, TabooSet>(
      WrappingComponent, {
        schemas: ['Card', 'TabooSet'],
        mapToProps(
          results: CardAndTabooSetResults<Card, TabooSet>,
          realm: Realm,
          props: Props & ReduxProps
        ): PlayerCardProps & ExtraProps {
          const playerCards = results.cards.filtered(
            `((type_code == "investigator" AND encounter_code == null) OR ${PLAYER_CARDS_QUERY} OR bonded_name != null) and ${Card.tabooSetQuery(props.tabooSetId)}`
          );
          const investigators: CardsMap = {};
          const cards: CardsMap = {};
          forEach(
            playerCards,
            card => {
              cards[card.code] = card;
              if (card.type_code === 'investigator' && card.encounter_code === null) {
                investigators[card.code] = card;
              }
            });
          const playerCardProps: PlayerCardProps = {
            realm,
            cards,
            investigators,
            tabooSetId: props.tabooSetId,
            tabooSets: results.tabooSets,
          };
          const extraProps: ExtraProps = computeExtraProps ?
            computeExtraProps(playerCards, props) :
            (NULL_EXTRA_PROPS as ExtraProps);
          return {
            ...extraProps,
            ...playerCardProps,
          };
        },
      })
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & TabooSetOverride>;
}
