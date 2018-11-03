import React from 'react';
import PropTypes from 'prop-types';
import DialogComponent from 'react-native-dialog';

export default class SelectDeckSwitch extends React.Component {
  static propTypes = {
    deckId: PropTypes.number.isRequired,
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
      deckId,
    } = this.props;
    onValueChange(deckId, value);
  }

  render() {
    const {
      label,
      value,
    } = this.props;
    return (
      <DialogComponent.Switch
        label={label}
        value={value}
        onValueChange={this._onValueChange}
        onTintColor="#222222"
        tintColor="#bbbbbb"
      />
    );
  }
}
