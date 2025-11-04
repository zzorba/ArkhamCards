import React from 'react';

import CardTextComponent from '@components/card/CardTextComponent';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import { StyleContextType } from '@styles/StyleContext';

interface Props {
  text: string;
  flavor?: boolean;
  sizeScale?: number;
  onLinkPress?: (url: string, context: StyleContextType) => void;
}

export default function CampaignGuideTextComponent({ text, flavor, sizeScale, onLinkPress }: Props) {
  if (flavor) {
    return (
      <CardFlavorTextComponent
        text={text.replace(/\n/g, '\n\n')}
        sizeScale={sizeScale || 1.1}
        onLinkPress={onLinkPress}
      />
    );
  }
  return (
    <CardTextComponent
      text={text.replace(/\n/g, '\n\n')}
      sizeScale={sizeScale || 1.1}
      onLinkPress={onLinkPress}
    />
  );
}
