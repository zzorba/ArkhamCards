import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { difficultyString } from './constants';
import { CampaignDifficulty } from '@actions/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  difficulty: CampaignDifficulty;
}

export default function Difficulty({ difficulty }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={styles.row}>
      <View style={[styles.difficulty, { backgroundColor: colors.L10 }, space.paddingSideXs]}>
        <Text style={[typography.small, { color: colors.darkText, textTransform: 'uppercase' }]}>
          { difficultyString(difficulty) }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  difficulty: {
    borderRadius: 4,
  },
});
