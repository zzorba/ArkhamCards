import React, { useCallback } from 'react';

import Card from '@data/types/Card';
import { TouchableOpacity } from 'react-native';
import InvestigatorImage from './InvestigatorImage';

interface Props {
  card?: Card;
  size?: 'large' | 'small' | 'tiny';
  yithian?: boolean;
  selected: boolean;
  onPress: (code: string) => void;
  disabled?: boolean;
}

export default function InvestigatorImageButton({ card, size, yithian, selected, onPress, disabled }: Props) {
  const onButtonPress = useCallback(() => card && onPress(card?.code), [card, onPress]);

  return (
    <TouchableOpacity onPress={onButtonPress} disabled={disabled}>
      <InvestigatorImage
        border={selected}
        card={card}
        size={size}
        yithian={yithian}
        killedOrInsane={!selected}
      />
    </TouchableOpacity>
  );
}

