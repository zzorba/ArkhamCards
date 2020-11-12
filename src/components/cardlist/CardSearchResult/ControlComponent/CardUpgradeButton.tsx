import React, { useCallback, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import AppIcon from '@icons/AppIcon';
import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import Card from '@data/Card';
import { s, xs } from '@styles/space';

interface Props {
  card: Card;
  count: number;
  onUpgradePress?: (card: Card) => void;
}

export default function CardUpgradeButton({ onUpgradePress, card, count }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => onUpgradePress && onUpgradePress(card), [onUpgradePress, card]);
  return (
    <View style={styles.countWrapper}>
      { !!onUpgradePress && (
        <Ripple style={[
          styles.button,
          {
            backgroundColor: colors.L20,
            width: 32,
            height: 32,
          },
        ]} onPress={onPress} rippleColor={colors.M} rippleSize={32}>
          <AppIcon
            size={28}
            color={colors.M}
            name="upgrade"
          />
        </Ripple>
      ) }
      <View style={styles.count}>
        <Text style={typography.text}>
          { count }
        </Text>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingLeft: 1,
    paddingBottom: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
  },
  countWrapper: {
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    marginLeft: xs,
    minWidth: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});