import React from 'react';

import CardTextComponent from '@components/card/CardTextComponent';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import COLORS from '@styles/colors';

interface Props {
  text: string;
  flavor?: boolean;
  color?: string;
}

export default function CampaignGuideTextComponent({ text, flavor, color }: Props) {
  if (flavor) {
    return (
      <CardFlavorTextComponent
        text={text.replace(/\n/g, '\n\n')}
        color={color || COLORS.darkText}
        fontAdjustment={1.1}
      />
    );
  }
  return (
    <CardTextComponent
      text={text.replace(/\n/g, '\n\n')}
      fontAdjustment={1.1}
      color={color}
    />
  );
}
