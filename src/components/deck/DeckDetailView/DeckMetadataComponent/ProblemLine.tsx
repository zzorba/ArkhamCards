import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { DeckProblem, DeckProblemType } from '@actions/types';
import StyleContext from '@styles/StyleContext';
import MetadataLineComponent from './MetadataLineComponent';
import WarningIcon from '@icons/WarningIcon';

interface Props {
  problem?: DeckProblem
}

export default function ProblemLine({ problem }: Props) {
  const { colors, typography, fontScale } = useContext(StyleContext);
  if (!problem) {
    return null;
  }

  const DECK_PROBLEM_MESSAGES: { [error in DeckProblemType]: string } = {
    too_few_cards: t`Not enough cards.`,
    too_many_cards: t`Too many cards.`,
    too_many_copies: t`Too many copies of a card with the same name.`,
    invalid_cards: t`Contains forbidden cards (cards not permitted by Faction)`,
    deck_options_limit: t`Contains too many limited cards.`,
    investigator: t`Doesn't comply with the Investigator requirements.`,
  };
  const title = (
    <Text style={[typography.large, { color: colors.warnText }]}>
      { t`Deck is invalid` }
    </Text>
  );
  const description = (
    <View style={styles.row}>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[typography.small, typography.italic, { color: colors.M, lineHeight: 24 * fontScale }]}
      >
        { DECK_PROBLEM_MESSAGES[problem.reason] }
      </Text>
    </View>
  );

  return (
    <MetadataLineComponent
      icon={<WarningIcon size={30} />}
      title={title}
      description={description}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
