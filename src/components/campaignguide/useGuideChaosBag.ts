import { useMemo } from 'react';

import { CampaignDifficulty, CampaignId } from '@actions/types';
import { ChaosBag } from '@app_constants';
import useSingleCard from '@components/card/useSingleCard';
import Card from '@data/types/Card';
import { useScenarioGuideContext } from './withScenarioGuideContext';


export interface Props {
  campaignId: CampaignId;
  scenarioId?: string;
  standalone?: boolean;
}

export default function useGuideChaosBag({ campaignId, scenarioId, standalone }: Props): [
  boolean,
  Card | undefined,
  string | undefined,
  CampaignDifficulty | undefined,
  ChaosBag | undefined,
  string | undefined,
  string | undefined,
] {
  const [campaignContext, scenarioContext] = useScenarioGuideContext(campaignId, scenarioId, false, standalone);
  const processedScenario = scenarioContext?.processedScenario;
  const liveChaosBag = useMemo(() => {
    if (scenarioId) {
      return scenarioContext?.processedScenario?.latestCampaignLog?.chaosBag;
    }
    if (!campaignContext) {
      return undefined;
    }
    const { campaignGuide, campaignState } = campaignContext;
    const [processedCampaign] = campaignGuide.processAllScenarios(campaignState);
    if (!processedCampaign) {
      return undefined;
    }
    return processedCampaign.campaignLog.chaosBag;
  }, [campaignContext, scenarioContext, scenarioId]);
  const [scenarioCard, loading] = useSingleCard(processedScenario?.scenarioGuide.scenarioCard(), 'encounter');

  const difficulty = processedScenario?.latestCampaignLog.campaignData.difficulty;
  const campaignScenarioText = difficulty && scenarioContext?.processedScenario?.scenarioGuide.scenarioCardText(difficulty);
  const scenarioCardText = useMemo(() => {
    if (!difficulty) {
      return undefined;
    }
    if (!scenarioCard) {
      return campaignScenarioText;
    }
    const text = (difficulty === CampaignDifficulty.EASY || difficulty === CampaignDifficulty.STANDARD) ?
      scenarioCard.text : scenarioCard.back_text;
    if (!text) {
      return undefined;
    }
    const lines = text?.split('\n');
    if (!lines.length) {
      return undefined;
    }
    const [, ...rest] = lines;
    return rest.join('\n');
  }, [campaignScenarioText, scenarioCard, difficulty]);

  return [loading, scenarioCard, scenarioCardText, difficulty, liveChaosBag,
    processedScenario?.scenarioGuide.scenarioName(),
    processedScenario?.scenarioGuide.scenarioIcon(),
  ];
}