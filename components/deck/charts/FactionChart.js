import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis } from 'react-native-svg-charts'
const { View, Text } = require('react-native');

import { DeckType } from '../parseDeck';
import { FACTION_COLORS } from '../../../styles/colors';
import { FACTION_CODES } from '../../../constants';
import { Circle, G, Line, Rect } from 'react-native-svg'
import ArkhamIcon from '../../../assets/ArkhamIcon';

const CLASS_ICONS = {
  mystic: <ArkhamIcon name="mystic" size={18} color="#FFFFFF" />,
  seeker: <ArkhamIcon name="seeker" size={18} color="#ec8426" />,
  guardian: <ArkhamIcon name="guardian" size={18} color="#2b80c5" />,
  rogue: <ArkhamIcon name="rogue" size={18} color="#107116" />,
  survivor: <ArkhamIcon name="survivor" size={18} color="#cc3038" />,
  neutral: <ArkhamIcon name="elder_sign" size={18} color="#606060" />,
};

const renderFactionIcon = ({ index, x, y, value }) => {
  return (
    <G key={index}>
      <Circle
          cx={ x.bandwidth() / 6 * index }
          cy={ y(value) }
          r={ 6 }
          stroke={ 'rgb(134, 65, 244)' }
          strokeWidth={2}
          fill={ 'black' }
          onPress={ () => console.log('tooltip clicked') }
      />
    </G>
  );
}

export default class FactionChart extends React.PureComponent {
  static propTypes = {
    parsedDeck: DeckType,
  };

  getFactionData(faction) {
    return {
      values: [ this.props.parsedDeck.factionCounts[faction] ],
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
          contentInset={ { top: 30, bottom: 30 } }
          data={barData}
        />
      </View>
    );
  }
}
