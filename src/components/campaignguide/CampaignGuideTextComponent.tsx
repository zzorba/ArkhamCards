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
        text={text}
        color="#222"
      />
    );
  }
  return (
    <CardTextComponent
      text={text}
    />
  );
}
