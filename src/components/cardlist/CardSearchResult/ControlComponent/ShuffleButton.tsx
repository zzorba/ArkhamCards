import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { t } from 'ttag';

import StyleContext from '@styles/StyleContext';
import RoundButton from '@components/core/RoundButton';
import space from '@styles/space';
import Card from '@data/types/Card';
import AppIcon from '@icons/AppIcon';
import { usePressCallback } from '@components/core/hooks';

interface Props {
  onPress: () => void;
}

export default function ShuffleButton({ onPress }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[styles.countWrapper, space.paddingLeftXs]}>
      <RoundButton onPress={onPress} accessibilityLabel={t`Draw random basic weakness`}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name="shuffle-variant"
            size={20}
            color={colors.M}
          />
        </View>
      </RoundButton>
    </View>
  );
}

export function DraftButton({ card, onPress }: { card: Card; onPress: (card: Card) => void }) {
  const { colors } = useContext(StyleContext);
  const handleOnPress = useCallback(() => onPress(card), [onPress, card]);
  const debouncedOnPress = usePressCallback(handleOnPress, 500);
  return (
    <View style={[styles.countWrapper, space.paddingLeftXs, space.paddingRightS]}>
      <RoundButton onPress={debouncedOnPress} accessibilityLabel={t`Take`}>
        <View style={styles.icon}>
          <AppIcon
            name="plus-button"
            size={24}
            color={colors.M}
          />
        </View>
      </RoundButton>
    </View>
  );
}

const styles = StyleSheet.create({
  countWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 1,
    paddingBottom: 2,
  },
});