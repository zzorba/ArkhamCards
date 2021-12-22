import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import DeckQuantityComponent from './DeckQuantityComponent';
import { DeckId } from '@actions/types';

interface Props {
  deckId: DeckId;
  code: string;
  limit: number;
  side?: boolean;
}

export default function FloatingDeckQuantityComponent({ deckId, code, limit, side }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  return (
    <View style={[styles.fab, shadow.large, { backgroundColor: colors.D20 }]}>
      <DeckQuantityComponent
        deckId={deckId}
        code={code}
        limit={limit}
        side={side}
        showZeroCount
        forceBig
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    borderRadius: 40,
    height: 56,
    position: 'absolute',
    bottom: NOTCH_BOTTOM_PADDING + s + xs,
    paddingLeft: s,
    paddingRight: s,
    right: s + xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
