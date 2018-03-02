import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts'
const { View, Text } = require('react-native');

import { DeckType } from '../parseDeck';

export default class CostChart extends React.PureComponent {
  static propTypes = {
    parsedDeck: DeckType,
  };

  render() {
    const {
      parsedDeck: {
        costHistogram,
      },
    } = this.props;
    return (
      <View style={{ margin: 10 }}>
        <Text>Card Cost</Text>
        <Text>Cost X ignore</Text>
        <LineChart
          contentInset={{ top: 10, left: 10, right: 10, bottom: 10 }}
          style={{ height: 200 }}
          data={costHistogram}
          numberOfTicks={5}
          gridMin={0}
          svg={{ stroke: 'rgb(134, 65, 244)' }}
          contentInset={ { top: 20, bottom: 20 } }
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
          formatLabel={ (value, index) => index }
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}
