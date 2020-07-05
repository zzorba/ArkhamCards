import React from 'react';

import CardTextComponent from 'components/card/CardTextComponent';
import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';
import COLORS from 'styles/colors';

interface Props {
  text: string;
  flavor?: boolean;
}

export default function CampaignGuideTextComponent({ text, flavor }: Props) {
  if (flavor) {
    return (
      <CardFlavorTextComponent
        text={text.replace(/\n/g, '\n\n')}
        color={COLORS.darkText}
        fontAdjustment={1.1}
      />
    );
  }
  return (
    <CardTextComponent
      text={text.replace(/\n/g, '\n\n')}
      fontAdjustment={1.1}
    />
  );
}
