import React, { useCallback, useContext } from 'react';
import { View } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import CampaignGuide from '@data/scenario/CampaignGuide';
import { EntrySection } from '@data/scenario/GuidedCampaignLog';
import DeckButton from '@components/deck/controls/DeckButton';
import useTextEditDialog from '@components/core/useTextEditDialog';
import CampaignGuideContext from '../CampaignGuideContext';
import CampaignLogEntryComponent from './CampaignLogEntryComponent';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: EntrySection;
  title?: string;
  interScenarioId?: string;
}

export default function CampaignLogSectionComponent({ sectionId, campaignGuide, section, title, interScenarioId }: Props) {
  const [dialog, showTextEditDialog] = useTextEditDialog();
  const { campaignState } = useContext(CampaignGuideContext);
  const saveTextEntry = useCallback((text) => {
    const entries = campaignState.interScenarioCampaignLogEntries(interScenarioId) || []
    campaignState.setInterScenarioCampaignLogEntries([...entries, text], interScenarioId);
  }, [campaignState, interScenarioId]);
  const editCampaignLogPressed = useCallback(() => {
    showTextEditDialog(t`Record that...`, '', saveTextEntry);
  }, [showTextEditDialog, saveTextEntry]);
  return (
    <>
      { map(section.entries, (entry, idx) => (
        <View key={`${entry.id}_${idx}`}>
          <CampaignLogEntryComponent
            entry={entry}
            sectionId={sectionId}
            campaignGuide={campaignGuide}
            section={section}
            interScenarioId={interScenarioId}
            title={title}
            first={idx === 0}
            last={idx === section.entries.length - 1}
          />
        </View>
      )) }
      { interScenarioId && sectionId === 'campaign_notes' && (
        <DeckButton
          key="edit"
          icon="edit"
          title={t`Record in campaign log`}
          detail={t`Player card entries only`}
          onPress={editCampaignLogPressed}
        />
      ) }
      { dialog }
    </>
  );
}
