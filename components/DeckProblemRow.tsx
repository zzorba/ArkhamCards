import React from 'react';
import { head } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { DeckProblem, DeckProblemType } from '../actions/types';
import { t } from 'ttag';
import AppIcon from '../assets/AppIcon';
import typography from '../styles/typography';

const DECK_PROBLEM_MESSAGES: { [error in DeckProblemType]: string } = {
  too_few_cards: t`Not enough cards.`,
  too_many_cards: t`Too many cards.`,
  too_many_copies: t`Too many copies of a card with the same name.`,
  invalid_cards: t`Contains forbidden cards (cards not permitted by Faction)`,
  deck_options_limit: t`Contains too many limited cards.`,
  investigator: t`Doesn\'t comply with the Investigator requirements.`,
};

interface Props {
  problem: DeckProblem;
  color: string;
  noFontScaling?: boolean;
}
export default function DeckProblemRow({
  problem,
  color,
  noFontScaling
}: Props) {
  return (
    <View style={styles.problemRow}>
      <View style={styles.warningIcon}>
        <AppIcon
          name="warning"
          size={14 * (noFontScaling ? 1 : DeviceInfo.getFontScale())}
          color={color}
        />
      </View>
      <Text
        style={[typography.small, { color }, styles.problemText]}
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
    alignItems: 'flex-start',
  },
  warningIcon: {
    marginRight: 2,
  },
});
