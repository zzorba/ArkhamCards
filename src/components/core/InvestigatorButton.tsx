import React, { useContext } from 'react';

import Card from '@data/Card';
import PickerStyleButton from './PickerStyleButton';
import COLORS from '@styles/colors';
import StyleContext from '@styles/StyleContext';

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
  const { colors } = useContext(StyleContext);
  return (
    <PickerStyleButton
      title={investigator.name}
      value={value}
      id={investigator.code}
      onPress={onPress}
      disabled={disabled}
      colors={{
        backgroundColor: colors.faction[investigator.factionCode()].background,
        textColor: 'white',
      }}
      widget={widget}
    />
  );
}
