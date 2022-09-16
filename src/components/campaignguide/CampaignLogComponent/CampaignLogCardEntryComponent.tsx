import React, { useContext } from 'react';
import TextEntryComponent from './TextEntryComponent';
import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import { ActivityIndicator } from 'react-native';
import CampaignGuideContext from '../CampaignGuideContext';
import { Gender_Enum } from '@generated/graphql/apollo-schema';

interface Props {
  crossedOut?: boolean;
  code: string;
  count: number;
  entry: CampaignLogEntry;
  text?: string;
  feminineText?: string;
  nonBinaryText?: string;
}

export default function CampaignLogCardEntryComponent({ code, crossedOut, entry, text, count, feminineText, nonBinaryText }: Props) {
  const { colors } = useContext(StyleContext);
  const { campaignGuide } = useContext(CampaignGuideContext);
  const [card] = useSingleCard(code, 'encounter');
  const fixedCard = campaignGuide.card(code);
  if (!card && !fixedCard) {
    return <ActivityIndicator animating size="small" color={colors.lightText} />;
  }
  let prompt: string = text || '#name#';
  if (feminineText && card?.gender === Gender_Enum.F) {
    prompt = feminineText;
  } else if (nonBinaryText && card?.gender === Gender_Enum.Nb) {
    prompt = nonBinaryText;
  }
  return (
    <TextEntryComponent
      text={prompt.replace('#name#', card?.name || fixedCard?.name || '').replace('#X#', `${count}`)}
      crossedOut={crossedOut}
      entry={entry}
    />
  );
}
