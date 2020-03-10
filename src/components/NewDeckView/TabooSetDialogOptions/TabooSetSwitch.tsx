import React from 'react';
import DialogComponent from 'react-native-dialog';

import { COLORS } from 'styles/colors';

interface Props {
  tabooId: number;
  label: string;
  value: boolean;
  onValueChange: (tabooId: number, value: boolean) => void;
}

export default class TabooSetSwitch extends React.Component<Props> {
  _onValueChange = (value: boolean) => {
    const {
      onValueChange,
      tabooId,
    } = this.props;
    onValueChange(tabooId, value);
  };

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
        trackColor={COLORS.switchTrackColor}
      />
    );
  }
}
