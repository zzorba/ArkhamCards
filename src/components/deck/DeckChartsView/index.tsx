import React, { useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import { ParsedDeck } from '@actions/types';
import CostChart from './CostChart';
import SlotsChart from './SlotsChart';
import SkillIconChart from './SkillIconChart';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';
import FactionChart from './FactionChart';

export interface DeckChartsProps {
  parsedDeck: ParsedDeck | undefined;
  headerBackgroundColor: string | undefined;
}

export default function DeckChartsView() {
  const { backgroundStyle, width } = useContext(StyleContext);
  const route = useRoute<RouteProp<RootStackParamList, 'Deck.Charts'>>();
  const { parsedDeck } = route.params;

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
      <CostChart parsedDeck={parsedDeck} width={width - 16} />
      <SkillIconChart parsedDeck={parsedDeck} width={width - 16} />
      <FactionChart parsedDeck={parsedDeck} width={width - 16} />
      <SlotsChart parsedDeck={parsedDeck} width={width - 16} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 64,
    flexDirection: 'column',
  },
});
