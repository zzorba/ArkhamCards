import React from 'react';
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import { View, Text } from 'react-native';

import { ParsedDeck } from '../parseDeck';
import { createFactionIcons, CORE_FACTION_CODES, FACTION_COLORS, FactionCodeType } from '../../constants';
import * as scale from 'd3-scale'

const FACTION_ICONS = createFactionIcons(32);
const CUT_OFF = 4;

interface Props {
  parsedDeck: ParsedDeck;
}

interface Item {
  value: number;
  svg: {
    fill: string;
  };
}

export default class FactionChart extends React.PureComponent<Props> {
  getFactionData(faction: FactionCodeType) {
    return {
      faction,
      value: this.props.parsedDeck.factionCounts[faction] || 0,
      svg: {
        fill: FACTION_COLORS[faction],
      },
    };
  }

  _getValue = ({ item }: { item: Item }) => {
    return item.value;
  };

  render() {
    const barData = CORE_FACTION_CODES.map(code => this.getFactionData(code));

    return (
      <View>
        <Text>Card Factions</Text>
        <Text>Draw deck only</Text>
        <BarChart
          style={{ height: 200 }}
          gridMin={0}
          numberOfTicks={4}
          contentInset={{ top: 10, bottom: 10 }}
          yAccessor={this._getValue}
          data={barData}
        >
          <Grid direction={Grid.Direction.HORIZONTAL} />
        </BarChart>
      </View>
    );
  }
}
