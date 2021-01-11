import React from 'react';

import { CampaignCycleCode, CampaignDifficulty } from '@actions/types';
import CampaignGuide from '@data/scenario/CampaignGuide';
import CampaignSummaryHeader from '@components/campaign/CampaignSummaryHeader';

interface Props {
  campaignGuide: CampaignGuide;
  difficulty?: CampaignDifficulty;
  inverted?: boolean;
}

export default function CampaignGuideSummary({
  campaignGuide,
  difficulty,
  inverted,
}: Props) {
  return (
    <CampaignSummaryHeader
      name={campaignGuide.campaignName()}
      cycle={campaignGuide.campaignCycleCode() as CampaignCycleCode}
      inverted={inverted}
      difficulty={difficulty}
    />
  );
}
