import React, { useCallback, useContext, useMemo } from 'react';
import { filter } from 'lodash';
import { View, Text, StyleSheet } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
} from 'victory-native';
import { CallbackArgs } from 'victory-core';
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

function getDualValue({ datum }: { datum: Item}) {
  return datum.dual;
}
function getTotalValue({ datum }: { datum: Item}) {
  return datum.total;
}

export default function FactionChart({ parsedDeck, width }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const barData = useMemo(() => filter(
    PLAYER_FACTION_CODES.map(faction => {
      const counts = parsedDeck.factionCounts[faction] || [0, 0];
      return {
        ...DEFAULT_ITEM,
        faction,
        dual: counts[0],
        [faction]: counts[1],
        count: counts[1] || 0,
        total: counts[0] + counts[1],
      };
    }),
    data => data.count > 0 || data.dual > 0
  ), [parsedDeck.factionCounts]);
  const colorFill = useCallback(({ datum }: CallbackArgs) => colors.faction[datum.faction as FactionCodeType].background, [colors.faction]);

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
                fill: colorFill,
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

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    position: 'relative',
    marginBottom: 64,
  },
});
