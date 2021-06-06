import React, { useMemo } from 'react';
import { flatMap } from 'lodash';

import OddsCalculatorComponent from '@components/campaign/OddsCalculatorComponent';
import { ChaosBag } from '@app_constants';
import Card from '@data/types/Card';
import { useCycleScenarios, useInvestigatorCards } from '@components/core/hooks';
import { useCampaign } from '@data/hooks';
import { CampaignId } from '@actions/types';
import useGuideChaosBag from './useGuideChaosBag';
import LoadingSpinner from '@components/core/LoadingSpinner';

export interface GuideOddsCalculatorProps {
  campaignId: CampaignId;
  scenarioId?: string;
  standalone?: boolean;
  investigatorIds: string[];
  chaosBag: ChaosBag;
}

export default function GuideOddsCalculatorView({ campaignId, investigatorIds, chaosBag, scenarioId, standalone }: GuideOddsCalculatorProps) {
  const [loading, scenarioCard, scenarioCardText, difficulty, liveChaosBag, scenarioName, scenarioCode] = useGuideChaosBag({ campaignId, scenarioId, standalone });

  const campaign = useCampaign(campaignId);
  const cycleScenarios = useCycleScenarios(campaign?.cycleCode);

  const investigators = useInvestigatorCards();
  const allInvestigators: Card[] = useMemo(() => {
    return flatMap(investigatorIds, code => (investigators && investigators[code]) || []);
  }, [investigators, investigatorIds]);
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
      scenarioName={scenarioName}
      scenarioCardText={scenarioCardText}
      difficulty={difficulty}
    />
  );
}
