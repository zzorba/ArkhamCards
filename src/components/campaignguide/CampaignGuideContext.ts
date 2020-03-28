import React from 'react';

import { SingleCampaign } from 'actions/types';
import CampaignStateHelper from 'data/scenario/CampaignStateHelper';
import CampaignGuide from 'data/scenario/CampaignGuide';

export interface CampaignGuideContextType {
  campaign: SingleCampaign;
  campaignGuide: CampaignGuide;
  campaignState: CampaignStateHelper;
}

export const CampaignGuideContext = React.createContext<CampaignGuideContextType>(
  // @ts-ignore TS2345
  {}
);

export default CampaignGuideContext;
