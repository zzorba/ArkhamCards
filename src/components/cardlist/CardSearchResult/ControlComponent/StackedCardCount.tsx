import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { xs, s } from '@styles/space';

interface Props {
  count: number;
  showZeroCount?: boolean;
}

export default function StackedCardCount({ count, showZeroCount }: Props) {
  const { colors, typography } = useContext(StyleContext);
  if (!showZeroCount && count === 0) {
    return null;
  }
  return (
    <View style={styles.cardWrapper}>
      { count > 2 && <View style={[styles.card, styles.shadow, { backgroundColor: colors.L20, position: 'absolute', top: 4, left: 0 }]} /> }
      { count > 1 && <View style={[styles.card, styles.shadow, { backgroundColor: colors.L20, position: 'absolute', top: 2, left: 2 }]} /> }
      <View style={[styles.card, styles.shadow, { backgroundColor: colors.L20, top: 0, left: 4 }]}>
        <Text style={[typography.text, styles.count]}>
          { `×${count}` }
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    width: 30,
    height: 36,
    marginTop: xs,
    marginLeft: xs,
    marginRight: s,
  },
  card: {
    width: 24,
    height: 32,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
  count: {
    textAlign: 'center',
  },
});
