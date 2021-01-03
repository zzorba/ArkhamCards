import React, { useContext } from 'react';
import { head } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import { DeckProblem, DeckProblemType } from '@actions/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import WarningIcon from '@icons/WarningIcon';

interface Props {
  problem: DeckProblem;
  color: string;
  noFontScaling?: boolean;
  fontSize?: number;
}

export function getProblemMessage(problem: DeckProblem): string {
  const DECK_PROBLEM_MESSAGES: { [error in DeckProblemType]: string } = {
    too_few_cards: t`Not enough cards.`,
    too_many_cards: t`Too many cards.`,
    too_many_copies: t`Too many copies of a card with the same name.`,
    invalid_cards: t`Contains forbidden cards (cards not permitted by Faction)`,
    deck_options_limit: t`Contains too many limited cards.`,
    investigator: t`Doesn't comply with the Investigator requirements.`,
  };

  return head(problem.problems) || DECK_PROBLEM_MESSAGES[problem.reason];
}

export default function DeckProblemRow({
  problem,
  color,
  noFontScaling,
  fontSize,
}: Props) {
  const { typography } = useContext(StyleContext);
  return (
    <View style={styles.problemRow}>
      <View style={space.marginRightXs}>
        <WarningIcon size={14} />
      </View>
      <Text
        style={[typography.small, { color }, { fontSize: fontSize || 14 }, styles.problemText]}
        numberOfLines={2}
        ellipsizeMode="tail"
        allowFontScaling={!noFontScaling}
      >
        { getProblemMessage(problem) }
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  problemText: {
    flex: 1,
  },
  problemRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
