import React, { useMemo } from 'react';
import { flatMap } from 'lodash';

import OddsCalculatorComponent from '@components/campaign/OddsCalculatorComponent';
import { ChaosBag } from '@app_constants';
import Card from '@data/Card';
import { SCENARIO_CARDS_QUERY } from '@data/query';
import { useCampaign, useCycleScenarios, useInvestigatorCards } from '@components/core/hooks';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import LoadingSpinner from '@components/core/LoadingSpinner';

export interface GuideOddsCalculatorProps {
  campaignId: string;
  investigatorIds: string[];
  chaosBag: ChaosBag;
}

export default function GuideOddsCalculatorView({ campaignId, investigatorIds, chaosBag }: GuideOddsCalculatorProps) {
  const campaign = useCampaign(campaignId);
  const cycleScenarios = useCycleScenarios(campaign);

  const investigators = useInvestigatorCards();
  const allInvestigators: Card[] = useMemo(() => {
    return flatMap(investigatorIds, code => (investigators && investigators[code]) || []);
  }, [investigators, investigatorIds]);
  const [scenarioCards, loading] = useCardsFromQuery({ query: SCENARIO_CARDS_QUERY });
  if (!campaign) {
    return null;
  }
  if (loading) {
    return (
      <LoadingSpinner />
    );
  }
  return (
    <OddsCalculatorComponent
      campaign={campaign}
      chaosBag={chaosBag}
      cycleScenarios={cycleScenarios}
      allInvestigators={allInvestigators}
      scenarioCards={scenarioCards}
    />
  );
}
