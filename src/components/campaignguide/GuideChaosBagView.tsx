import React from 'react';

import DrawChaosBagComponent from '@components/campaign/DrawChaosBagComponent';
import { ChaosBag } from '@app_constants';
import { CampaignId } from '@actions/types';

export interface GuideChaosBagProps {
  campaignId: CampaignId;
  chaosBag: ChaosBag;
}

export default function GuideChaosBagView({ campaignId, chaosBag }: GuideChaosBagProps) {
  return (
    <DrawChaosBagComponent
      campaignId={campaignId}
      chaosBag={chaosBag}
    />
  );
}

