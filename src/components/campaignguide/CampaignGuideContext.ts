import React from 'react';

import { Deck, SingleCampaign } from 'actions/types';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import CampaignGuide from 'data/scenario/CampaignGuide';
import Card from 'data/Card';

export interface LatestDecks {
  [code: string]: Deck | undefined;
}

export interface CampaignGuideContextType {
  campaign: SingleCampaign;
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
