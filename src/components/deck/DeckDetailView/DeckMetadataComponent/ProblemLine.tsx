import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { t } from 'ttag';

import { DeckProblem, DeckProblemType, DECK_OPTIONS_LIMIT, INVALID_CARDS, INVESTIGATOR_PROBLEM, TOO_FEW_CARDS, TOO_MANY_CARDS, TOO_MANY_COPIES } from '@actions/types';
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
    [TOO_FEW_CARDS]: t`Not enough cards.`,
    [TOO_MANY_CARDS]: t`Too many cards.`,
    [TOO_MANY_COPIES]: t`Too many copies of a card with the same name.`,
    [INVALID_CARDS]: t`Contains forbidden cards (cards not permitted by Faction)`,
    [DECK_OPTIONS_LIMIT]: t`Contains too many limited cards.`,
    [INVESTIGATOR_PROBLEM]: t`Doesn't comply with the Investigator requirements.`,
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
