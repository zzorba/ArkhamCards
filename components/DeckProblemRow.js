import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppIcon from '../assets/AppIcon';
import typography from '../styles/typography';

const DECK_PROBLEM_MESSAGES = {
  too_few_cards: 'Not enough cards.',
  too_many_cards: 'Too many cards.',
  too_many_copies: 'Too many copies of a card with the same name.',
  invalid_cards: 'Contains forbidden cards (cards not permitted by Faction)',
  deck_options_limit: 'Contains too many limited cards.',
  investigator: 'Doesn\'t comply with the Investigator requirements.',
};

export default function DeckProblemRow({ problem, color }) {
  return (
    <View style={styles.problemRow}>
      <View style={styles.warningIcon}>
        <AppIcon name="warning" size={14} color={color} />
      </View>
      <Text
        style={[typography.small, { color }, styles.problemText]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        { head(problem.problems) || DECK_PROBLEM_MESSAGES[problem.reason] }
      </Text>
    </View>
  );
}

DeckProblemRow.propTypes = {
  problem: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};

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
