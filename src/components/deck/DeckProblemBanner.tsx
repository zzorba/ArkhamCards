import React from 'react';
import { StyleSheet, View } from 'react-native';

import COLORS from '@styles/colors';
import DeckProblemRow from '@components/core/DeckProblemRow';
import { DeckProblem } from '@actions/types';
import space from '@styles/space';
import { FactionCodeType } from '@app_constants';

interface Props {
  faction: FactionCodeType;
  problem: DeckProblem;
}

export default function DeckProblemBanner({ faction, problem }: Props) {
  const isSurvivor = faction === 'survivor';
  return (
    <View style={[
      styles.problemBox,
      space.paddingVerticalXs,
      space.paddingSideS,
      { backgroundColor: isSurvivor ? COLORS.yellow : COLORS.red },
    ]}>
      <DeckProblemRow
        problem={problem}
        color={isSurvivor ? COLORS.black : COLORS.white}
        fontSize={14}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  problemBox: {
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
});
