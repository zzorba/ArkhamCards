import React from 'react';
import { Text } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import { CampaignGuideContextType } from './CampaignGuideContext';
import withCampaignGuideContext, { CampaignGuideInputProps } from './withCampaignGuideContext';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';

export interface ScenarioGuideInputProps extends CampaignGuideInputProps {
  scenarioId: string;
}

export default function withScenarioGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props>
): React.ComponentType<Props & ScenarioGuideInputProps> {
  class ScenarioDataComponent extends React.Component<Props & CampaignGuideContextType & ScenarioGuideInputProps> {
    render() {
      const {
        campaignState,
        campaignGuide,
        scenarioId,
      } = this.props;
      const scenarioGuide = campaignGuide.getScenario(
        scenarioId,
        campaignState
      );
      if (!scenarioGuide) {
        return <Text>Unknown scenario: { scenarioId }</Text>;
      }
      const context: ScenarioGuideContextType = {
        scenarioGuide,
        scenarioState: new ScenarioStateHelper(
          scenarioGuide.id,
          campaignState
        ),
      };
      return (
        <ScenarioGuideContext.Provider value={context}>
          <WrappedComponent {...this.props as Props} />
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
