import React from 'react';
import { filter, map, maxBy } from 'lodash';
import { BarChart } from 'react-native-svg-charts';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import { ParsedDeck } from '../parseDeck';
import typography from '../../styles/typography';

interface Props {
  parsedDeck: ParsedDeck;
}

interface Item {
  cost: string;
  alwaysShow: boolean;
  value: number;
  svg: {
    fill: string;
  };
}

interface LabelData {
  x: (idx: number) => number;
  y: (idx: number) => number;
  bandwidth: number;
  data: Item[];
}

export default class CostChart extends React.PureComponent<Props> {
  getCostData(index: number): Item {
    const cost = index - 2;
    return {
      cost: cost === -2 ? 'X' : `${cost}`,
      alwaysShow: cost >= 0 && cost < 5,
      value: this.props.parsedDeck.costHistogram[index] || 0,
      svg: {
        fill: '#444444',
      },
    };
  }

  _getValue = ({ item }: { item: Item }) => {
    return item.value;
  };

  render() {
    const {
      parsedDeck: {
        costHistogram,
      },
    } = this.props;
    const barData = filter(
      map(costHistogram, (_, idx) => this.getCostData(idx)),
      item => item.alwaysShow || item.value > 0
    );
    const CUT_OFF = Math.min(
      4,
      (maxBy(map(barData, barData => barData.value)) || 0)
    );

    const contentInset = { top: 10, bottom: 10 };
    const Labels = ({ x, y, bandwidth, data }: LabelData) => (
      data.map((value, index) => (
        <View key={index}>
          <Text
            style={[styles.label, {
              left: x(index),
              top: y(0) + 4,
              width: bandwidth,
            },
            styles.count, typography.label, typography.center]}
          >
            { value.cost }
          </Text>
          { value.value > 0 && (
            <Text
              style={[styles.label, {
                left: x(index),
                top: value.value < CUT_OFF ? y(value.value) - 20 : y(value.value) + 8,
                width: bandwidth,
              }, styles.count, typography.label, typography.center, {
                color: value.value >= CUT_OFF ? 'white' : '#444',
              }]}
            >
              { value.value }
            </Text>
          ) }
        </View>
      ))
    );

    return (
      <View style={styles.wrapper}>
        <Text style={[typography.bigLabel, typography.center]}>
          { t`Card Costs` }
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
    marginBottom: 64,
  },
  chart: {
    flexDirection: 'row',
    height: 200,
  },
  label: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barChart: {
    flex: 1,
  },
  count: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
