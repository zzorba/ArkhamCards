import React, { useCallback } from 'react';

import DeckButton from '@components/deck/controls/DeckButton';
import { s } from '@styles/space';

interface Props {
  index: number;
  icon: string;
  text: string;
  description?: string,
  onPress: (index: number) => void;
}

export default function BranchButton({ index, text, description, icon, onPress }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);
  return (
    <DeckButton
      color="dark_gray"
      title={text}
      detail={description}
      encounterIcon={icon}
      onPress={handleOnPress}
      bottomMargin={s}
      noShadow
    />
  );
}
