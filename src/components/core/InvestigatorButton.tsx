import React from 'react';

import Card from '@data/Card';
import PickerStyleButton from './PickerStyleButton';
import COLORS from '@styles/colors';

interface Props {
  investigator: Card;
  value: string;
  widget?: 'shuffle' | 'nav';
  disabled?: boolean;
  onPress: (code: string) => void;
}

export default function InvestigatorButton({
  investigator,
  value,
  widget,
  onPress,
  disabled,
}: Props) {
  return (
    <PickerStyleButton
      title={investigator.name}
      value={value}
      id={investigator.code}
      onPress={onPress}
      disabled={disabled}
      colors={{
        backgroundColor: COLORS.faction[investigator.factionCode()].background,
        textColor: 'white',
      }}
      widget={widget}
    />
  );
}
