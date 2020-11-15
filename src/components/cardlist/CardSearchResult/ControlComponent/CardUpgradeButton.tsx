import React, { useCallback, useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import Card from '@data/Card';
import { xs } from '@styles/space';
import RoundButton from '@components/core/RoundButton';

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
        <RoundButton onPress={onPress}>
          <AppIcon
            size={28}
            color={colors.M}
            name="upgrade"
          />
        </RoundButton>
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
  countWrapper: {
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