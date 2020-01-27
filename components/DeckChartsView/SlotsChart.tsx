import React from 'react';
import { filter, map, maxBy } from 'lodash';
import { BarChart } from 'react-native-svg-charts';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import { ParsedDeck } from '../../actions/types';
import { SLOTS, SlotCodeType } from '../../constants';
import typography from '../../styles/typography';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item {
  slot: SlotCodeType;
  value: number;
}

interface LabelData {
  x: (idx: number) => number;
  y: (idx: number) => number;
  bandwidth: number;
  data: Item[];
}

export default class SlotsChart extends React.PureComponent<Props> {
  getSlotData(slot: SlotCodeType): Item {
    return {
      slot,
      value: this.props.parsedDeck.slotCounts[slot] || 0,
    };
  }

  _getValue = ({ item }: { item: Item }) => {
    return item.value;
  };

  render() {
    const barData = filter(
      map(SLOTS, slot => this.getSlotData(slot)),
      slot => slot.value > 0
    );
    const CUT_OFF = Math.min(
      4,
      (maxBy(map(barData, barData => barData.value)) || 0)
    );

    const contentInset = { top: 10, bottom: 10 };
    const TEXT_LENGTH = 100;

    const Labels = ({ x, y, bandwidth, data }: LabelData) => (
      data.map((value, index) => (
        <View key={index}>
          <View style={[styles.label, {
            left: x(index) - bandwidth / 3,
            top: y(0) + 8,
          }]}>
            <Text style={{
              height: bandwidth,
              width: TEXT_LENGTH,
              transform: [
                { rotate: '90deg' },
                { translateX: -(TEXT_LENGTH / 2 - bandwidth / 2) },
                { translateY: (TEXT_LENGTH / 2 - bandwidth / 2) },
              ],
            }}>{ value.slot }</Text>
          </View>
          { value.value > 0 && (
            <Text style={[
              styles.label, {
                left: x(index),
                top: value.value < CUT_OFF ? y(value.value) - 20 : y(value.value) + 8,
                width: bandwidth,
                color: value.value >= CUT_OFF ? 'white' : 'black',
              },
              styles.count,
            ]}>
              { value.value }
            </Text>
          ) }
        </View>
      ))
    );

    return (
      <View style={styles.wrapper}>
        <Text style={[typography.bigLabel, typography.center]}>
          { t`Slots` }
        </Text>
        <View style={styles.chart}>
          <BarChart
            style={styles.barChart}
            gridMin={0}
            numberOfTicks={4}
            contentInset={contentInset}
            yAccessor={this._getValue}
            data={barData}
          >
            {
              // @ts-ignore TS2739
              <Labels />
            }
          </BarChart>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    position: 'relative',
    marginBottom: 128,
  },
  chart: {
    flexDirection: 'row',
    height: 200,
  },
  label: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  barChart: {
    flex: 1,
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
