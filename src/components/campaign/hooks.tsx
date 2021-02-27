import React, { useCallback, useState } from 'react';
import { t } from 'ttag';

import { CampaignId } from '@actions/types';
import { useCountDialog } from '@components/deck/dialogs';
import Card from '@data/Card';

export function useCampaignId(campaignId: CampaignId): [CampaignId, (serverId: number) => void] {
  const [liveCampaignId, setLiveCampaignId] = useState(campaignId);
  const setServerId = useCallback(
    (serverId: number) => setLiveCampaignId({ campaignId: campaignId.campaignId, serverId }),
    [setLiveCampaignId, campaignId.campaignId]
  );
  return [liveCampaignId, setServerId];
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
