import React from 'react';
import { BarChart, XAxis, YAxis } from 'react-native-svg-charts';
import { View, Text } from 'react-native';

import { ParsedDeck } from '../parseDeck';

interface Props {
  parsedDeck: ParsedDeck;
}

interface Item {
  value: number;
  svg: {
    fill: string;
  };
}

export default class CostChart extends React.PureComponent<Props> {
  _getValue = ({ item }: { item: Item }) => {
    return item.value;
  };

  _formatLabel = (value: number, index: number) => {
    return index;
  };

  render() {
    const {
      parsedDeck: {
        costHistogram,
      },
    } = this.props;
    const data: Item[] = costHistogram.map(cost => {
      return {
        value: cost,
        svg: {
          fill: '#000000',
        },
      };
    });
    return (
      <View style={{ margin: 10 }}>
        <Text>Card Cost</Text>
        <Text>Cost X ignore</Text>
        <BarChart
          contentInset={{ top: 10, left: 10, right: 10, bottom: 10 }}
          style={{ height: 200 }}
          data={data}
          yAccessor={this._getValue}
          numberOfTicks={5}
          gridMin={0}
        />
        <YAxis
          style={{ position: 'absolute', top: 0, bottom: 0 }}
          data={costHistogram}
          contentInset={{ top: 10, bottom: 10 }}
          svg={{
            fontSize: 8,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 0.1,
            alignmentBaseline: 'baseline',
            baselineShift: '3',
          }}
        />
        <XAxis
          style={{ marginHorizontal: -10 }}
          data={costHistogram}
          formatLabel={this._formatLabel}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}
