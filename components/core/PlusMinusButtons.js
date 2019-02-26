import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

export default class PlusMinusButtons extends React.PureComponent {
  static propTypes = {
    count: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired,
    limit: PropTypes.number,
    style: ViewPropTypes.style,
    size: PropTypes.number,
    disabled: PropTypes.bool,
    dark: PropTypes.bool,
    noFill: PropTypes.bool,
  };

  disabledColor() {
    const {
      dark,
    } = this.props;
    return dark ? '#888' : '#ddd';
  }

  enabledColor() {
    const {
      dark,
    } = this.props;
    return dark ? '#000' : '#888';
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
    if (count === null || atLimit || disabled) {
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
    } = this.props;
    if (count > 0 && !disabled) {
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
