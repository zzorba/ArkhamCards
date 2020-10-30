import React from 'react';

import TextEntryComponent from './TextEntryComponent';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import { CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';
import Card from '@data/Card';

interface Props {
  crossedOut?: boolean;
  code: string;
  count: number;
  entry: CampaignLogEntry;
  text?: string;
  feminineText?: string;
}

export default function CampaignLogCardEntryComponent({ code, crossedOut, entry, text, count, feminineText }: Props) {
  return (
    <SingleCardWrapper
      code={code}
      type="encounter"
    >
      { (card: Card) => {
        const prompt: string | undefined = ((feminineText && !card.grammarGenderMasculine()) ? feminineText : text);
        return (
          <TextEntryComponent
            text={(prompt || '#name#').replace('#name#', card.name).replace('#X#', `${count}`)}
            crossedOut={crossedOut}
            entry={entry}
          />
        );
      } }
    </SingleCardWrapper>
  );
}
