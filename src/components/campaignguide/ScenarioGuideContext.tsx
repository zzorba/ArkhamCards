import React from 'react';

import { InvestigatorDeck } from 'data/scenario';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';
import ScenarioGuide from 'data/scenario/ScenarioGuide';

export interface ScenarioGuideContextType {
  scenarioGuide: ScenarioGuide;
  investigatorDecks: InvestigatorDeck[];
  scenarioState: ScenarioStateHelper;
}

export const ScenarioGuideContext = React.createContext<ScenarioGuideContextType>(
  // @ts-ignore TS2345
  {}
);

export default ScenarioGuideContext;
