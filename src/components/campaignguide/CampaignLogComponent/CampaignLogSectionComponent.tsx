import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { map } from 'lodash';

import CampaignLogCardEntryComponent from './CampaignLogCardEntryComponent';
import TextEntryComponent from './TextEntryComponent';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { EntrySection, CampaignLogEntry } from '@data/scenario/GuidedCampaignLog';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: EntrySection;
}

export default function CampaignLogSectionComponent({ sectionId, campaignGuide, section }: Props) {
  const renderEntry = useCallback((entry: CampaignLogEntry) => {
    if (entry.type === 'freeform') {
      return (
        <TextEntryComponent
          text={entry.text}
          crossedOut={false}
          entry={entry}
        />
      );
    }
    const logEntry = campaignGuide.logEntry(sectionId, entry.id);
    const crossedOut = section.crossedOut[entry.id];
    const decoration = (section.decoration || {})[entry.id];
    switch (logEntry.type) {
      case 'supplies': {
        if (entry.type !== 'count') {
          return null;
        }
        if (logEntry.supply.multiple) {
          if (entry.count === 0) {
            return null;
          }
          return (
            <TextEntryComponent
              text={`${logEntry.supply.name}: #X#`}
              entry={entry}
            />
          );
        }
        if (entry.count === 0 && !crossedOut) {
          return null;
        }
        return (
          <TextEntryComponent
            text={logEntry.supply.name}
            crossedOut={crossedOut}
            entry={entry}
          />
        );
      }
      case 'text':
        if (entry.type === 'card') {
          return map(entry.cards, (card, idx) => (
            <CampaignLogCardEntryComponent
              key={idx}
              code={card.card}
              count={card.count}
              entry={entry}
              text={logEntry.text}
              crossedOut={crossedOut}
            />
          ));
        }
        return (
          <TextEntryComponent
            text={logEntry.text}
            crossedOut={crossedOut}
            entry={entry}
            decoration={decoration}
          />
        );
      case 'section_count':
        return (
          <Text>section count</Text>
        );
      case 'card':
        return (
          <CampaignLogCardEntryComponent
            code={logEntry.code}
            count={1}
            entry={entry}
            crossedOut={crossedOut}
          />
        );
    }
  }, [sectionId, campaignGuide, section]);

  return (
    <>
      { map(section.entries, (entry, idx) => (
        <View key={`${entry.id}_${idx}`}>
          { renderEntry(entry) }
        </View>
      )) }
    </>
  );
}
