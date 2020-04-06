import React from 'react';

import { Deck } from 'actions/types';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import CampaignGuide from 'data/scenario/CampaignGuide';
import Card, { CardsMap } from 'data/Card';

export interface LatestDecks {
  [code: string]: Deck | undefined;
}

export interface CampaignGuideContextType {
  campaignId: number;
  campaignGuide: CampaignGuide;
  campaignState: CampaignStateHelper;
  campaignInvestigators: Card[];
  latestDecks: LatestDecks;
}

export const CampaignGuideContext = React.createContext<CampaignGuideContextType>(
  // @ts-ignore TS2345
  {}
);

export default CampaignGuideContext;
