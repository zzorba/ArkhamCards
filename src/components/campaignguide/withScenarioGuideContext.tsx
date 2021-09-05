import React, { useMemo } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import ScenarioGuideContext, { ScenarioGuideContextType } from './ScenarioGuideContext';
import { CampaignGuideInputProps, InjectedCampaignGuideContextProps, useCampaignGuideContext } from './withCampaignGuideContext';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import CampaignGuideContext, { CampaignGuideContextType } from './CampaignGuideContext';
import { CampaignId } from '@actions/types';
import LoadingSpinner from '@components/core/LoadingSpinner';

export interface ScenarioGuideInputProps extends CampaignGuideInputProps {
  scenarioId: string;
  standalone?: boolean;
}

export function useScenarioGuideContext(
  campaignId: CampaignId,
  scenarioId: undefined | string,
  rootView: boolean,
  standalone?: boolean
): [CampaignGuideContextType | undefined, ScenarioGuideContextType | undefined, (serverId: number) => void] {
  const [campaignContext, setCampaignServerId] = useCampaignGuideContext(campaignId, rootView);
  const processedScenario = useMemo(
    () => {
      if (!campaignContext || !scenarioId) {
        return undefined;
      }
      const { campaignGuide, campaignState } = campaignContext;
      return campaignGuide.getScenario(scenarioId, campaignState, standalone);
    },
    [scenarioId, campaignContext, standalone]);
  const scenarioState = useMemo(() => {
    if (!campaignContext || !processedScenario) {
      return undefined;
    }
    const { campaignState } = campaignContext;
    return processedScenario && new ScenarioStateHelper(processedScenario.scenarioGuide.id, campaignState);
  }, [processedScenario, campaignContext]);
  const scenarioContext = useMemo(() => {
    if (!processedScenario || !scenarioState) {
      return undefined;
    }
    return {
      processedScenario,
      scenarioState,
    };
  }, [processedScenario, scenarioState]);
  return [campaignContext, scenarioContext, setCampaignServerId];
}

export default function withScenarioGuideContext<Props>(
  WrappedComponent: React.ComponentType<Props & InjectedCampaignGuideContextProps>
): React.ComponentType<Props & ScenarioGuideInputProps> {
  function ScenarioDataComponent(props: Props & ScenarioGuideInputProps) {
    const [campaignContext, scenarioContext, setCampaignServerId] = useScenarioGuideContext(props.campaignId, props.scenarioId, props.standalone || false, props.standalone);
    if (!campaignContext || !scenarioContext) {
      return (
        <LoadingSpinner />
      );
    }
    return (
      <CampaignGuideContext.Provider value={campaignContext}>
        <ScenarioGuideContext.Provider value={scenarioContext}>
          <WrappedComponent
            {...props as Props}
            setCampaignServerId={setCampaignServerId}
          />
        </ScenarioGuideContext.Provider>
      </CampaignGuideContext.Provider>
    );
  }
  hoistNonReactStatic(ScenarioDataComponent, WrappedComponent);
  return ScenarioDataComponent as React.ComponentType<Props & ScenarioGuideInputProps>;
}
