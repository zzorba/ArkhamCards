import React from 'react';
import DialogComponent from 'react-native-dialog';

import { COLORS } from 'styles/colors';

interface Props {
  index: number;
  disabled: boolean;
  label: string;
  value: boolean;
  onValueChange: (index: number, value: boolean) => void;
}

export default class RequiredCardSwitch extends React.Component<Props> {
  _onValueChange = (value: boolean) => {
    const {
      onValueChange,
      index,
    } = this.props;
    onValueChange(index, value);
  };

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
        trackColor={COLORS.switchTrackColor}
      />
    );
  }
}
