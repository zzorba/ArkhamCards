import React, { useCallback } from 'react';
import DialogComponent from '@lib/react-native-dialog';

import COLORS from '@styles/colors';

interface Props {
  deckId: number;
  label: string;
  value: boolean;
  onValueChange: (deckId: number, value: boolean) => void;
}

export default function SelectDeckSwitch({ deckId, label, value, onValueChange }: Props) {
  const handleOnValueChange = useCallback((value: boolean) => {
    onValueChange(deckId, value);
  }, [onValueChange, deckId]);

  return (
    <DialogComponent.Switch
      label={label}
      value={value}
      onValueChange={handleOnValueChange}
      trackColor={COLORS.switchTrackColor}
    />
  );
}
