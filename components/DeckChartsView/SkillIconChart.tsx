import React from 'react';
import { BarChart, XAxis } from 'react-native-svg-charts';
import { View, Text } from 'react-native';

import { ParsedDeck } from '../parseDeck';
import { SKILLS } from '../../constants';


interface Props {
  parsedDeck: ParsedDeck;
}

interface Item {
  value: number;
  svg: {
    fill: string;
  };
}

export default class SkillIconChart extends React.PureComponent<Props> {
  _formatLabel = (value: number, index: number) => {
    return SKILLS[index];
  };

  _getValue = ({ item }: { item: Item }) => {
    return item.value;
  };

  render() {
    const data: Item[] = SKILLS.map(skill => {
      return {
        value: this.props.parsedDeck.skillIconCounts[skill] || 0,
        svg: {
          fill: '#606060',
        },
      };
    });
    return (
      <View>
        <Text>Card Skill Icons</Text>
        <BarChart
          style={{ height: 200 }}
          numberOfTicks={4}
          contentInset={{ top: 30, bottom: 30 }}
          data={data}
          yAccessor={this._getValue}
        />
        <XAxis
          style={{ marginHorizontal: -10 }}
          data={data}
          formatLabel={this._formatLabel}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}
