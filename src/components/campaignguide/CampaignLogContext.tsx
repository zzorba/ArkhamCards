import React from 'react';

import { InvestigatorDeck } from 'data/scenario';
import { SingleCampaign } from 'actions/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';


export interface CampaignLogContextType {
  campaignLog: GuidedCampaignLog;
}

export const CampaignLogContext = React.createContext<CampaignLogContextType>(
  // @ts-ignore TS2345
  {}
);

export default CampaignLogContext;
