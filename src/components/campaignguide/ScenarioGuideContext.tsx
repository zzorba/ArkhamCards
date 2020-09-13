import React from 'react';

import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import { ProcessedScenario } from '@data/scenario';
import { DEFAULLT_STYLE_CONTEXT, StyleContextType } from '@styles/StyleContext';

export interface ScenarioGuideContextType {
  processedScenario: ProcessedScenario;
  scenarioState: ScenarioStateHelper;
  style: StyleContextType
}

export const ScenarioGuideContext = React.createContext<ScenarioGuideContextType>(
  // @ts-ignore TS2345
  { style: DEFAULLT_STYLE_CONTEXT }
);

export default ScenarioGuideContext;
