import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';

import TabooSet from '@data/TabooSet';
import DatabaseContext, { PlayerCards, DatabaseContextType } from '@data/DatabaseContext';
import { AppState, getTabooSet } from '@reducers';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

export interface PlayerCardProps extends PlayerCards {
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
  PlaceholderComponent?: React.ComponentType<Props>
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
      if (!playerCards) {
        if (PlaceholderComponent) {
          return <PlaceholderComponent {...this.props} />
        }
        return (
          <StyleContext.Consumer>
            { ({ colors }) => (
              <View style={[styles.activityIndicatorContainer,  { backgroundColor: colors.background }]}>
                <ActivityIndicator
                  style={styles.spinner}
                  color={colors.lightText}
                  size="small"
                  animating
                />
              </View>
            ) }
          </StyleContext.Consumer>
        );
      }
      return (
        <WrappedComponent
          {...this.props}
          investigators={playerCards ? playerCards.investigators : {}}
          cards={playerCards ? playerCards.cards : {}}
          tabooSets={tabooSets}
          weaknessCards={playerCards ? playerCards.weaknessCards : []}
        />
      );
    }
  }
  const result = connect<ReduxProps, unknown, Props & TabooSetOverride, AppState>(mapStateToProps)(
    // @ts-ignore TS2345
    WrappingComponent
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & TabooSetOverride>;
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  spinner: {
    height: 80,
  },
});
