import React from 'react';
import { filter, map } from 'lodash';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
} from 'victory-native';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import ChartLabel from './ChartLabel';
import ChartIconComponent from './ChartIconComponent';
import { ParsedDeck } from 'actions/types';
import { SLOTS, SlotCodeType } from 'constants';
import typography from 'styles/typography';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item {
  slot: string;
  value: number;
}

export default class SlotIconChart extends React.PureComponent<Props> {
  getSlotData(slot: SlotCodeType): Item {
    return {
      slot: slot.replace(' ', '-'),
      value: this.props.parsedDeck.slotCounts[slot] || 0,
    };
  }

  _getValue = ({ datum }: { datum: Item }) => {
    return datum.value;
  };

  render() {
    const { width } = this.props;
    const barData = filter(
      map(SLOTS, slot => this.getSlotData(slot)),
      data => data.value > 0
    );

    return (
      <View style={[styles.wrapper, { width }]}>
        <Text style={[typography.bigLabel, typography.center]}>
          { t`Slots` }
        </Text>
        <VictoryChart width={width}>
          <VictoryAxis
            style={{
              axis: { stroke: 'none' },
              tickLabels: {
                fontSize: 18,
                fontFamily: 'System',
                fontWeight: '400',
              },
            }}
            // @ts-ignore TS2739
            tickLabelComponent={<ChartIconComponent />}
          />
          <VictoryBar
            data={barData}
            x="slot"
            y="value"
            barRatio={1.6}
            // @ts-ignore TS2769
            labels={this._getValue}
            style={{
              data: {
                fill: '#444',
              },
              labels: {
                fill: 'white',
                fontSize: 14,
                fontFamily: 'System',
                fontWeight: '700',
              },
            }}
            // @ts-ignore TS2769
            labelComponent={<ChartLabel field="value" />}
          />
        </VictoryChart>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    position: 'relative',
    marginBottom: 64,
  },
});
