import React from 'react';

import { WeaknessSet, InvestigatorData } from '@actions/types';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { LatestDecks } from '@data/scenario';
import Card, { CardsMap } from '@data/Card';
import { DEFAULLT_STYLE_CONTEXT, StyleContextType } from '@styles/StyleContext';

export interface CampaignGuideContextType {
  campaignId: number;
  campaignGuideVersion: number;
  campaignName: string;
  campaignGuide: CampaignGuide;
  campaignState: CampaignStateHelper;
  campaignInvestigators: Card[];
  weaknessSet: WeaknessSet;
  latestDecks: LatestDecks;
  adjustedInvestigatorData: InvestigatorData;
  playerCards: CardsMap;
  lastUpdated: Date;
  style: StyleContextType;
}

export const CampaignGuideContext = React.createContext<CampaignGuideContextType>(
  // @ts-ignore TS2345
  { style: DEFAULLT_STYLE_CONTEXT }
);

export default CampaignGuideContext;
