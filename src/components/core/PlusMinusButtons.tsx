import React, { useContext, useMemo, useCallback } from 'react';
import {
  AccessibilityActionEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { TouchableOpacity as GestureHandlerTouchableOpacity } from 'react-native-gesture-handler';
import { flatten } from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  useGestureHandler?: boolean;
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
  useGestureHandler,
}: Props
) {
  const Touchable = useGestureHandler ? GestureHandlerTouchableOpacity : TouchableOpacity;
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
    if (incrementEnabled) {
      return (
        <Touchable onPress={onIncrement}>
          <View
            style={[
              dialogStyle ? { width, height: width } : undefined,
              rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: roundedColor } : undefined,
            ]}
          >
            { dialogStyle ? (
              <AppIcon
                name="plus-button"
                size={rounded ? 36 : 28}
                color={enabledColor}
              />
            ) : (
              <MaterialCommunityIcons
                name={noFill ? 'plus-box-outline' : 'plus-box'}
                size={size}
                color={enabledColor}
              />
            ) }
          </View>
        </Touchable>
      );
    }

    if (color === 'light' || color === 'white') {
      return (
        <View style={dialogStyle ? { width, height: width } : undefined} />
      );
    }
    return (
      <Touchable disabled>
        <View style={[
          dialogStyle ? { width, height: width } : undefined,
          rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20 } : undefined,
        ]}>
          { dialogStyle ? (
            <View opacity={0.3}>
              <AppIcon
                name="plus-button"
                size={rounded ? 36 : 28}
                color={colors.M}
              />
            </View>
          ) : (
            <MaterialCommunityIcons
              name="plus-box-outline"
              size={size}
              color={disabledColor}
            />
          ) }
        </View>
      </Touchable>
    );
  }, [Touchable, onIncrement, noFill, color, dialogStyle, rounded, size, disabledColor, enabledColor, roundedColor, incrementEnabled, colors]);

  const minusButton = useMemo(() => {
    const width = rounded ? 40 : size * 0.8;
    if (decrementEnabled) {
      return (
        <Touchable onPress={onDecrement}>
          <View style={[
            dialogStyle ? { width, height: width } : undefined,
            rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: roundedColor } : undefined,
          ]}>
            { dialogStyle ? (
              <AppIcon
                name="minus-button"
                size={rounded ? 36 : 28}
                color={enabledColor}
              />
            ) : (
              <MaterialCommunityIcons
                name={noFill ? 'minus-box-outline' : 'minus-box'}
                size={size}
                color={enabledColor}
              />
            ) }
          </View>
        </Touchable>
      );
    }
    if (color === 'light' || hideDisabledMinus) {
      return (
        <View style={dialogStyle ? { width, height: width } : undefined} />
      );
    }
    return (
      <Touchable disabled>
        <View style={[
          dialogStyle ? { width, height: width } : undefined,
          rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20 } : undefined,
        ]}>
          { dialogStyle ? (
            <View opacity={0.3}>
              <AppIcon
                name="minus-button"
                size={rounded ? 36 : 28}
                color={colors.M}
              />
            </View>
          ) : (
            <MaterialCommunityIcons
              name="minus-box-outline"
              size={size}
              color={disabledColor}
            />
          )}
        </View>
      </Touchable>
    );
  }, [Touchable, onDecrement, noFill, color, hideDisabledMinus, dialogStyle, rounded, size, decrementEnabled, enabledColor, disabledColor, roundedColor, colors]);

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
          <Text style={typography.menuText}>{ allowNegative && count >= 0 ? `+${count}` : count } </Text>
        </View>
      );
    }
    return null;
  }, [countRender, rounded, count, dialogStyle, allowNegative, showZeroCount, typography]);

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
