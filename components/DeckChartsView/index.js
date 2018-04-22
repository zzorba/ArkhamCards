import React from 'react';
import {
  ScrollView,
} from 'react-native';

import { DeckType } from '../DeckDetailView/parseDeck';

import FactionChart from './FactionChart';
import CostChart from './CostChart';
import SkillIconChart from './SkillIconChart';

export default class DeckChartsView extends React.Component {
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
