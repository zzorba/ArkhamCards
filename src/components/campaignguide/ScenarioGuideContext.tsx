import React from 'react';

import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import { ProcessedScenario } from '@data/scenario';

export interface ScenarioGuideContextType {
  processedScenario: ProcessedScenario;
  scenarioState: ScenarioStateHelper;
}

export const ScenarioGuideContext = React.createContext<ScenarioGuideContextType>(
  // @ts-ignore TS2345
  {}
);

export default ScenarioGuideContext;
