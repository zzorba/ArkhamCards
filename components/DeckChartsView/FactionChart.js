import React from 'react';
import { BarChart } from 'react-native-svg-charts';
import { View, Text } from 'react-native';


import { DeckType } from '../DeckDetailView/parseDeck';
import { FACTION_CODES, FACTION_COLORS } from '../../constants';

export default class FactionChart extends React.PureComponent {
  static propTypes = {
    parsedDeck: DeckType,
  };

  getFactionData(faction) {
    return {
      value: this.props.parsedDeck.factionCounts[faction],
      svg: {
        fill: FACTION_COLORS[faction],
      },
    };
  }

  getValue({ item }) {
    return item.value;
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
          yAccessor={this.getValue}
          gridMin={0}
          data={barData}
        />
      </View>
    );
  }
}
