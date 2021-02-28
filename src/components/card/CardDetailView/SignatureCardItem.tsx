import React from 'react';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from '@data/types/Card';

interface Props {
  componentId?: string;
  card: Card;
  width: number;
}

export default function SignatureCardItem({ card, componentId, width }: Props) {
  return (
    <TwoSidedCardComponent
      componentId={componentId}
      card={card}
      width={width}
    />
  );
}
