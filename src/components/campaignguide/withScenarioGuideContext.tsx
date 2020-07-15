import React from 'react';
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
  class ScenarioDataComponent extends React.Component<Props & CampaignGuideProps & ScenarioGuideInputProps> {
    render() {
      const {
        campaignData: {
          campaignState,
          campaignGuide,
        },
        scenarioId,
      } = this.props;
      const processedScenario = campaignGuide.getScenario(
        scenarioId,
        campaignState
      );
      if (!processedScenario) {
        return <Text>Unknown scenario: { scenarioId }</Text>;
      }
      const scenarioState = new ScenarioStateHelper(
        processedScenario.scenarioGuide.id,
        campaignState
      );
      const context: ScenarioGuideContextType = {
        processedScenario,
        scenarioState,
      };
      return (
        <ScenarioGuideContext.Provider value={context}>
          <WrappedComponent
            {...this.props as Props}
            processedScenario={processedScenario}
            scenarioState={scenarioState}
          />
        </ScenarioGuideContext.Provider>
      );
    }
  }
  const result = withCampaignGuideContext<Props & ScenarioGuideInputProps>(
    ScenarioDataComponent
  );
  hoistNonReactStatic(result, WrappedComponent);
  return result as React.ComponentType<Props & ScenarioGuideInputProps>;
}
