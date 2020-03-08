import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { difficultyString } from './constants';
import { CampaignDifficulty } from 'actions/types';
import typography from 'styles/typography';

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
        <View style={styles.difficulty}>
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
    backgroundColor: '#dedede',
    borderRadius: 4,
    paddingLeft: 4,
    paddingRight: 4,
  },
});
