import React from 'react';

import SettingsSwitch from '@components/core/SettingsSwitch';

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
        value={value}
        onValueChange={this._onValueChange}
        settingsStyle
      />
    );
  }
}
