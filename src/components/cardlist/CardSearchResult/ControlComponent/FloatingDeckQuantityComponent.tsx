import { NOTCH_BOTTOM_PADDING } from '@styles/sizes';
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import DeckQuantityComponent from './DeckQuantityComponent';

interface Props {
  deckId: number;
  code: string;
  limit: number;
}

export default function FloatingDeckQuantityComponent({ deckId, code, limit }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[styles.fab, { backgroundColor: colors.D20 }]}>
      <DeckQuantityComponent
        deckId={deckId}
        code={code}
        limit={limit}
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
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
});
