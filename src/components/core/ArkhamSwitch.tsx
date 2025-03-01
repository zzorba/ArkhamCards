import React, { useCallback, useContext, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import COLORS from '@styles/colors';
import { ThemeColors } from '@styles/theme';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useEffectUpdate } from './hooks';

interface OwnProps {
  value: boolean;
  onValueChange?: (checked: boolean) => void;
  accessibilityLabel?: string;
  large?: boolean;
  color?: 'light' | 'dark';
  circleColor?: 'light'
  type?: 'radio';
  disabledColor?: string
  animateTouchOnly?: boolean;
}

type Props = OwnProps & Omit<TouchableOpacityProps, 'onValueChange' | 'style'>;
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
export default function ArkhamSwitch({ type, disabledColor, value: propValue, onValueChange, accessibilityLabel, disabled, large, color, circleColor, animateTouchOnly, ...props }: Props) {
  const { colors } = useContext(StyleContext);
  const [value, setValue] = useState(propValue);
  const onPress = useCallback(() => {
    if (type === 'radio' && value) {
      // Ignore it
      return;
    }
    if (onValueChange) {
      ReactNativeHapticFeedback.trigger(!value ? 'impactMedium' : 'impactLight');
      setValue(!value);
      setTimeout(() => onValueChange(!value), 0);
    }
  }, [value, type, onValueChange]);

  const theCircleColor = getCircleColor(value, color, circleColor, colors);
  const checkColor = getCheckColor(color, colors);
  const scale = useSharedValue(1);

  useEffectUpdate(() => {
    if (propValue !== value) {
      setValue(propValue);
      if (propValue) {
        if (!animateTouchOnly) {
          scale.value = withSequence(
            withTiming(1.15, { duration: 150, easing: Easing.elastic(2) }),
            withTiming(1, { duration: 100, easing: Easing.elastic(1) })
          );
        }
      }
    }
  }, [propValue]);
  const onPressIn = useCallback(() => {
    cancelAnimation(scale);
    scale.value = withSequence(
      withTiming(1.15, { duration: 150, easing: Easing.elastic(2) }),
      withTiming(1, { duration: 100, easing: Easing.elastic(1) })
    );
  }, [scale]);
  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <Pressable
      disabled={disabled || !onValueChange || (type === 'radio' && value)}
      onPressIn={onPressIn}
      onPress={onPress}
      unstable_pressDelay={50}
      hitSlop={4}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      {...props}
    >
      <Animated.View style={animStyle}>
        <View style={[styles.icon, large ? styles.largeIcon : undefined, { opacity: disabled && !disabledColor ? 1 : 1 }]}>
          <AppIcon
            size={large ? 34 : 28}
            name={large ? 'circle-thin' : 'check-circle'}
            color={disabled ? (disabledColor ?? colors.L20) : theCircleColor}
          />
          <View style={[large ? styles.largeCheck : styles.check, { opacity: !!value ? 1 : 0 }]}>
            <AppIcon
              size={large ? 26 : 20}
              name="check"
              color={disabled ? (disabledColor ?? colors.L15) : checkColor}
            />
          </View>
        </View>
      </Animated.View>
    </Pressable>
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

