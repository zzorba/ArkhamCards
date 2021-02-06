import { find } from 'lodash';

import { ProcessedCampaign } from '@data/scenario';
import { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import { showScenario } from '@components/campaignguide/nav';
import { useCallback, useEffect, useRef } from 'react';

interface Props {
  componentId: string;
  campaignA?: ProcessedCampaign;
  campaignDataA?: CampaignGuideContextType;
  campaignB?: ProcessedCampaign;
  campaignDataB?: CampaignGuideContextType;
  setSelectedTab?: (index: number) => void;
}
export type ShowScenario = (scenarioId: string) => void;

export function useCampaignLinkHelper({ componentId, campaignA, campaignDataA, campaignB, campaignDataB, setSelectedTab }: Props): [ShowScenario, ShowScenario] {
  const showScenarioA = useRef<ShowScenario | undefined>();
  const showScenarioB = useRef<ShowScenario | undefined>();
  const showCampaignScenarioA = useCallback((scenarioId: string) => {
    if (!campaignA || !campaignDataA) {
      return;
    }
    const scenario = find(
      campaignA.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario && showScenarioB.current) {
      setSelectedTab && setSelectedTab(0);
      showScenario(
        componentId,
        scenario,
        campaignDataA.campaignId,
        campaignDataA.campaignState,
        campaignDataA.campaignGuide.campaignName(),
        showScenarioB.current
      );
    }
  }, [campaignA, componentId, setSelectedTab, campaignDataA]);
  useEffect(() => {
    showScenarioA.current = showCampaignScenarioA;
  }, [showCampaignScenarioA]);
  const showCampaignScenarioB = useCallback((scenarioId: string) => {
    if (!campaignB || !campaignDataB) {
      return;
    }
    const scenario = find(
      campaignB.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario && showScenarioA.current) {
      setSelectedTab && setSelectedTab(1);
      showScenario(
        componentId,
        scenario,
        campaignDataB.campaignId,
        campaignDataB.campaignState,
        campaignDataB.campaignGuide.campaignName(),
        showScenarioA.current
      );
    }
  }, [campaignB, componentId, campaignDataB, setSelectedTab]);
  useEffect(() => {
    showScenarioB.current = showCampaignScenarioB;
  }, [showCampaignScenarioB]);
  return [showCampaignScenarioA, showCampaignScenarioB];
}
