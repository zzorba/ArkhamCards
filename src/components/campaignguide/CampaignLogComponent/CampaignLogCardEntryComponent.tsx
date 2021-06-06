import React from 'react';

import TextEntryComponent from './TextEntryComponent';
import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import useSingleCard from '@components/card/useSingleCard';

interface Props {
  crossedOut?: boolean;
  code: string;
  count: number;
  entry: CampaignLogEntry;
  text?: string;
  feminineText?: string;
}

export default function CampaignLogCardEntryComponent({ code, crossedOut, entry, text, count, feminineText }: Props) {
  const [card] = useSingleCard(code, 'encounter');
  if (!card) {
    return null;
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
