import React from 'react';
import DialogComponent from 'react-native-dialog';

import { COLORS } from 'styles/colors';

interface Props {
  deckId: number;
  label: string;
  value: boolean;
  onValueChange: (deckId: number, value: boolean) => void;
}

export default class SelectDeckSwitch extends React.Component<Props> {
  _onValueChange = (value: boolean) => {
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
        trackColor={COLORS.switchTrackColor}
      />
    );
  }
}
