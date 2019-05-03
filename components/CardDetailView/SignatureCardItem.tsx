import React from 'react';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from '../../data/Card';

interface Props {
  componentId: string;
  card: Card;
}

export default function SignatureCardItem({ card, componentId }: Props) {
  return (
    <TwoSidedCardComponent
      componentId={componentId}
      card={card}
    />
  );
}
