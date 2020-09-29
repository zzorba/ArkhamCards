import React from 'react';
import {
  AccessibilityActionEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import { iconSizeScale } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { flatten } from 'lodash';

interface Props {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
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
    } = this.props;
    const size = (this.props.size || 36) * iconSizeScale;
    if (this.incrementEnabled()) {
      return (
        <TouchableOpacity onPress={onIncrement}>
          <MaterialCommunityIcons
            name={noFill ? 'plus-box-outline' : 'plus-box'}
            size={size}
            color={this.enabledColor()}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity disabled>
        { color === 'light' || color === 'white' ? (
          <View style={{ width: size, height: size }} />
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
    } = this.props;
    const atMax = max && (count === max);
    return !(count === null || atMax || disabled || disablePlus || max === 0);
  }

  decrementEnabled() {
    const {
      count,
      disabled,
      allowNegative,
      min,
    } = this.props;
    return (count > (min || 0) || allowNegative) && !disabled;
  }

  renderMinusButton() {
    const {
      noFill,
      onDecrement,
      color,
      hideDisabledMinus,
    } = this.props;
    const size = (this.props.size || 36) * iconSizeScale;
    if (this.decrementEnabled()) {
      return (
        <TouchableOpacity onPress={onDecrement}>
          <MaterialCommunityIcons
            name={noFill ? 'minus-box-outline' : 'minus-box'}
            size={size}
            color={this.enabledColor()}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity disabled>
        { color === 'light' || hideDisabledMinus ? (
          <View style={{ width: size, height: size }} />
        ) : (
          <MaterialCommunityIcons
            name="minus-box-outline"
            size={size}
            color={this.disabledColor()}
          />
        ) }
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
      onIncrement();
    } else if (event.nativeEvent.actionName === 'decrement') {
      onDecrement();
    }
  };

  render() {
    const { countRender, min, max, count } = this.props;
    return (
      <View
        style={this.props.style || styles.row}
        accessibilityValue={{ min, max, now: count }}
        accessibilityActions={this.accessibilityActions()}
        onAccessibilityAction={this._onAccessibilityAction}
      >
        { this.renderMinusButton() }
        { countRender }
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
});
