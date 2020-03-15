import React from 'react';

import { InvestigatorDeck } from './types';
import ScenarioStateHelper from './ScenarioStateHelper';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import CampaignGuide from 'data/scenario/CampaignGuide';


export interface ScenarioGuideContextType {
  campaignGuide: CampaignGuide;
  scenarioGuide: ScenarioGuide;
  investigatorDecks: InvestigatorDeck[];
  scenarioState: ScenarioStateHelper;
}

export const ScenarioGuideContext = React.createContext<ScenarioGuideContextType>(
  // @ts-ignore TS2345
  {}
);

export default ScenarioGuideContext;
