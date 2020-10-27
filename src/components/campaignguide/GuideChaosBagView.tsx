import React from 'react';

import DrawChaosBagComponent from '@components/campaign/DrawChaosBagComponent';
import { ChaosBag } from '@app_constants';

export interface GuideChaosBagProps {
  campaignId: number;
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

