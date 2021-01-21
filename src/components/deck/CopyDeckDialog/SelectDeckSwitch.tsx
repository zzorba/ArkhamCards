import React, { useCallback } from 'react';
import DialogComponent from '@lib/react-native-dialog';

import COLORS from '@styles/colors';
import { DeckId } from '@actions/types';

interface Props {
  deckId: DeckId;
  label: string;
  value: boolean;
  onValueChange: (deckId: DeckId, value: boolean) => void;
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
