import React from 'react';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from '@data/types/Card';

interface Props {
  card: Card;
  width: number;
}

export default function SignatureCardItem({ card, width }: Props) {
  return (
    <TwoSidedCardComponent
      card={card}
      width={width}
      showBack
    />
  );
}
