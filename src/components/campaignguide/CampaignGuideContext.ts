import React from 'react';

import { WeaknessSet, CampaignId } from '@actions/types';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { LatestDecks, ProcessedCampaign } from '@data/scenario';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

export interface CampaignGuideContextType {
  campaignId: CampaignId;
  campaign: SingleCampaignT;

  campaignGuideVersion: number;
  campaignGuide: CampaignGuide;
  campaignState: CampaignStateHelper;
  spentXp: { [code: string]: number | undefined };
  campaignInvestigators?: CampaignInvestigator[];
  weaknessSet: WeaknessSet;
  latestDecks: LatestDecks;
  syncCampaignChanges: (campaignLog: ProcessedCampaign) => Promise<void>;
}

export const CampaignGuideContext = React.createContext<CampaignGuideContextType>(
  // @ts-ignore TS2345
  { }
);

export default CampaignGuideContext;
