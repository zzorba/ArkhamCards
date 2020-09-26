import React from 'react';
import { filter, map } from 'lodash';
import { View, Text, StyleSheet } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
} from 'victory-native';
import { t } from 'ttag';

import ChartLabel from './ChartLabel';
import { ParsedDeck } from '@actions/types';
import space from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item {
  cost: string;
  alwaysShow: boolean;
  value: number;
}
export default class CostChart extends React.PureComponent<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  specialCost(index: number) {
    if (index === -2) {
      return 'X';
    }
    if (index === -1) {
      return '-';
    }
    return `${index}`;
  }
  getCostData(index: number): Item {
    const cost = index - 2;
    return {
      cost: this.specialCost(cost),
      alwaysShow: cost >= 0 && cost < 5,
      value: this.props.parsedDeck.costHistogram[index] || 0,
    };
  }

  _getValue = ({ datum }: { datum: Item }) => {
    return datum.value;
  };

  render() {
    const {
      parsedDeck: {
        costHistogram,
      },
      width,
    } = this.props;
    const { typography, colors } = this.context;
    const barData = filter(
      map(costHistogram, (_, idx) => this.getCostData(idx)),
      item => item.alwaysShow || item.value > 0
    );
    return (
      <View style={[styles.wrapper, space.marginBottomL, { width }]}>
        <Text style={[typography.large, typography.center]}>
          { t`Card Costs` }
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
          />
          <VictoryBar
            data={barData}
            x="cost"
            y="value"
            barRatio={1.5}
            // @ts-ignore TS2769
            labels={this._getValue}
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
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    position: 'relative',
  },
});
