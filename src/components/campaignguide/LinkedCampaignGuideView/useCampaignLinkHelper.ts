import { find } from 'lodash';

import { ProcessedCampaign } from '@data/scenario';
import { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';
import { showScenario } from '@components/campaignguide/nav';
import { useCallback, useRef } from 'react';
import { useCounter } from '@components/core/hooks';

interface Props {
  componentId: string;
  campaignA?: ProcessedCampaign;
  campaignDataA?: CampaignGuideContextType;
  campaignB?: ProcessedCampaign;
  campaignDataB?: CampaignGuideContextType;
  setSelectedTab?: (index: number) => void;
}
export type ShowScenario = (scenarioId: string) => void;

export function useCampaignLinkHelper({ componentId, campaignA, campaignDataA, campaignB, campaignDataB, setSelectedTab }: Props): [ShowScenario, ShowScenario, number] {
  const showScenarioA = useRef<ShowScenario | undefined>(null);
  const showScenarioB = useRef<ShowScenario | undefined>(null);
  const [counter, incCounter] = useCounter(0, {});
  const showCampaignScenarioA = useCallback((scenarioId: string) => {
    if (!campaignA || !campaignDataA) {
      return;
    }
    const scenario = find(
      campaignA.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario && showScenarioB.current) {
      incCounter();
      setSelectedTab && setSelectedTab(0);
      showScenario(
        componentId,
        scenario,
        campaignDataA.campaignId,
        campaignDataA.campaignState,
        campaignDataA.campaignGuide.campaignName(),
        showScenarioB.current,
        campaignA
      );
    }
  }, [campaignA, componentId, setSelectedTab, campaignDataA, incCounter]);
  showScenarioA.current = showCampaignScenarioA;
  const showCampaignScenarioB = useCallback((scenarioId: string) => {
    if (!campaignB || !campaignDataB) {
      return;
    }
    const scenario = find(
      campaignB.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario && showScenarioA.current) {
      incCounter();
      setSelectedTab && setSelectedTab(1);
      showScenario(
        componentId,
        scenario,
        campaignDataB.campaignId,
        campaignDataB.campaignState,
        campaignDataB.campaignGuide.campaignName(),
        showScenarioA.current,
        campaignB,
      );
    }
  }, [campaignB, componentId, campaignDataB, setSelectedTab, incCounter]);
  showScenarioB.current = showCampaignScenarioB;
  return [showCampaignScenarioA, showCampaignScenarioB, counter];
}
