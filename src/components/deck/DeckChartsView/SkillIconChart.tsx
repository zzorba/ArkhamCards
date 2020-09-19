import React from 'react';
import { map } from 'lodash';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
} from 'victory-native';
import { View, Text, StyleSheet } from 'react-native';
import { t } from 'ttag';

import ChartLabel from './ChartLabel';
import ChartIconComponent from './ChartIconComponent';
import { ParsedDeck } from '@actions/types';
import { SKILLS, SkillCodeType } from '@app_constants';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { colors } from 'react-native-elements';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item {
  skill: SkillCodeType;
  value: number;
}

export default class SkillIconChart extends React.PureComponent<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  getSkillData(skill: SkillCodeType): Item {
    return {
      skill,
      value: this.props.parsedDeck.skillIconCounts[skill] || 0,
    };
  }

  _getValue = ({ datum }: { datum: Item }) => {
    return datum.value;
  };

  render() {
    const { width } = this.props;
    const { typography, colors } = this.context;
    const barData = map(SKILLS, skill => this.getSkillData(skill));

    return (
      <View style={[styles.wrapper, { width }]}>
        <Text style={[typography.large, typography.center]}>
          { t`Skill Icons` }
        </Text>
        <VictoryChart width={width}>
          <VictoryAxis
            style={{
              axis: { stroke: 'none' },
              tickLabels: {
                fontSize: 18,
                fontFamily: typography.large.fontFamily,
                fontWeight: '400',
                fill: colors.darkText,
              },
            }}
            // @ts-ignore TS2739
            tickLabelComponent={<ChartIconComponent />}
          />
          <VictoryBar
            data={barData}
            x="skill"
            y="value"
            barRatio={1.6}
            // @ts-ignore TS2769
            labels={this._getValue}
            style={{
              data: {
                fill: ({ datum }: { datum: Item }) => COLORS.skill[datum.skill].default,
              },
              labels: {
                fill: 'white',
                fontSize: 14,
                fontFamily: typography.bold.fontFamily,
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
