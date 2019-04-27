import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { ParsedDeck } from '../parseDeck';

import FactionChart from './FactionChart';
import CostChart from './CostChart';
import SkillIconChart from './SkillIconChart';

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
        <FactionChart parsedDeck={parsedDeck} />
        <CostChart parsedDeck={parsedDeck} />
        <SkillIconChart parsedDeck={parsedDeck} />
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
