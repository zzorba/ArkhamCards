import React from 'react';

import CardTextComponent from 'components/card/CardTextComponent';
import CardFlavorTextComponent from 'components/card/CardFlavorTextComponent';

interface Props {
  text: string;
  flavor?: boolean;
}

export default function CampaignGuideTextComponent({ text, flavor }: Props) {
  if (flavor) {
    return (
      <CardFlavorTextComponent
        text={text.replace(/\n/g, '\n\n')}
        color="#222"
        fontAdjustment={1.25}
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
