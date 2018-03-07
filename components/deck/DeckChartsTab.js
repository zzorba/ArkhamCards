import React from 'react';
const {
  ScrollView,
} = require('react-native');

import { DeckType } from './parseDeck';

import FactionChart from './charts/FactionChart';
import CostChart from './charts/CostChart';
import SkillIconChart from './charts/SkillIconChart';

export default class DeckChartsTab extends React.Component {
  static propTypes = {
    parsedDeck: DeckType,
  };

  render() {
    const {
      parsedDeck,
    } = this.props;
    return (
      <ScrollView>
        <FactionChart parsedDeck={parsedDeck} />
        <CostChart parsedDeck={parsedDeck} />
        <SkillIconChart parsedDeck={parsedDeck} />
      </ScrollView>
    );
  }
}
