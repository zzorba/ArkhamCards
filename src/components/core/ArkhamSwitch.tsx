import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { TouchableOpacity as GestureHandlerTouchableOpacity } from 'react-native-gesture-handler';

import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';
import { ThemeColors } from '@styles/theme';

interface OwnProps {
  useGestureHandler?: boolean;
  value: boolean;
  onValueChange?: (checked: boolean) => void;
  accessibilityLabel?: string;
  large?: boolean;
  color?: 'light' | 'dark';
  circleColor?: 'light'
  disabledColor?: string
}

type Props = OwnProps & Omit<TouchableOpacityProps, 'onValueChange'>;
function getCircleColor(value: boolean, color: 'light' | 'dark' | undefined, circleColor: 'light' | undefined, colors: ThemeColors) {
  switch (color) {
    case 'light':
      return !value && circleColor !== 'light' ? colors.D10 : COLORS.L15;
    case 'dark':
      return colors.D10;
    default:
      return colors.L10;
  }
}
function getCheckColor(color: 'light' | 'dark' | undefined, colors: ThemeColors) {
  switch (color) {
    case 'light':
      return COLORS.L30;
    case 'dark':
      return colors.D20;
    default:
      return colors.M;
  }
}
export default function ArkhamSwitch({ useGestureHandler, disabledColor, value, onValueChange, accessibilityLabel, disabled, large, color, circleColor, ...props }: Props) {
  const { colors } = useContext(StyleContext);

  const onPress = useCallback(() => {
    onValueChange?.(!value);
  }, [value, onValueChange]);

  const theCircleColor = getCircleColor(value, color, circleColor, colors);
  const checkColor = getCheckColor(color, colors);
  const content = useMemo(() => {
    return (
      <View style={[styles.icon, large ? styles.largeIcon : undefined]}>
        <AppIcon
          size={large ? 34 : 28}
          name={large ? 'circle-thin' : 'check-circle'}
          color={disabled ? (disabledColor || colors.L20) : theCircleColor}
        />
        { !!value && (
          <View style={large ? styles.largeCheck : styles.check}>
            <AppIcon
              size={large ? 26 : 20}
              name="check"
              color={disabled ? (disabledColor || colors.L20) : checkColor}
            />
          </View>
        )}
      </View>
    );
  }, [disabled, large, value, disabledColor, colors, theCircleColor, checkColor]);
  if (!onValueChange) {
    return content;
  }

  const TouchableComponent = useGestureHandler ? GestureHandlerTouchableOpacity : TouchableOpacity;
  return (
    <TouchableComponent
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      disabled={disabled}
      {...props}
    >
      { content }
    </TouchableComponent>
  );
}

const styles = StyleSheet.create({
  largeIcon: {
    width: 40,
    height: 40,
  },
  icon: {
    width: 32,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  check: {
    position: 'absolute',
    top: 2,
    right: 3,
  },
  largeCheck: {
    position: 'absolute',
    top: 3,
    right: 4,
  },
});

