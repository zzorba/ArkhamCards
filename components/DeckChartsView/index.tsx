import React from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import { ParsedDeck } from '../parseDeck';

import FactionChart from './FactionChart';
import CostChart from './CostChart';
import SlotsChart from './SlotsChart';
import SkillIconChart from './SkillIconChart';

const INCLUDE_SLOTS_CHART = false;

interface Props {
  parsedDeck?: ParsedDeck;
}

export default class DeckChartsView extends React.Component<Props> {
  render() {
    const {
      parsedDeck,
    } = this.props;
    if (!parsedDeck) {
      return null;
    }
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <SkillIconChart parsedDeck={parsedDeck} />
        <CostChart parsedDeck={parsedDeck} />
        { INCLUDE_SLOTS_CHART && <SlotsChart parsedDeck={parsedDeck} /> }
        <FactionChart parsedDeck={parsedDeck} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 64,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'column',
  },
});
