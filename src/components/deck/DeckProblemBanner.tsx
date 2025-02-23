import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import COLORS from '@styles/colors';
import DeckProblemRow from '@components/core/DeckProblemRow';
import { DeckProblem } from '@actions/types';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  problem: DeckProblem;
}

export default function DeckProblemBanner({ problem }: Props) {
  const { shadow } = useContext(StyleContext);
  return (
    <View style={[
      styles.banner,
      shadow.large,
      space.paddingVerticalXs,
      space.paddingSideS,
      { backgroundColor: COLORS.red, opacity: 0.95 },
    ]}>
      <DeckProblemRow
        problem={problem}
        color={COLORS.white}
        fontSize={14}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
});
