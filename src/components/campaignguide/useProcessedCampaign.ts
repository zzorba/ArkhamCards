import { useMemo, useEffect, useRef, useContext } from 'react';
import { find } from 'lodash';

import CampaignGuide from '@data/scenario/CampaignGuide';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import LanguageContext from '@lib/i18n/LanguageContext';

export default function useProcessedCampaign(
  campaignGuide?: CampaignGuide,
  campaignState?: CampaignStateHelper,
  standaloneId?: string | undefined,
  skip?: boolean | undefined,
  initialProcessedCampaign?: ProcessedCampaign
): [ProcessedCampaign | undefined, string | undefined] {
  const { lang } = useContext(LanguageContext);
  const previousCampaign = useRef<ProcessedCampaign | undefined>(initialProcessedCampaign);
  const [processedCampaign, processedCampaignError] = useMemo(() => {
    if (!campaignGuide || !campaignState || skip) {
      return [undefined, undefined];
    }
    return campaignGuide.processAllScenarios(campaignState, standaloneId, previousCampaign.current, lang);
  }, [campaignGuide, campaignState, standaloneId, skip]);
  useEffect(() => {
    previousCampaign.current = processedCampaign;
  }, [processedCampaign]);
  return [processedCampaign, processedCampaignError];
}

export function useProcessedScenario(
  id: string | undefined,
  standalone: boolean | undefined,
  campaignGuide?: CampaignGuide,
  campaignState?: CampaignStateHelper,
  initialProcessedCampaign?: ProcessedCampaign
): [ProcessedScenario | undefined, ProcessedCampaign | undefined, string | undefined] {
  const [processedCampaign, processedCampaignError] = useProcessedCampaign(campaignGuide, campaignState, standalone ? id : undefined, false, initialProcessedCampaign);
  if (!processedCampaign || !id) {
    return [undefined, processedCampaign, processedCampaignError];
  }

  return [find(
    processedCampaign.scenarios,
    scenario => scenario.scenarioGuide.id === id
  ), processedCampaign, undefined];
}
