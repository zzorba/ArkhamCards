import React from 'react';
import { filter, map, maxBy } from 'lodash';
import { StackedBarChart } from 'react-native-svg-charts';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import { ParsedDeck } from '../parseDeck';
import ArkhamIcon from '../../assets/ArkhamIcon';
import { PLAYER_FACTION_CODES, FACTION_COLORS, FactionCodeType } from '../../constants';
import typography from '../../styles/typography';

interface Props {
  parsedDeck: ParsedDeck;
}

interface Item {
  faction: FactionCodeType;
  guardian: number;
  seeker: number;
  rogue: number;
  mystic: number;
  survivor: number;
  neutral: number;
  mythos: number;
  dual: number;
  total: number;
}

interface LabelData {
  x: (idx: number) => number;
  y: (idx: number) => number;
  width: number;
  data: Item[];
}

const DEFAULT_ITEM = {
  guardian: 0,
  seeker: 0,
  rogue: 0,
  mystic: 0,
  survivor: 0,
  neutral: 0,
  mythos: 0,
};

export default class FactionChart extends React.PureComponent<Props> {
  getFactionData(faction: FactionCodeType): Item {
    const counts = this.props.parsedDeck.factionCounts[faction] || [0, 0];
    return {
      ...DEFAULT_ITEM,
      faction,
      dual: counts[0],
      [faction]: counts[1],
      total: counts[0] + counts[1],
    };
  }

  _getValue = ({ item }: { item: Item }) => {
    return item.total;
  };

  render() {
    const barData = filter(
      PLAYER_FACTION_CODES.map(code => this.getFactionData(code)),
      data => data.total > 0
    );
    const contentInset = { top: 10, bottom: 10 };
    if (barData.length === 0) {
      return null;
    }
    const CUT_OFF = Math.min(
      4,
      (maxBy(map(barData, barData => barData.total)) || 0)
    );
    const Labels = ({ x, y, width, data }: LabelData) => (
      data.map((value, index) => (
        <View key={index}>
          <View style={[styles.label, {
            left: x(index),
            top: y(0) + 4,
            width: width / barData.length,
          }]}>
            { value.faction === 'neutral' ? (
              <ArkhamIcon
                name="elder_sign"
                size={32}
                color="#444"
              />
            ) : (
              <ArkhamIcon
                name={value.faction}
                size={32}
                color={FACTION_COLORS[value.faction]}
              />
            ) }
          </View>
          { value.total > 0 && (
            <Text
              style={[
                styles.label, {
                  left: x(index),
                  top: value.total < CUT_OFF ? y(value.total) - 20 : y(value.total) + 8,
                  width: width / barData.length,
                  color: value.total >= CUT_OFF ? 'white' : 'black',
                },
                styles.count,
              ]}
            >
              { value.total }
            </Text>
          ) }
        </View>
      ))
    );
    const keys: (FactionCodeType | 'dual')[] = [
      'mystic',
      'seeker',
      'guardian',
      'rogue',
      'survivor',
      'neutral',
      'dual',
    ];
    const colors = map(keys, key => key === 'neutral' ? '#444' : FACTION_COLORS[key]);
    return (
      <View style={styles.wrapper}>
        <Text style={[typography.bigLabel, typography.center]}>
          { t`Card Factions` }
        </Text>
        <View style={styles.chart}>
          <StackedBarChart
            style={styles.barChart}
            gridMin={0}
            numberOfTicks={4}
            contentInset={contentInset}
            keys={keys}
            colors={colors}
            data={barData}
          >
            {
              // @ts-ignore TS2739
              <Labels />
            }
          </StackedBarChart>
        </View>
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
  chart: {
    flexDirection: 'row',
    height: 200,
  },
  label: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  barChart: {
    flex: 1,
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
