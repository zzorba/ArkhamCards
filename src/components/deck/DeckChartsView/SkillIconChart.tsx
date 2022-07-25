import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
} from 'victory-native';
import { CallbackArgs } from 'victory-core';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import ChartLabel from './ChartLabel';
import ChartIconComponent from './ChartIconComponent';
import { ParsedDeck } from '@actions/types';
import { SKILLS, SkillCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item {
  skill: SkillCodeType;
  value: string | number;
}

function getLabel({ datum }: { datum: Item }) {
  return `${datum.value}`;
}

export default function SkillIconChart({ width, parsedDeck }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const barData = useMemo(() => {
    return map(SKILLS, skill => {
      return {
        skill,
        value: parsedDeck.skillIconCounts[skill] || 0,
      };
    });
  }, [parsedDeck.skillIconCounts]);
  const skillColor = useCallback(({ datum }: CallbackArgs): string => {
    switch (datum.skill) {
      case 'willpower':
      case 'intellect':
      case 'combat':
      case 'agility':
      case 'wild':
        return colors.skill[datum.skill as SkillCodeType].icon;
      default:
        return '#000000';
    }
  }, [colors]);

  return (
    <View style={[styles.wrapper, { width }]}>
      <Text style={[typography.large, typography.center]}>
        { t`Skill Icons` }
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
          // @ts-ignore TS2739
          tickLabelComponent={<ChartIconComponent />}
        />
        <VictoryBar
          data={barData}
          x="skill"
          y="value"
          barRatio={1.6}
          labels={getLabel}
          style={{
            data: {
              // @ts-ignore
              fill: skillColor,
            },
            labels: {
              fill: 'white',
              fontSize: 14,
              fontFamily: typography.bold.fontFamily,
              fontWeight: '700',
            },
          }}
          // @ts-ignore TS2769
          labelComponent={<ChartLabel field="value" />}
        />
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
