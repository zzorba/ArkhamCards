import React, { useContext, useMemo } from 'react';
import { filter, map } from 'lodash';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
} from 'victory-native';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import ChartLabel from './ChartLabel';
import ChartIconComponent from './ChartIconComponent';
import { ParsedDeck, SlotCounts } from '@actions/types';
import { SLOTS, SlotCodeType } from '@app_constants';
import StyleContext from '@styles/StyleContext';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item {
  slot: string;
  value: number;
}

function getSlotData(slot: SlotCodeType, slotCounts: SlotCounts): Item {
  return {
    slot: slot.replace(' ', '-'),
    value: slotCounts[slot] || 0,
  };
}
function getValue({ datum }: { datum: Item }) {
  return datum.value;
}

export default function SlotIconChart({ parsedDeck: { slotCounts }, width }: Props) {
  const { typography, colors } = useContext(StyleContext);
  const barData = useMemo(() => filter(
    map(SLOTS, slot => getSlotData(slot, slotCounts)),
    data => data.value > 0
  ), [slotCounts]);

  return (
    <View style={[styles.wrapper, { width }]}>
      <Text style={[typography.large, typography.center]}>
        { t`Slots` }
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
          x="slot"
          y="value"
          barRatio={1.6}
          labels={getValue}
          style={{
            data: {
              fill: '#444',
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
