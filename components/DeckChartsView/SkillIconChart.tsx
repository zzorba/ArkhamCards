import React from 'react';
import { map, maxBy } from 'lodash';
import { BarChart } from 'react-native-svg-charts';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import { ParsedDeck } from '../../actions/types';
import ArkhamIcon from '../../assets/ArkhamIcon';
import { SKILLS, SKILL_COLORS, SkillCodeType } from '../../constants';
import typography from '../../styles/typography';

interface Props {
  parsedDeck: ParsedDeck;
}

interface Item {
  skill: SkillCodeType;
  value: number;
  svg: {
    fill: string;
  };
}

interface LabelData {
  x: (idx: number) => number;
  y: (idx: number) => number;
  bandwidth: number;
  data: Item[];
}

export default class SkillIconChart extends React.PureComponent<Props> {
  getSkillData(skill: SkillCodeType): Item {
    return {
      skill,
      value: this.props.parsedDeck.skillIconCounts[skill] || 0,
      svg: {
        fill: SKILL_COLORS[skill],
      },
    };
  }

  _getValue = ({ item }: { item: Item }) => {
    return item.value;
  };

  render() {
    const barData = map(SKILLS, skill => this.getSkillData(skill));
    const CUT_OFF = Math.min(
      4,
      (maxBy(map(barData, barData => barData.value)) || 0)
    );

    const contentInset = { top: 10, bottom: 10 };
    const Labels = ({ x, y, bandwidth, data }: LabelData) => (
      data.map((value, index) => (
        <View key={index}>
          <View style={[styles.label, {
            left: x(index),
            top: y(0) + 4,
            width: bandwidth,
          }]}>
            <ArkhamIcon
              name={value.skill}
              size={32}
              color={SKILL_COLORS[value.skill]}
            />
          </View>
          { value.value > 0 && (
            <Text style={[
              styles.label, {
                left: x(index),
                top: value.value < CUT_OFF ? y(value.value) - 20 : y(value.value) + 8,
                width: bandwidth,
                color: value.value >= CUT_OFF ? 'white' : 'black',
              },
              styles.count,
            ]}>
              { value.value }
            </Text>
          ) }
        </View>
      ))
    );

    return (
      <View style={styles.wrapper}>
        <Text style={[typography.bigLabel, typography.center]}>
          { t`Skill Icons` }
        </Text>
        <View style={styles.chart}>
          <BarChart
            style={styles.barChart}
            gridMin={0}
            numberOfTicks={4}
            contentInset={contentInset}
            yAccessor={this._getValue}
            data={barData}
          >
            {
              // @ts-ignore TS2739
              <Labels />
            }
          </BarChart>
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
