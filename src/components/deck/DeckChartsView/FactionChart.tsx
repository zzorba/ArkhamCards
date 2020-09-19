import React from 'react';
import { filter } from 'lodash';
import { View, Text, StyleSheet } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
} from 'victory-native';
import { t } from 'ttag';

import ChartLabel from './ChartLabel';
import ChartIconComponent from './ChartIconComponent';
import { ParsedDeck } from '@actions/types';
import { PLAYER_FACTION_CODES, FactionCodeType } from '@app_constants';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item {
  faction: FactionCodeType;
  guardian: number;
  seeker: number;
  rogue: number;
  mystic: number;
  survivor: number;
  neutral: number;
  mythos: number;

  dual: number;
  count: number;
  total: number;
}

const DEFAULT_ITEM = {
  guardian: 0,
  seeker: 0,
  rogue: 0,
  mystic: 0,
  survivor: 0,
  neutral: 0,
  mythos: 0,
};

export default class FactionChart extends React.PureComponent<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  getFactionData(faction: FactionCodeType): Item {
    const counts = this.props.parsedDeck.factionCounts[faction] || [0, 0];
    return {
      ...DEFAULT_ITEM,
      faction,
      dual: counts[0],
      [faction]: counts[1],
      count: counts[1] || 0,
      total: counts[0] + counts[1],
    };
  }

  _getDualValue = ({ datum }: { datum: Item}) => {
    return datum.dual;
  };

  _getTotalValue = ({ datum }: { datum: Item}) => {
    return datum.total;
  };

  render() {
    const { width } = this.props;
    const { colors, typography } = this.context;
    const barData = filter(
      PLAYER_FACTION_CODES.map(code => this.getFactionData(code)),
      data => data.count > 0 || data.dual > 0
    );
    if (barData.length === 0) {
      return null;
    }
    return (
      <View style={styles.wrapper}>
        <Text style={[typography.large, typography.center]}>
          { t`Card Factions` }
        </Text>
        <VictoryChart width={width}>
          <VictoryAxis
            style={{
              axis: { stroke: 'none' },
              tickLabels: {
                fontSize: 18,
                fontFamily: typography.large.fontFamily,
                fontWeight: '400',
                fill: colors.darkText,
              },
            }}
            tickLabelComponent={
              // @ts-ignore TS2739
              <ChartIconComponent />
            }
          />
          <VictoryStack width={width}>
            <VictoryBar
              data={barData}
              x="faction"
              y="dual"
              barRatio={1.6}
              // @ts-ignore TS2769
              labels={this._getDualValue}
              style={{
                data: {
                  fill: colors.faction.dual.background,
                },
                labels: {
                  fill: 'white',
                  fontSize: 14,
                  fontFamily: typography.bold.fontFamily,
                  fontWeight: '700',
                },
              }}
              // @ts-ignore TS2769
              labelComponent={<ChartLabel field="dual" />}
            />
            <VictoryBar
              data={barData}
              x="faction"
              y="count"
              barRatio={1.6}
              // @ts-ignore TS2769
              labels={this._getTotalValue}
              style={{
                data: {
                  fill: ({ datum }: { datum: Item }) => colors.faction[datum.faction].background,
                },
                labels: {
                  fill: 'white',
                  fontSize: 14,
                  fontFamily: typography.bold.fontFamily,
                  fontWeight: '700',
                },
              }}
              // @ts-ignore TS2769
              labelComponent={<ChartLabel field="count" />}
            />
          </VictoryStack>
        </VictoryChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    position: 'relative',
    marginBottom: 64,
  },
});
