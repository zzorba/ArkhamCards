import React, { useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { ParsedDeck } from '@actions/types';
import FactionChart from './FactionChart';
import CostChart from './CostChart';
import SlotsChart from './SlotsChart';
import SkillIconChart from './SkillIconChart';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

const INCLUDE_SLOTS_CHART = false;

export interface DeckChartsProps {
  parsedDeck?: ParsedDeck;
}

export default function DeckChartsView({ parsedDeck }: DeckChartsProps) {
  const { backgroundStyle } = useContext(StyleContext);
  const { width } = useWindowDimensions();

  if (!parsedDeck) {
    return null;
  }
  return (
    <ScrollView contentContainerStyle={[
      styles.container,
      backgroundStyle,
      space.paddingSideS,
      space.paddingTopM,
    ]}>
      <SkillIconChart parsedDeck={parsedDeck} width={width - 16} />
      <CostChart parsedDeck={parsedDeck} width={width - 16} />
      { INCLUDE_SLOTS_CHART && <SlotsChart parsedDeck={parsedDeck} width={width - 16} /> }
      <FactionChart parsedDeck={parsedDeck} width={width - 16} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 64,
    flexDirection: 'column',
  },
});
