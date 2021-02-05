import React from 'react';

import { CampaignCycleCode, CampaignDifficulty } from '@actions/types';
import CampaignGuide from '@data/scenario/CampaignGuide';
import CampaignSummaryHeader from '@components/campaign/CampaignSummaryHeader';

interface Props {
  campaignGuide: CampaignGuide;
  difficulty?: CampaignDifficulty;
}

export default function CampaignGuideSummary({
  campaignGuide,
  difficulty,
}: Props) {
  return (
    <CampaignSummaryHeader
      name={campaignGuide.campaignName()}
      cycle={campaignGuide.campaignCycleCode() as CampaignCycleCode}
      difficulty={difficulty}
    />
  );
}
