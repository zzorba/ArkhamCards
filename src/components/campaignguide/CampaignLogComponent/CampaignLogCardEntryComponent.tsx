import React, { useContext } from 'react';
import TextEntryComponent from './TextEntryComponent';
import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import { ActivityIndicator } from 'react-native';
import CampaignGuideContext from '../CampaignGuideContext';

interface Props {
  crossedOut?: boolean;
  code: string;
  count: number;
  entry: CampaignLogEntry;
  text?: string;
  feminineText?: string;
}

export default function CampaignLogCardEntryComponent({ code, crossedOut, entry, text, count, feminineText }: Props) {
  const { colors } = useContext(StyleContext);
  const { campaignGuide } = useContext(CampaignGuideContext);
  const [card] = useSingleCard(code, 'encounter');
  const fixedCard = campaignGuide.card(code);
  if (!card && !fixedCard) {
    return <ActivityIndicator animating size="small" color={colors.lightText} />;
  }
  const female = (card && !card.grammarGenderMasculine()) || (fixedCard && fixedCard.gender === 'female');
  const prompt: string | undefined = ((feminineText && female) ? feminineText : text);
  return (
    <TextEntryComponent
      text={(prompt || '#name#').replace('#name#', card?.name || fixedCard?.name || '').replace('#X#', `${count}`)}
      crossedOut={crossedOut}
      entry={entry}
    />
  );
}
