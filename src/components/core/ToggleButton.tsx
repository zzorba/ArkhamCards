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
  inputSize?: number;
}

export default function ToggleButton({ onPress, value, accessibilityLabel, size = 24, icon, inputSize }: Props) {
  const { colors } = useContext(StyleContext);
  const SIZE = inputSize || (size * 1.5);
  return (
    <TouchableOpacity onPress={onPress} accessibilityLabel={accessibilityLabel}>
      { value ? (
        <View style={[styles.closeIcon, { width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: colors.D10 }] }>
          <AppIcon
            name="dismiss"
            size={size - 2}
            color={colors.L10}
          />
        </View>
      ) : (
        <View style={[styles.icon, { width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: colors.L10 }] }>
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
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
