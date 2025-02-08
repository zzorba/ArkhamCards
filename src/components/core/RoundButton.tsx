import React, { useContext } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { TouchableQuickSize } from '@components/core/Touchables';
import StyleContext from '@styles/StyleContext';

interface Props {
  size?: number;
  margin?: number;
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  noShadow?: boolean;
  accessibilityLabel?: string;
  wide?: boolean;
  hollow?: boolean;
  shadowStyle?: ViewStyle;
}

export default function RoundButton({ onPress, shadowStyle, hollow, accessibilityLabel, children, disabled, size = 32, margin = 0, noShadow, wide }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  return (
    <TouchableQuickSize accessibilityLabel={accessibilityLabel} onPress={onPress} disabled={disabled} activeScale={1.1}>
      <View style={[
        shadowStyle ?? (noShadow ? undefined : shadow.medium),
        styles.button,
        {
          backgroundColor: hollow ? colors.L30 : colors.L20,
          borderColor: hollow ? colors.L10 : undefined,
          borderWidth: hollow ? 1 : 0,
          width: size * (wide ? 2 : 1),
          height: size,
          borderRadius: size / 2,
          margin,
        },
      ]}>
        { children }
      </View>
    </TouchableQuickSize>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});