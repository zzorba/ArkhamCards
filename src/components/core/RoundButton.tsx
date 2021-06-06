import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';

interface Props {
  size?: number;
  margin?: number;
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function RoundButton({ onPress, children, disabled, size = 32, margin = 0 }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  return (
    <Ripple style={[
      shadow.medium,
      styles.button,
      {
        backgroundColor: colors.L20,
        width: size,
        height: size,
        borderRadius: size / 2,
        margin,
      },
    ]} onPress={onPress} rippleColor={colors.M} rippleSize={size} disabled={disabled}>
      { children }
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});