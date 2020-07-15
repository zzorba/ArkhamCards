import React from 'react';

import { ScenarioGuideContextType } from './ScenarioGuideContext';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import Card from '@data/Card';

export interface ScenarioStepContextType extends ScenarioGuideContextType {
  campaignLog: GuidedCampaignLog;
  scenarioInvestigators: Card[];
}

export const ScenarioStepContext = React.createContext<ScenarioStepContextType>(
  // @ts-ignore TS2345
  {}
);

export default ScenarioStepContext;
