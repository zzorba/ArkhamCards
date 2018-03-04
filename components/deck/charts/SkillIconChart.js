import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis } from 'react-native-svg-charts'
const { View, Text } = require('react-native');

import { DeckType } from '../parseDeck';
import { FACTION_COLORS } from '../../../styles/colors';
import { SKILLS } from '../../../constants';
import { Circle, G, Line, Text as SvgText, Rect } from 'react-native-svg'
import ArkhamIcon from '../../../assets/ArkhamIcon';

const CLASS_ICONS = {
  mystic: <ArkhamIcon name="mystic" size={18} color="#FFFFFF" />,
  seeker: <ArkhamIcon name="seeker" size={18} color="#ec8426" />,
  guardian: <ArkhamIcon name="guardian" size={18} color="#2b80c5" />,
  rogue: <ArkhamIcon name="rogue" size={18} color="#107116" />,
  survivor: <ArkhamIcon name="survivor" size={18} color="#cc3038" />,
  neutral: <ArkhamIcon name="elder_sign" size={18} color="#606060" />,
};


export default class SkillIconChart extends React.PureComponent {
  static propTypes = {
    parsedDeck: DeckType,
  };


  render() {
    const data = [{
      values: SKILLS.map(skill => this.props.parsedDeck.skillIconCounts[skill]),
      positive: {
        fill: '#606060',
      },
      negative: {
        fill: '#606060',
      },
    }];
    return (
      <View>
        <Text>Card Skill Icons</Text>
        <BarChart
          style={{ height: 200 }}
          spacing={0.1}
          numberOfTicks={4}
          contentInset={ { top: 30, bottom: 30 } }
          data={data}
        />
        <XAxis
          style={{ marginHorizontal: -10 }}
          data={data[0].values}
          formatLabel={(value, index) => SKILLS[index]}
          contentInset={{ left: 10, right: 10 }}
          svg={{ fontSize: 10 }}
        />
      </View>
    );
  }
}
