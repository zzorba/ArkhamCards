import { useCallback, useState } from 'react';

import { CampaignId } from '@actions/types';

export function useCampaignId(campaignId: CampaignId): [CampaignId, (serverId: string) => void] {
  const [liveCampaignId, setLiveCampaignId] = useState(campaignId);
  const setServerId = useCallback(
    (serverId: string) => setLiveCampaignId({ campaignId: campaignId.campaignId, serverId }),
    [setLiveCampaignId, campaignId.campaignId]
  );
  return [liveCampaignId, setServerId];
}
