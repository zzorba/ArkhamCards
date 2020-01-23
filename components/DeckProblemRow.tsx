import React from 'react';
import { head } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DeckProblem, DeckProblemType } from '../actions/types';
import { t } from 'ttag';
import AppIcon from '../assets/AppIcon';
import typography, { SMALL_FONT_SIZE } from '../styles/typography';

interface Props {
  problem: DeckProblem;
  color: string;
  noFontScaling?: boolean;
  fontSize?: number;
  fontScale: number;
}
export default function DeckProblemRow({
  problem,
  color,
  noFontScaling,
  fontSize,
  fontScale,
}: Props) {
  const DECK_PROBLEM_MESSAGES: { [error in DeckProblemType]: string } = {
    too_few_cards: t`Not enough cards.`,
    too_many_cards: t`Too many cards.`,
    too_many_copies: t`Too many copies of a card with the same name.`,
    invalid_cards: t`Contains forbidden cards (cards not permitted by Faction)`,
    deck_options_limit: t`Contains too many limited cards.`,
    investigator: t`Doesn't comply with the Investigator requirements.`,
  };
  return (
    <View style={styles.problemRow}>
      <View style={styles.warningIcon}>
        <AppIcon
          name="warning"
          size={SMALL_FONT_SIZE * (noFontScaling ? 1 : fontScale)}
          color={color}
        />
      </View>
      <Text
        style={[typography.small, { color }, { fontSize: fontSize || SMALL_FONT_SIZE }, styles.problemText]}
        numberOfLines={2}
        ellipsizeMode="tail"
        allowFontScaling={!noFontScaling}
      >
        { head(problem.problems) || DECK_PROBLEM_MESSAGES[problem.reason] }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  problemText: {
    flex: 1,
  },
  problemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  warningIcon: {
    marginRight: 4,
  },
});
