import React, { useContext, useMemo, useCallback } from 'react';
import {
  AccessibilityActionEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { flatten } from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableQuickSize, TouchableOpacity } from '@components/core/Touchables';
import { xs } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  count: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  max?: number;
  min?: number;
  style?: ViewStyle;
  large?: boolean;
  size?: number;
  disabled?: boolean;
  disablePlus?: boolean;
  color?: 'light' | 'dark' | 'white';
  noFill?: boolean;
  allowNegative?: boolean;
  countRender?: React.ReactNode;
  hideDisabledMinus?: boolean;
  dialogStyle?: boolean;
  rounded?: boolean;
  showZeroCount?: boolean;
  showMax?: boolean;
}

export default function PlusMinusButtons({
  count,
  onIncrement,
  onDecrement,
  max,
  min,
  style,
  size = 36,
  disabled,
  disablePlus,
  color,
  noFill,
  allowNegative,
  countRender,
  hideDisabledMinus,
  dialogStyle,
  rounded,
  showZeroCount,
  large,
  showMax,
}: Props
) {
  const { colors, typography } = useContext(StyleContext);
  const incrementEnabled = !!(!(count === null || (max && (count === max)) || disabled || disablePlus || max === 0) && onIncrement);
  const decrementEnabled = !!((count > (min || 0) || allowNegative) && !disabled && !!onDecrement);
  const disabledColor = useMemo(() => {
    switch (color) {
      case 'dark': return colors.lightText;
      case 'light': return colors.lightText;
      case 'white': return 'white';
      default: return colors.M;
    }
  }, [colors, color]);
  const roundedColor = useMemo(() => {
    return color === 'light' ? '#39485240' : colors.L15;
  }, [color, colors]);
  const enabledColor = useMemo(() => {
    if (dialogStyle) {
      if (rounded) {
        switch (color) {
          case 'light':
            return colors.L30;
          case 'dark':
          default:
            return colors.D10;
          case 'white':
            return 'red';
        }
      }
      return colors.M;
    }
    switch (color) {
      case 'dark': return colors.darkText;
      case 'light': return colors.background;
      case 'white': return 'white';
      default: return colors.lightText;
    }
  }, [color, rounded, dialogStyle, colors]);

  const plusButton = useMemo(() => {
    const width = rounded ? 40 : size * 0.8;
    if (!incrementEnabled && (color === 'light' || color === 'white')) {
      return (
        <View style={dialogStyle ? { width, height: width } : undefined} />
      );
    }
    return (
      <TouchableQuickSize disabled={!incrementEnabled} onPress={onIncrement} hitSlop={4} activeScale={rounded ? 1.1 : 1.3}>
        <View style={[
          dialogStyle ? { width, height: width } : undefined,
          rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: incrementEnabled ? roundedColor : undefined } : undefined,
        ]}>
          { dialogStyle ? (
            <View opacity={incrementEnabled ? 1 : 0.3}>
              <AppIcon
                name="plus-button"
                size={rounded || large ? 36 : 28}
                color={incrementEnabled ? enabledColor : colors.M}
              />
            </View>
          ) : (
            <MaterialCommunityIcons
              name={!incrementEnabled || noFill ? 'plus-box-outline' : 'plus-box'}
              size={size}
              color={incrementEnabled ? enabledColor : disabledColor}
            />
          ) }
        </View>
      </TouchableQuickSize>
    );
  }, [large, onIncrement, noFill, color, dialogStyle, rounded, size, disabledColor, enabledColor, roundedColor, incrementEnabled, colors]);

  const minusButton = useMemo(() => {
    const width = rounded ? 40 : size * 0.8;
    if (!decrementEnabled && (color === 'light' || hideDisabledMinus)) {
      return (
        <View style={dialogStyle ? { width, height: width } : undefined} />
      );
    }
    return (
      <TouchableQuickSize disabled={!decrementEnabled} onPress={onDecrement} hitSlop={4} activeScale={rounded ? 1.1 : 1.3}>
        <View style={[
          dialogStyle ? { width, height: width } : undefined,
          rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: decrementEnabled ? roundedColor : undefined } : undefined,
        ]}>
          { dialogStyle ? (
            <View opacity={decrementEnabled ? 1 : 0.3}>
              <AppIcon
                name="minus-button"
                size={rounded || large ? 36 : 28}
                color={decrementEnabled ? enabledColor : colors.M}
              />
            </View>
          ) : (
            <MaterialCommunityIcons
              name={!decrementEnabled || noFill ? 'minus-box-outline' : 'minus-box'}
              size={size}
              color={decrementEnabled ? enabledColor : disabledColor}
            />
          )}
        </View>
      </TouchableQuickSize>
    );
  }, [onDecrement, large, noFill, color, hideDisabledMinus, dialogStyle, rounded, size, decrementEnabled, enabledColor, disabledColor, roundedColor, colors]);

  const accessibilityActions = useMemo(() => {
    return flatten([
      decrementEnabled ? [{ name: 'decrement' }] : [],
      incrementEnabled ? [{ name: 'increment' }] : [],
    ]);
  }, [decrementEnabled, incrementEnabled]);

  const onAccessibilityAction = useCallback((event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === 'increment') {
      onIncrement && onIncrement();
    } else if (event.nativeEvent.actionName === 'decrement') {
      onDecrement && onDecrement();
    }
  }, [onIncrement, onDecrement]);

  const countBlock = useMemo(() => {
    if (countRender) {
      return countRender;
    }
    if (dialogStyle) {
      if (!showZeroCount && count === 0) {
        return null;
      }
      if (rounded) {
        return (
          <Text style={[typography.counter, typography.center, { minWidth: 28 }]}>
            { count }
          </Text>
        );
      }
      return (
        <View style={styles.count}>
          <Text style={typography.menuText}>
            { allowNegative && count >= 0 ? `+${count}` : count }
            { showMax && max ? `/${max}` : ''}
          </Text>
        </View>
      );
    }
    return null;
  }, [countRender, showMax, max, rounded, count, dialogStyle, allowNegative, showZeroCount, typography]);

  return (
    <View
      style={style || styles.row}
      accessibilityValue={{ min, max, now: count }}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
    >
      { minusButton }
      { countBlock }
      { plusButton }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  count: {
    minWidth: 32,
    paddingRight: xs,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
