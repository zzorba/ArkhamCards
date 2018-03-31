import React from 'react';
import { BarChart, XAxis, YAxis } from 'react-native-svg-charts';
import { View, Text } from 'react-native';

import { DeckType } from '../parseDeck';

export default class CostChart extends React.PureComponent {
  static propTypes = {
    parsedDeck: DeckType,
  };

  formatLabel(value, index) {
    return index;
  }

  render() {
    const {
      parsedDeck: {
        costHistogram,
      },
    } = this.props;
    const data = costHistogram.map(cost => {
      return {
        value: cost,
        svg: {
          fill: '#000000',
        },
      };
    })
    return (
      <View style={{ margin: 10 }}>
        <Text>Card Cost</Text>
        <Text>Cost X ignore</Text>
        <BarChart
          contentInset={{ top: 10, left: 10, right: 10, bottom: 10 }}
          style={{ height: 200 }}
          data={data}
          yAccessor={({ item }) => item.value}
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
          formatLabel={this.formatLabel}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}
