import React, { useCallback } from 'react';

import { BinaryConditionalChoice } from '@data/scenario/types';
import DeckButton from '@components/deck/controls/DeckButton';
import { s } from '@styles/space';

interface Props {
  index: number;
  icon: string;
  choice: BinaryConditionalChoice;
  onPress: (index: number) => void;
}

export default function BranchButton({ index, choice, icon, onPress }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);
  return (
    <DeckButton
      color="dark_gray"
      title={choice.text}
      encounterIcon={icon}
      onPress={handleOnPress}
      bottomMargin={s}
    />
  );
}
