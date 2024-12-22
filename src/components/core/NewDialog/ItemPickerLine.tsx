import React, { useContext, useCallback, ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import StyleContext from '@styles/StyleContext';
import ArkhamSwitch from '../ArkhamSwitch';
import LineItem from './LineItem';

interface Props<T> {
  iconName?: string;
  iconNode?: ReactNode;
  rightNode?: ReactNode;
  text: string;
  disabled?: boolean;
  description?: string;
  value: T;
  onValueChange: (value: T) => void;
  selected: boolean;
  last: boolean;
  indicator?: 'check' | 'radio' | 'none';
}
export default function ItemPickerLine<T>({ iconName, iconNode, disabled, text, description, rightNode, selected, last, value, indicator = 'radio', onValueChange }: Props<T>) {
  const { colors } = useContext(StyleContext);
  const onPress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onValueChange(value);
  }, [onValueChange, value]);
  const scale = useSharedValue(1);
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
    <Pressable onPress={onPress} onPressIn={onPressIn} disabled={disabled}>
      <LineItem
        iconName={iconName}
        iconNode={iconNode}
        rightNode={rightNode}
        indicatorNode={indicator !== 'none' && (
          indicator === 'radio' ? (
            <Animated.View style={[styles.circle, { borderColor: disabled ? colors.L20 : colors.L10 }, animStyle]}>
              { !!selected && <View style={[styles.circleFill, { backgroundColor: colors.M }]} />}
            </Animated.View>
          ) : (
            <ArkhamSwitch value={selected} color="dark" />
          )
        ) || undefined}
        text={text}
        disabled={disabled}
        description={description}
        last={last}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
  },
  circleFill: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
