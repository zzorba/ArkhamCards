import { useMemo } from 'react';

import { CampaignDifficulty, CampaignId } from '@actions/types';
import { ChaosBag } from '@app_constants';
import useSingleCard from '@components/card/useSingleCard';
import Card from '@data/types/Card';
import { useScenarioGuideContext } from './withScenarioGuideContext';
import { ProcessedCampaign } from '@data/scenario';


export interface Props {
  campaignId: CampaignId;
  scenarioId?: string;
  standalone?: boolean;
  processedCampaign: ProcessedCampaign | undefined;
}

export default function useGuideChaosBag({ campaignId, scenarioId, standalone, processedCampaign: initialProcessedCampaign }: Props): [
  boolean,
  Card | undefined,
  string | undefined,
  CampaignDifficulty | undefined,
  ChaosBag | undefined,
  string | undefined,
  string | undefined,
] {
  const [, scenarioContext, processedCampaign] = useScenarioGuideContext(campaignId, scenarioId, false, standalone, initialProcessedCampaign);
  const processedScenario = scenarioContext?.processedScenario;
  const liveChaosBag = processedCampaign?.campaignLog.chaosBag;
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
    console.log(lines);
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