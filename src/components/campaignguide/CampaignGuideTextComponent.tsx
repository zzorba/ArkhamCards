import React, { useContext } from 'react';

import CardTextComponent from '@components/card/CardTextComponent';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import StyleContext from '@styles/StyleContext';

interface Props {
  text: string;
  flavor?: boolean;
}

export default function CampaignGuideTextComponent({ text, flavor }: Props) {
  const { colors } = useContext(StyleContext);
  if (flavor) {
    return (
      <CardFlavorTextComponent
        text={text.replace(/\n/g, '\n\n')}
        color={colors.darkText}
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
