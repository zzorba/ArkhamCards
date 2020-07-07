import React from 'react';
import { StyleSheet } from 'react-native';
import { SettingsSwitch } from 'react-native-settings-components';

import COLORS from 'styles/colors';

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
      <SettingsSwitch
        disabled={disabled}
        title={label}
        containerStyle={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: COLORS.divider }}
        disabledOverlayStyle={{ backgroundColor: 'transparent' }}
        value={value}
        onValueChange={this._onValueChange}
      />
    );
  }
}
