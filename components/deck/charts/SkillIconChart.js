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

  getValue({ item }) {
    return item.value;
  }

  render() {
    const data = SKILLS.map(skill => {
      return {
        value: this.props.parsedDeck.skillIconCounts[skill],
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
          spacing={0.1}
          numberOfTicks={4}
          contentInset={{ top: 30, bottom: 30 }}
          data={data}
          yAccessor={this.getValue}
        />
        <XAxis
          style={{ marginHorizontal: -10 }}
          data={data}
          formatLabel={this.formatLabel}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}
