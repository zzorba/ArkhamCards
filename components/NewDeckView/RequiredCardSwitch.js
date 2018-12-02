import React from 'react';
import PropTypes from 'prop-types';
import DialogComponent from 'react-native-dialog';

export default class RequiredCardSwitch extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onValueChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._onValueChange = this.onValueChange.bind(this);
  }

  onValueChange(value) {
    const {
      onValueChange,
      index,
    } = this.props;
    onValueChange(index, value);
  }

  render() {
    const {
      disabled,
      label,
      value,
    } = this.props;
    return (
      <DialogComponent.Switch
        disabled={disabled}
        label={label}
        value={value}
        onValueChange={this._onValueChange}
        onTintColor="#222222"
        tintColor="#bbbbbb"
      />
    );
  }
}
