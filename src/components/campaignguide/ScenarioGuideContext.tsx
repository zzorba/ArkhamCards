import React, { useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';

export interface ScenarioGuideContextType {
  processedCampaign: ProcessedCampaign;
  processedScenario: ProcessedScenario;
  scenarioState: ScenarioStateHelper;
}

export const ScenarioGuideContext = React.createContext<ScenarioGuideContextType>(
  // @ts-ignore TS2345
  {}
);

/**
 * Hook that provides an undo function with automatic scenario close logic.
 * If undoing the last remaining step in a scenario, it will automatically
 * close the scenario screen.
 */
export function useScenarioUndo() {
  const { scenarioState, processedScenario } = useContext(ScenarioGuideContext);
  const navigation = useNavigation();

  return useCallback(() => {
    scenarioState.undo();
    if (processedScenario.closeOnUndo) {
      navigation.goBack();
    }
  }, [scenarioState, processedScenario.closeOnUndo, navigation]);
}

export default ScenarioGuideContext;
