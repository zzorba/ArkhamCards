import React from 'react';

import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

export interface CampaignLogContextType {
  campaignLog: GuidedCampaignLog;
}

export const CampaignLogContext = React.createContext<CampaignLogContextType>(
  // @ts-ignore TS2345
  {}
);

export default CampaignLogContext;
