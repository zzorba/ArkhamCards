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
import { ParsedDeck } from 'actions/types';
import { SKILLS, SKILL_COLORS, SkillCodeType } from 'constants';
import typography from 'styles/typography';

interface Props {
  parsedDeck: ParsedDeck;
  width: number;
}

interface Item {
  skill: SkillCodeType;
  value: number;
}

export default class SkillIconChart extends React.PureComponent<Props> {
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
    const barData = map(SKILLS, skill => this.getSkillData(skill));

    return (
      <View style={[styles.wrapper, { width }]}>
        <Text style={[typography.bigLabel, typography.center]}>
          { t`Skill Icons` }
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
            x="skill"
            y="value"
            barRatio={1.6}
            // @ts-ignore TS2769
            labels={this._getValue}
            style={{
              data: {
                fill: ({ datum }: { datum: Item }) => SKILL_COLORS[datum.skill],
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
