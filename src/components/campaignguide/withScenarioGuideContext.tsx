import React, { useMemo } from 'react';
import { Text } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import withCampaignGuideContext, { CampaignGuideProps, CampaignGuideInputProps } from './withCampaignGuideContext';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';

export interface ScenarioGuideInputProps extends CampaignGuideInputProps {
  scenarioId: string;
}

export default function withScenarioGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & ScenarioGuideContextType>
): React.ComponentType<Props & ScenarioGuideInputProps> {
  function ScenarioDataComponent(props: Props & CampaignGuideProps & ScenarioGuideInputProps) {
    const {
      campaignData: {
        campaignState,
        campaignGuide,
      },
      scenarioId,
    } = props;
    const processedScenario = useMemo(() => campaignGuide.getScenario(
      scenarioId,
      campaignState
    ), [scenarioId, campaignGuide, campaignState]);
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
        <WrappedComponent
          {...props as Props}
          processedScenario={context.processedScenario}
          scenarioState={context.scenarioState}
        />
      </ScenarioGuideContext.Provider>
    );
  }
  const result = withCampaignGuideContext<Props & ScenarioGuideInputProps>(
    ScenarioDataComponent
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & ScenarioGuideInputProps>;
}
