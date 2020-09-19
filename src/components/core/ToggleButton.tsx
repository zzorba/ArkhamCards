import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  onPress: () => void;
  value: boolean;
  accessibilityLabel: string;
  size?: number;
  icon: 'dots' | 'expand';
}

export default function ToggleButton({ onPress, value, accessibilityLabel, size=24, icon }: Props) {
  const { colors } = useContext(StyleContext);
  const SIZE = size * 1.5;
  return (
    <TouchableOpacity onPress={onPress} accessibilityLabel={accessibilityLabel}>
      { value ? (
        <View style={[styles.closeIcon, { width: SIZE, height: SIZE, backgroundColor: colors.D10 }] }>
          <AppIcon
            name="dismiss"
            size={size-2}
            color={colors.L10}
          />
        </View>
      ) : (
        <View style={[styles.icon, { width: SIZE, height: SIZE, backgroundColor: colors.L10 }] }>
          { icon === 'dots' ? (
            <AppIcon
              name="dots"
              size={size}
              color={colors.D10}
            />
          ) : (
            <AppIcon
              name="expand_more"
              size={size}
              color={colors.D10}
            />
          ) }
        </View>
      ) }
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  closeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
