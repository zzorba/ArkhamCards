import React from 'react';
import {
  AccessibilityActionEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { flatten } from 'lodash';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { xs } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

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
}

export default class PlusMinusButtons extends React.PureComponent<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  disabledColor() {
    const {
      color,
    } = this.props;
    const { colors } = this.context;
    switch (color) {
      case 'dark': return colors.lightText;
      case 'light': return colors.lightText;
      case 'white': return 'white';
      default: return colors.M;
    }
  }

  enabledColor() {
    const {
      color,
    } = this.props;
    const { colors } = this.context;
    switch (color) {
      case 'dark': return colors.darkText;
      case 'light': return colors.background;
      case 'white': return 'white';
      default: return colors.lightText;
    }
  }

  renderPlusButton() {
    const {
      noFill,
      onIncrement,
      color,
      dialogStyle,
      rounded,
    } = this.props;
    const { colors } = this.context;
    const size = (this.props.size || 36);
    const width = rounded ? 40 : size * 0.8;
    if (this.incrementEnabled()) {
      return (
        <TouchableOpacity
          onPress={onIncrement}
          style={[
            dialogStyle ? { width, height: width } : undefined,
            rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: colors.L15 } : undefined,
          ]}
        >
          { dialogStyle ? (
            <AppIcon
              name="plus-button"
              size={rounded ? 36 : 28}
              color={rounded ? colors.D10 : colors.M}
            />
          ) : (
            <MaterialCommunityIcons
              name={noFill ? 'plus-box-outline' : 'plus-box'}
              size={size}
              color={this.enabledColor()}
            />
          ) }
        </TouchableOpacity>
      );
    }

    if (color === 'light' || color === 'white') {
      return (
        <View style={dialogStyle ? { width, height: width } : undefined} />
      );
    }
    return (
      <TouchableOpacity
        disabled
        style={[
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
            color={this.disabledColor()}
          />
        ) }
      </TouchableOpacity>
    );
  }

  incrementEnabled() {
    const {
      count,
      max,
      disabled,
      disablePlus,
      onIncrement,
    } = this.props;
    const atMax = max && (count === max);
    return !(count === null || atMax || disabled || disablePlus || max === 0) && onIncrement;
  }

  decrementEnabled() {
    const {
      count,
      disabled,
      allowNegative,
      min,
      onDecrement,
    } = this.props;
    return (count > (min || 0) || allowNegative) && !disabled && !!onDecrement;
  }

  renderMinusButton() {
    const {
      noFill,
      onDecrement,
      color,
      hideDisabledMinus,
      dialogStyle,
      rounded,
    } = this.props;
    const { colors } = this.context;
    const size = (this.props.size || 36);
    const width = rounded ? 40 : size * 0.8;
    if (this.decrementEnabled()) {
      return (
        <TouchableOpacity
          onPress={onDecrement}
          style={[
            dialogStyle ? { width, height: width } : undefined,
            rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: colors.L15 } : undefined,
          ]}
        >
          { dialogStyle ? (
            <AppIcon
              name="minus-button"
              size={rounded ? 36 : 28}
              color={rounded ? colors.D10 : colors.M}
            />
          ) : (
            <MaterialCommunityIcons
              name={noFill ? 'minus-box-outline' : 'minus-box'}
              size={size}
              color={this.enabledColor()}
            />
          ) }
        </TouchableOpacity>
      );
    }
    if (color === 'light' || hideDisabledMinus) {
      return (
        <View style={dialogStyle ? { width, height: width } : undefined} />
      );
    }
    return (
      <TouchableOpacity
        disabled
        style={[
          dialogStyle ? { width, height: width } : undefined,
          rounded ? { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 20 } : undefined,
        ]}
      >
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
            color={this.disabledColor()}
          />
        )}

      </TouchableOpacity>
    );
  }

  accessibilityActions() {
    return flatten([
      this.decrementEnabled() ? [{ name: 'decrement' }] : [],
      this.incrementEnabled() ? [{ name: 'increment' }] : [],
    ]);
  }

  _onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const { onIncrement, onDecrement } = this.props;
    if (event.nativeEvent.actionName === 'increment') {
      onIncrement && onIncrement();
    } else if (event.nativeEvent.actionName === 'decrement') {
      onDecrement && onDecrement();
    }
  };

  countBlock() {
    const { countRender, count, dialogStyle, allowNegative, showZeroCount } = this.props;
    const { typography } = this.context;
    if (countRender) {
      return countRender;
    }
    if (dialogStyle) {
      if (!showZeroCount && count === 0) {
        return null;
      }
      return (
        <View style={styles.count}>
          <Text style={typography.menuText}>{ allowNegative && count >= 0 ? `+${count}` : count } </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const { min, max, count } = this.props;
    return (
      <View
        style={this.props.style || styles.row}
        accessibilityValue={{ min, max, now: count }}
        accessibilityActions={this.accessibilityActions()}
        onAccessibilityAction={this._onAccessibilityAction}
      >
        { this.renderMinusButton() }
        { this.countBlock() }
        { this.renderPlusButton() }
      </View>
    );
  }
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
