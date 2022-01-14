import { useMemo, useRef } from 'react';

import CampaignGuide from '@data/scenario/CampaignGuide';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import { find } from 'lodash';

export default function useProcessedCampaign(
  campaignGuide?: CampaignGuide,
  campaignState?: CampaignStateHelper,
  standalone?: boolean | undefined,
  skip?: boolean | undefined,
  initialProcessedCampaign?: ProcessedCampaign
): [ProcessedCampaign | undefined, string | undefined] {
  const previousCampaign = useRef<ProcessedCampaign | undefined>(initialProcessedCampaign);
  const [processedCampaign, processedCampaignError] = useMemo(() => {
    if (!campaignGuide || !campaignState || skip) {
      return [undefined, undefined];
    }
    return campaignGuide.processAllScenarios(campaignState, standalone, previousCampaign.current);
  }, [campaignGuide, campaignState, standalone, skip]);
  previousCampaign.current = processedCampaign;
  return [processedCampaign, processedCampaignError];
}

export function useProcessedScenario(
  id: string | undefined,
  standalone: boolean | undefined,
  campaignGuide?: CampaignGuide,
  campaignState?: CampaignStateHelper,
  initialProcessedCampaign?: ProcessedCampaign
): [ProcessedScenario | undefined, ProcessedCampaign | undefined, string | undefined] {
  const [processedCampaign, processedCampaignError] = useProcessedCampaign(campaignGuide, campaignState, standalone, false, initialProcessedCampaign);
  if (!processedCampaign || !id) {
    return [undefined, processedCampaign, processedCampaignError];
  }
  return [find(
    processedCampaign.scenarios,
    scenario => scenario.scenarioGuide.id === id
  ), processedCampaign, undefined];
}
