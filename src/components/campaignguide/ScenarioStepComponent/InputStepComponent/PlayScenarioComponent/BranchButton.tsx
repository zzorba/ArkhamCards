import React, { useCallback } from 'react';

import DeckButton from '@components/deck/controls/DeckButton';
import { s } from '@styles/space';

interface Props {
  index: number;
  icon: string;
  text: string;
  onPress: (index: number) => void;
}

export default function BranchButton({ index, text, icon, onPress }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);
  return (
    <DeckButton
      color="dark_gray"
      title={text}
      encounterIcon={icon}
      onPress={handleOnPress}
      bottomMargin={s}
      noShadow
    />
  );
}
