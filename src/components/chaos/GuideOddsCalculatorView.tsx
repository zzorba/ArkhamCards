import React, { useMemo } from 'react';
import { flatMap } from 'lodash';

import OddsCalculatorComponent from './OddsCalculatorComponent';
import { ChaosBag } from '@app_constants';
import Card from '@data/types/Card';
import { useCycleScenarios, useInvestigators } from '@components/core/hooks';
import { useCampaign, useChaosBagResults } from '@data/hooks';
import { CampaignId } from '@actions/types';
import useGuideChaosBag from '../campaignguide/useGuideChaosBag';
import LoadingSpinner from '@components/core/LoadingSpinner';
import { ProcessedCampaign } from '@data/scenario';

export interface GuideOddsCalculatorProps {
  campaignId: CampaignId;
  scenarioId?: string;
  standalone?: boolean;
  investigatorIds: string[];
  chaosBag: ChaosBag;
  processedCampaign: ProcessedCampaign | undefined;
}

export default function GuideOddsCalculatorView({ campaignId, investigatorIds, chaosBag, scenarioId, standalone, processedCampaign }: GuideOddsCalculatorProps) {
  const chaosBagResults = useChaosBagResults(campaignId);
  const { loading, scenarioCard, scenarioCardText, difficulty, liveChaosBag, scenarioName, scenarioIcon, scenarioCode } = useGuideChaosBag({
    campaignId,
    scenarioId,
    standalone,
    processedCampaign,
    difficultyOverride: chaosBagResults.difficulty,
  });

  const campaign = useCampaign(campaignId);
  const cycleScenarios = useCycleScenarios(campaign?.cycleCode);

  const investigators = useInvestigators(investigatorIds);
  const allInvestigators: Card[] = useMemo(() => {
    return flatMap(investigatorIds, code => (investigators && investigators[code]) || []);
  }, [investigators, investigatorIds]);
  console.log(`ScenarioCode: ${scenarioIcon}`);
  if (!campaign || loading) {
    return <LoadingSpinner />
  }
  return (
    <OddsCalculatorComponent
      campaign={campaign}
      chaosBag={liveChaosBag || chaosBag}
      cycleScenarios={cycleScenarios}
      allInvestigators={allInvestigators}
      scenarioCard={scenarioCard}
      scenarioCode={scenarioCode}
      scenarioIcon={scenarioIcon}
      scenarioName={scenarioName}
      scenarioCardText={scenarioCardText}
      difficulty={difficulty}
      chaosBagResults={chaosBagResults}
    />
  );
}
