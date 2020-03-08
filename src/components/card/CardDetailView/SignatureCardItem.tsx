import React from 'react';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import Card from 'data/Card';

interface Props {
  componentId?: string;
  card: Card;
  width: number;
  fontScale: number;
}

export default function SignatureCardItem({ card, componentId, width, fontScale }: Props) {
  return (
    <TwoSidedCardComponent
      componentId={componentId}
      fontScale={fontScale}
      card={card}
      width={width}
    />
  );
}
