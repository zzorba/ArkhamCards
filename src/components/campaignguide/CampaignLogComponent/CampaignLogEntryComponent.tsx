import React, { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { filter, map } from 'lodash';

import { CampaignLogEntry, CampaignLogFreeformEntry, EntrySection } from '@data/scenario/GuidedCampaignLog';
import TextEntryComponent from './TextEntryComponent';
import CampaignLogCardEntryComponent from './CampaignLogCardEntryComponent';
import CampaignGuide from '@data/scenario/CampaignGuide';
import CampaignGuideContext from '../CampaignGuideContext';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  entry: CampaignLogEntry;
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: EntrySection;
  interScenarioId?: string;
  title?: string;
  first: boolean;
  last: boolean;
}

function FreeFormCampaignLogEntryComponent({ entry, interScenarioId }: { entry: CampaignLogFreeformEntry, interScenarioId?: string }) {
  const { colors } = useContext(StyleContext);
  const { campaignState } = useContext(CampaignGuideContext);
  const [deleting, setDeleting] = useState(false);
  const onDelete = useCallback(() => {
    if (interScenarioId && entry.interScenario) {
      const indexToRemove = entry.interScenario.index;
      const entries = filter(campaignState.interScenarioCampaignLogEntries(interScenarioId), (e, idx) => idx !== indexToRemove);
      setDeleting(true);
      setTimeout(() => {
        campaignState.setInterScenarioCampaignLogEntries(entries, interScenarioId);
      }, 50);
    }
  }, [campaignState, interScenarioId, entry.interScenario]);
  if (interScenarioId && entry.interScenario?.scenarioId === interScenarioId) {
    return (
      <TextEntryComponent
        text={entry.text}
        crossedOut={false}
        entry={entry}
        button={(
          <TouchableOpacity onPress={onDelete}>
            { deleting ? (
              <ActivityIndicator
                color={colors.D20}
                size="small"
                animating
              />
            ) : (<AppIcon name="trash" size={24} color={colors.D30} />)}
          </TouchableOpacity>
        )}
      />
    );
  }
  return (
    <TextEntryComponent
      text={entry.text}
      crossedOut={false}
      entry={entry}
    />
  );
}

export default function CampaignLogEntryComponent({ entry, interScenarioId, campaignGuide, section, sectionId, title, first, last }: Props) {
  if (entry.type === 'freeform') {
    return <FreeFormCampaignLogEntryComponent entry={entry} interScenarioId={interScenarioId} />;
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
            icon={sectionId === 'supplies' ? entry.id : undefined}
            text={`${title || logEntry.supply.name}: #X#`}
            entry={entry}
          />
        );
      }
      if (entry.count === 0 && !crossedOut) {
        return null;
      }
      return (
        <TextEntryComponent
          icon={sectionId === 'supplies' ? entry.id : undefined}
          text={logEntry.supply.name}
          crossedOut={crossedOut}
          entry={entry}
          first={first}
          last={last}
        />
      );
    }
    case 'text':
      if (entry.type === 'card') {
        return (
          <>
            { map(entry.cards, (card, idx) => (
              <CampaignLogCardEntryComponent
                key={idx}
                code={card.card}
                count={card.count}
                entry={entry}
                text={logEntry.text}
                feminineText={logEntry.feminineText}
                crossedOut={crossedOut}
              />
            ))}
          </>
        );
      }
      return (
        <TextEntryComponent
          text={logEntry.text}
          crossedOut={crossedOut}
          entry={entry}
          decoration={decoration}
        />
      );
    case 'investigator_count':
      return (
        <TextEntryComponent
          entry={entry}
          text={`${title}: #X#`}
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
    default:
      return null;
  }
}