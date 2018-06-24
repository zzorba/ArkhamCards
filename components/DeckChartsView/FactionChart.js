import React from 'react';
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import { View, Text } from 'react-native';

import { DeckType } from '../parseDeck';
import { createFactionIcons, FACTION_CODES, FACTION_COLORS } from '../../constants';
import * as scale from 'd3-scale'

const FACTION_ICONS = createFactionIcons(32);
const CUT_OFF = 4;
export default class FactionChart extends React.PureComponent {
  static propTypes = {
    parsedDeck: DeckType,
  };

  getFactionData(faction) {
    return {
      faction,
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
          spacing={0.2}
          gridMin={0}
          numberOfTicks={4}
          contentInset={{ top: 10, bottom: 10 }}
          yAccessor={this.getValue}
          data={barData}
        >
          <Grid direction={Grid.Direction.HORIZONTAL} />
        </BarChart>
      </View>
    );
  }
}
