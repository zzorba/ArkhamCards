import React, { useCallback } from 'react';

import { ShowTextEditDialog } from '@components/core/withDialogs';
import { CampaignNotes } from '@actions/types';
import Card from '@data/Card';
import EditCampaignNotesComponent from '../EditCampaignNotesComponent';

interface Props {
  componentId: string;
  campaignNotes: CampaignNotes;
  scenarioCount: number;
  updateCampaignNotes: (campaignNotes: CampaignNotes) => void;
  showTextEditDialog: ShowTextEditDialog;
  showAddSectionDialog: (
    addSection: (
      name: string,
      isCount: boolean,
      perInvestigator: boolean
    ) => void
  ) => void;
  allInvestigators: Card[];
}

export default function CampaignLogSection({
  componentId,
  campaignNotes,
  scenarioCount,
  updateCampaignNotes,
  showTextEditDialog,
  showAddSectionDialog,
  allInvestigators,
}: Props) {
  const delayedUpdateCampaignNotes = useCallback((campaignNotes: CampaignNotes) => {
    setTimeout(() => {
      updateCampaignNotes(campaignNotes);
    }, 0);
  }, [updateCampaignNotes]);

  return (
    <EditCampaignNotesComponent
      key={scenarioCount}
      componentId={componentId}
      campaignNotes={campaignNotes}
      allInvestigators={allInvestigators}
      updateCampaignNotes={delayedUpdateCampaignNotes}
      showDialog={showTextEditDialog}
      showAddSectionDialog={showAddSectionDialog}
    />
  );
}
