import React from 'react';

import { InvestigatorDeck } from 'data/scenario';
import { SingleCampaign } from 'actions/types';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import CampaignGuide from 'data/scenario/CampaignGuide';


export interface ScenarioGuideContextType {
  campaign: SingleCampaign;
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
