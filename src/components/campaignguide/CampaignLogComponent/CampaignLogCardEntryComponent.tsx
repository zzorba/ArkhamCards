import React, { useContext } from 'react';
import TextEntryComponent from './TextEntryComponent';
import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import useSingleCard from '@components/card/useSingleCard';
import StyleContext from '@styles/StyleContext';
import { ActivityIndicator } from 'react-native';

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
  const [card] = useSingleCard(code, 'encounter');
  if (!card) {
    return <ActivityIndicator animating size="small" color={colors.lightText} />;
  }
  const prompt: string | undefined = ((feminineText && !card.grammarGenderMasculine()) ? feminineText : text);
  return (
    <TextEntryComponent
      text={(prompt || '#name#').replace('#name#', card.name).replace('#X#', `${count}`)}
      crossedOut={crossedOut}
      entry={entry}
    />
  );
}
