import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { TouchableQuickSize } from '@components/core/Touchables';
import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';

interface Props {
  size?: number;
  margin?: number;
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  noShadow?: boolean;
  accessibilityLabel: string;
  wide?: boolean;
}

export default function RoundButton({ onPress, accessibilityLabel, children, disabled, size = 32, margin = 0, noShadow, wide }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  return (
    <TouchableQuickSize accessibilityLabel={accessibilityLabel} onPress={onPress} disabled={disabled} activeScale={1.1}>
      <View style={[
        noShadow ? undefined : shadow.medium,
        styles.button,
        {
          backgroundColor: colors.L20,
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