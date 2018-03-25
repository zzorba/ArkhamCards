import React from 'react';
import { BarChart, XAxis } from 'react-native-svg-charts';
import { View, Text } from 'react-native';

import { DeckType } from '../parseDeck';
import { SKILLS } from '../../../constants';

export default class SkillIconChart extends React.PureComponent {
  static propTypes = {
    parsedDeck: DeckType,
  };

  formatLabel(value, index) {
    return SKILLS[index];
  }

  render() {
    const data = [{
      values: SKILLS.map(skill => this.props.parsedDeck.skillIconCounts[skill]),
      positive: {
        fill: '#606060',
      },
      negative: {
        fill: '#606060',
      },
    }];
    return (
      <View>
        <Text>Card Skill Icons</Text>
        <BarChart
          style={{ height: 200 }}
          spacing={0.1}
          numberOfTicks={4}
          contentInset={{ top: 30, bottom: 30 }}
          data={data}
        />
        <XAxis
          style={{ marginHorizontal: -10 }}
          data={data[0].values}
          formatLabel={this.formatLabel}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}
