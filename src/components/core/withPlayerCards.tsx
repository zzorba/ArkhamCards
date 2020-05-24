import React from 'react';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import TabooSet from 'data/TabooSet';
import DatabaseContext, { PlayerCards, DatabaseContextType } from 'data/DatabaseContext';
import { AppState, getTabooSet } from 'reducers';

export interface PlayerCardProps extends PlayerCards {
  playerCards?: PlayerCards;
  tabooSetId?: number;
  tabooSets: TabooSet[];
}

export interface TabooSetOverride {
  tabooSetOverride?: number;
}

interface ReduxProps {
  tabooSetId?: number;
}

export default function withPlayerCards<Props>(
  WrappedComponent: React.ComponentType<Props & PlayerCardProps>,
): React.ComponentType<Props & TabooSetOverride> {
  const mapStateToProps = (
    state: AppState,
    props: Props & TabooSetOverride
  ): ReduxProps => {
    return {
      tabooSetId: getTabooSet(state, props.tabooSetOverride),
    };
  };
  class WrappingComponent extends React.Component<Props & ReduxProps> {
    static contextType = DatabaseContext;
    context!: DatabaseContextType;

    render() {
      const {
        tabooSetId,
      } = this.props;
      const {
        playerCardsByTaboo,
        tabooSets,
      } = this.context;
      const playerCards = playerCardsByTaboo && playerCardsByTaboo[`${tabooSetId || 0}`];
      return (
        <WrappedComponent
          {...this.props}
          investigators={playerCards ? playerCards.investigators : {}}
          cards={playerCards ? playerCards.cards : {}}
          tabooSets={tabooSets}
        />
      );
    };
  }
  const result = connect<ReduxProps, {}, Props & TabooSetOverride, AppState>(mapStateToProps)(
    // @ts-ignore TS2345
    WrappingComponent
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & TabooSetOverride>;
}
