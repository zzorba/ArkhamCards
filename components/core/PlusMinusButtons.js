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
    onChange: PropTypes.func.isRequired,
    limit: PropTypes.number,
    style: ViewPropTypes.style,
    size: PropTypes.number,
    disabled: PropTypes.bool,
    dark: PropTypes.bool,
    noFill: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._increment = this.increment.bind(this);
    this._decrement = this.decrement.bind(this);
  }

  increment() {
    const {
      count,
      onChange,
    } = this.props;
    onChange(count + 1);
  }

  decrement() {
    const {
      count,
      onChange,
    } = this.props;
    onChange(count - 1);
  }

  renderPlusButton() {
    const {
      count,
      limit,
      size = 36,
      dark,
      disabled,
      noFill,
    } = this.props;
    const atLimit = limit && (count === limit);
    if (count === null || atLimit || disabled) {
      return (
        <TouchableOpacity disabled>
          <MaterialCommunityIcons
            name="plus-box-outline"
            size={size}
            color={dark ? '#888' : '#ddd'}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={this._increment}>
        <MaterialCommunityIcons
          name={noFill ? 'plus-box-outline' : 'plus-box'}
          size={size}
          color={dark ? '#000' : '#888'}
        />
      </TouchableOpacity>
    );
  }

  renderMinusButton() {
    const {
      count,
      size = 36,
      dark,
      disabled,
      noFill,
    } = this.props;
    if (count > 0 && !disabled) {
      return (
        <TouchableOpacity onPress={this._decrement}>
          <MaterialCommunityIcons
            name={noFill ? 'minus-box-outline' : 'minus-box'}
            size={size}
            color={dark ? '#000' : '#888'}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity disabled>
        <MaterialCommunityIcons
          name="minus-box-outline"
          size={size}
          color={dark ? '#888' : '#ddd'}
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
