import React from 'react';

import { WeaknessSet, CampaignId } from '@actions/types';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { LatestDecks, ProcessedCampaign } from '@data/scenario';
import Card, { CardsMap } from '@data/types/Card';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';

export interface CampaignGuideContextType {
  campaignId: CampaignId;
  campaignGuideVersion: number;
  campaignName: string;
  campaignGuide: CampaignGuide;
  campaignState: CampaignStateHelper;
  spentXp: { [code: string]: number | undefined };
  campaignInvestigators: Card[];
  weaknessSet: WeaknessSet;
  latestDecks: LatestDecks;
  playerCards: CardsMap;
  lastUpdated: Date;
  syncCampaignChanges: (campaignLog: ProcessedCampaign) => Promise<void>;
}

export const CampaignGuideContext = React.createContext<CampaignGuideContextType>(
  // @ts-ignore TS2345
  { }
);

export default CampaignGuideContext;
