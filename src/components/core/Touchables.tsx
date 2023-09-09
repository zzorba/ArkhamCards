import React, { useCallback } from 'react';
import { GestureResponderEvent, Pressable, ViewStyle, PressableProps } from 'react-native';
import Animated, { AnimateStyle, cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

interface Props extends Omit<PressableProps, 'onPressIn' | 'onPressOut' | 'style' | 'disabled' | 'onPress'> {
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean | null;
  onPress?: (event: GestureResponderEvent) => void;
  children: null | React.ReactElement | (React.ReactElement | false)[];

  activeOpacity?: number;
  activeScale?: number;
}
export function TouchableOpacity({ style, children, disabled, onPress, activeOpacity = 0.2, ...otherProps }: Props) {
  const opacity = useSharedValue(1);
  const onPressIn = useCallback(() => {
    opacity.value = withTiming(activeOpacity, { duration: 100 });
  }, [opacity, activeOpacity]);
  const onPressOut = useCallback(() => {
    opacity.value = withTiming(1, { duration: 100 });
  }, [opacity]);
  return (
    <Pressable
      style={style}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      unstable_pressDelay={50}
      {...otherProps}
    >
      <Animated.View style={[style, { opacity }]}>
        { children }
      </Animated.View>
    </Pressable>
  )
}

export function TouchableQuickSize({ style, children, disabled, onPress, activeScale = 1.5, ...otherProps }: Props) {
  const scale = useSharedValue(1);
  const onPressIn = useCallback(() => {
    cancelAnimation(scale);
    scale.value = withSequence(
      withTiming(activeScale, { duration: 150, easing: Easing.elastic(2) }),
      withTiming(1, { duration: 100, easing: Easing.elastic(1) })
    );
  }, [activeScale, scale]);
  const animStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });
  return (
    <Pressable
      style={style}
      disabled={disabled}
      onPressIn={onPressIn}
      onPress={onPress}
      unstable_pressDelay={50}
      {...otherProps}
    >
      <Animated.View style={[style, animStyle]}>
        { children }
      </Animated.View>
    </Pressable>
  )
}


export function TouchableShrink({ style, children, disabled, onPress, activeScale = 0.98, ...otherProps }: Props) {
  const scale = useSharedValue(1);
  const onPressIn = useCallback(() => {
    cancelAnimation(scale);
    scale.value = withTiming(activeScale, { duration: 150, easing: Easing.elastic(2) });
  }, [activeScale, scale]);
  const onPressOut = useCallback(() => {
    cancelAnimation(scale);
    scale.value = withTiming(1, { duration: 100, easing: Easing.elastic(1) });
  }, [scale]);
  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <Pressable
      style={style}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      unstable_pressDelay={50}
      {...otherProps}
    >
      <Animated.View style={[style, animStyle]}>
        { children }
      </Animated.View>
    </Pressable>
  )
}