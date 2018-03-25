import React from 'react';
import { BarChart } from 'react-native-svg-charts';
import { View, Text } from 'react-native';


import { DeckType } from '../parseDeck';
import { FACTION_COLORS } from '../../../styles/colors';
import { FACTION_CODES } from '../../../constants';

export default class FactionChart extends React.PureComponent {
  static propTypes = {
    parsedDeck: DeckType,
  };

  getFactionData(faction) {
    return {
      values: [this.props.parsedDeck.factionCounts[faction]],
      positive: {
        fill: FACTION_COLORS[faction],
      },
      negative: {
        fill: FACTION_COLORS[faction],
      },
    };
  }

  render() {
    const barData = FACTION_CODES.map(code => this.getFactionData(code));
    return (
      <View>
        <Text>Card Factions</Text>
        <Text>Draw deck only</Text>
        <BarChart
          style={{ height: 200 }}
          spacing={0.1}
          numberOfTicks={4}
          contentInset={{ top: 30, bottom: 30 }}
          data={barData}
        />
      </View>
    );
  }
}
