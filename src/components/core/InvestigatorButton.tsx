import React, { useContext } from 'react';

import Card from '@data/types/Card';
import PickerStyleButton from './PickerStyleButton';
import StyleContext from '@styles/StyleContext';

interface Props {
  investigator: Card;
  value: string;
  widget?: 'shuffle' | 'nav';
  disabled?: boolean;
  onPress: (code: string) => void;
  hideName?: boolean;
}

export default function InvestigatorButton({
  investigator,
  value,
  widget,
  onPress,
  disabled,
  hideName,
}: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <PickerStyleButton
      title={hideName ? '' : investigator.name}
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
