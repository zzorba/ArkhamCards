import React, { useContext, useMemo } from 'react';
import { Text } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ScenarioGuideContext from './ScenarioGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from './withCampaignGuideContext';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import CampaignGuideContext from './CampaignGuideContext';

export interface ScenarioGuideInputProps extends CampaignGuideInputProps {
  scenarioId: string;
  standalone?: boolean;
}

export default function withScenarioGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props>
): React.ComponentType<Props & ScenarioGuideInputProps> {
  function ScenarioDataComponent(props: Props & ScenarioGuideInputProps) {
    const { campaignState, campaignGuide } = useContext(CampaignGuideContext);
    const { scenarioId, standalone } = props;
    const processedScenario = useMemo(
      () => campaignGuide.getScenario(scenarioId, campaignState, standalone),
      [scenarioId, campaignGuide, campaignState, standalone]);
    const scenarioState = useMemo(() => {
      return processedScenario && new ScenarioStateHelper(processedScenario.scenarioGuide.id, campaignState);
    }, [processedScenario, campaignState]);

    const context = useMemo(() => {
      if (!processedScenario || !scenarioState) {
        return undefined;
      }
      return {
        processedScenario,
        scenarioState,
      };
    }, [processedScenario, scenarioState]);

    if (!context) {
      return <Text>Unknown scenario: { scenarioId }</Text>;
    }
    return (
      <ScenarioGuideContext.Provider value={context}>
        <WrappedComponent {...props as Props} />
      </ScenarioGuideContext.Provider>
    );
  }
  const result = withCampaignGuideContext<Props & ScenarioGuideInputProps>(
    ScenarioDataComponent
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & ScenarioGuideInputProps>;
}
