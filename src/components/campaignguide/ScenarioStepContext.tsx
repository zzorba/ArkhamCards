import React from 'react';

import GuidedCampaignLog, { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

export interface ScenarioStepContextType {
  campaignLog: GuidedCampaignLog;
  scenarioInvestigators: CampaignInvestigator[];
}

export const ScenarioStepContext = React.createContext<ScenarioStepContextType>(
  // @ts-ignore TS2345
  {}
);

export default ScenarioStepContext;
