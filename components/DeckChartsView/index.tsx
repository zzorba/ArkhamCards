import React from 'react';
import {
  ScrollView,
} from 'react-native';

import { ParsedDeck } from '../parseDeck';

import FactionChart from './FactionChart';
import CostChart from './CostChart';
import SkillIconChart from './SkillIconChart';

interface Props {
  parsedDeck: ParsedDeck;
}
export default class DeckChartsView extends React.Component<Props> {
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
