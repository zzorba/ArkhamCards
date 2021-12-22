import React, { useCallback, useState } from 'react';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import { useCountDialog } from '@components/deck/dialogs';
import Card from '@data/types/Card';


interface LinkedCampaignId {
  campaignId: CampaignId;
  campaignIdA: CampaignId;
  campaignIdB: CampaignId;
}
export function useLinkedCampaignId(campaignId: LinkedCampaignId): [LinkedCampaignId, (id: LinkedCampaignId) => void, boolean] {
  const [uploading, setUploading] = useState(false);
  const [liveCampaignId, setLiveCampaignId] = useState(campaignId);
  const setServerId = useCallback((id: LinkedCampaignId) => {
    setUploading(true);
    setLiveCampaignId(id);
  }, [setLiveCampaignId]);
  return [liveCampaignId, setServerId, uploading];
}


export function useCampaignId(campaignId: CampaignId): [CampaignId, (serverId: number) => void, boolean] {
  const [uploading, setUploading] = useState(false);
  const [liveCampaignId, setLiveCampaignId] = useState(campaignId);
  const setServerId = useCallback(
    (serverId: number) => {
      setUploading(true);
      setLiveCampaignId({ campaignId: campaignId.campaignId, serverId });
    },
    [setLiveCampaignId, campaignId.campaignId]
  );
  return [liveCampaignId, setServerId, uploading];
}

export function useXpDialog(updateSpentXp: (investigator: string, spentXp: number) => void): [
  React.ReactNode,
  (investigator: Card, spentXp: number, totalXp: number) => void,
] {
  const [dialog, showCountDialog] = useCountDialog();
  const showXpAdjustmentDialog = useCallback((investigator: Card, spentXp: number, totalXp: number) => {
    showCountDialog({
      title: t`Adjust XP`,
      label: t`Experience`,
      value: spentXp,
      max: totalXp,
      update: (value: number) => {
        updateSpentXp(investigator.code, value);
      },
    });
  }, [showCountDialog, updateSpentXp]);
  return [dialog, showXpAdjustmentDialog];
}
