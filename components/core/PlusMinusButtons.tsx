import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

interface Props {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  limit?: number;
  style?: ViewStyle;
  size?: number;
  disabled?: boolean;
  color?: 'light' | 'dark';
  noFill?: boolean;
  allowNegative?: boolean;
}

export default class PlusMinusButtons extends React.PureComponent<Props> {
  disabledColor() {
    const {
      color,
    } = this.props;
    switch (color) {
      case 'dark': return '#888';
      case 'light': return '#aaa';
      default: return '#ddd';
    }
  }

  enabledColor() {
    const {
      color,
    } = this.props;
    switch (color) {
      case 'dark': return '#000';
      case 'light': return '#FFF';
      default: return '#888';
    }
  }

  renderPlusButton() {
    const {
      count,
      limit,
      size = 36,
      disabled,
      noFill,
      onIncrement,
    } = this.props;
    const atLimit = limit && (count === limit);
    if (count === null || atLimit || disabled || limit === 0) {
      return (
        <TouchableOpacity disabled>
          <MaterialCommunityIcons
            name="plus-box-outline"
            size={size}
            color={this.disabledColor()}
          />
        </TouchableOpacity>
      );
    }
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

  renderMinusButton() {
    const {
      count,
      size = 36,
      disabled,
      noFill,
      onDecrement,
      allowNegative,
    } = this.props;
    if ((count > 0 || allowNegative) && !disabled) {
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
        <MaterialCommunityIcons
          name="minus-box-outline"
          size={size}
          color={this.disabledColor()}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={this.props.style || styles.row}>
        { this.renderMinusButton() }
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
