import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import StyleContext from '@styles/StyleContext';
import { xs, s } from '@styles/space';

interface Props {
  count: number;
  showZeroCount?: boolean;
}

export default function StackedCardCount({ count, showZeroCount }: Props) {
  const { colors, shadow, typography } = useContext(StyleContext);
  if (!showZeroCount && count === 0) {
    return null;
  }
  return (
    <View style={styles.cardWrapper}>
      { count > 2 && <View style={[styles.card, shadow.small, { backgroundColor: colors.L20, position: 'absolute', top: 4, left: 0 }]} /> }
      { count > 1 && <View style={[styles.card, shadow.small, { backgroundColor: colors.L20, position: 'absolute', top: 2, left: 2 }]} /> }
      <View style={[
        styles.card,
        (count > 0 ? shadow.small : { borderWidth: 1, borderColor: colors.L10 }),
        { backgroundColor: count > 0 ? colors.L20 : colors.L30, top: 0, left: 4 },
      ]}>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    textAlign: 'center',
  },
});
