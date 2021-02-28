import React from 'react';

import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import Card from '@data/types/Card';

export interface ScenarioStepContextType {
  campaignLog: GuidedCampaignLog;
  scenarioInvestigators: Card[];
}

export const ScenarioStepContext = React.createContext<ScenarioStepContextType>(
  // @ts-ignore TS2345
  {}
);

export default ScenarioStepContext;
