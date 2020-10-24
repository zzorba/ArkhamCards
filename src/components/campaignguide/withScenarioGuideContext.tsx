import React, { useContext, useMemo } from 'react';
import { Text } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import withCampaignGuideContext, { CampaignGuideProps, CampaignGuideInputProps } from './withCampaignGuideContext';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import StyleContext from '@styles/StyleContext';

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
    const styleContext = useContext(StyleContext);
    const processedScenario = useMemo(() => campaignGuide.getScenario(
      scenarioId,
      campaignState
    ), [scenarioId, campaignState]);
    const scenarioState = useMemo(() => {
      return processedScenario && new ScenarioStateHelper(processedScenario.scenarioGuide.id, campaignState);
    }, [processedScenario, campaignState]);

    if (!processedScenario || !scenarioState) {
      return <Text>Unknown scenario: { scenarioId }</Text>;
    }
    return (
      <ScenarioGuideContext.Provider value={{
        processedScenario,
        scenarioState,
        style: styleContext,
      }}>
        <WrappedComponent
          {...props as Props}
          processedScenario={processedScenario}
          scenarioState={scenarioState}
          style={styleContext}
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
