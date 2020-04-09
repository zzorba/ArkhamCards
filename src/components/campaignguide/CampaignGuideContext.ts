import React from 'react';

import { Deck, WeaknessSet, InvestigatorData } from 'actions/types';
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
  weaknessSet: WeaknessSet;
  latestDecks: LatestDecks;
  adjustedInvestigatorData: InvestigatorData;
  playerCards: CardsMap;
}

export const CampaignGuideContext = React.createContext<CampaignGuideContextType>(
  // @ts-ignore TS2345
  {}
);

export default CampaignGuideContext;
