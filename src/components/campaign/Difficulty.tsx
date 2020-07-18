import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { difficultyString } from './constants';
import { CampaignDifficulty } from '@actions/types';
import typography from '@styles/typography';
import space from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  difficulty: CampaignDifficulty;
}

export default class Difficulty extends React.Component<Props> {
  render() {
    const {
      difficulty,
    } = this.props;
    return (
      <View style={styles.row}>
        <View style={[styles.difficulty, space.paddingSideXs]}>
          <Text style={typography.smallLabel}>
            { difficultyString(difficulty).toUpperCase() }
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  difficulty: {
    backgroundColor: COLORS.veryLightBackground,
    borderRadius: 4,
  },
});
