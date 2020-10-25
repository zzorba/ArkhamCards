import React from 'react';

import DrawChaosBagComponent from '@components/campaign/DrawChaosBagComponent';
import { NavigationProps } from '@components/nav/types';
import { ChaosBag } from '@app_constants';

export interface GuideChaosBagProps {
  componentId: string;
  campaignId: number;
  chaosBag: ChaosBag;
}

type Props = NavigationProps & GuideChaosBagProps;

export default function GuideChaosBagView({ componentId, campaignId, chaosBag }: Props) {
  return (
    <DrawChaosBagComponent
      componentId={componentId}
      campaignId={campaignId}
      chaosBag={chaosBag}
    />
  );
}

