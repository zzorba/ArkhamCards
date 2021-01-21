import React, { useMemo } from 'react';
import { flatMap } from 'lodash';
import { useSelector } from 'react-redux';

import OddsCalculatorComponent from './OddsCalculatorComponent';
import { SCENARIO_CARDS_QUERY } from '@data/query';
import { AppState, makeCampaignSelector } from '@reducers';
import { useCycleScenarios, useInvestigatorCards } from '@components/core/hooks';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import LoadingSpinner from '@components/core/LoadingSpinner';

export interface OddsCalculatorProps {
  campaignId: string;
  investigatorIds: string[];
}

const EMPTY_CHAOS_BAG = {};
export default function OddsCalculatorView({ campaignId, investigatorIds }: OddsCalculatorProps) {
  const getCampaign = useMemo(makeCampaignSelector, []);
  const campaign = useSelector((state: AppState) => getCampaign(state, campaignId));
  const chaosBag = campaign?.chaosBag || EMPTY_CHAOS_BAG;
  const cycleScenarios = useCycleScenarios(campaign);
  const investigators = useInvestigatorCards();
  const allInvestigators = useMemo(() => flatMap(investigatorIds, code => investigators?.[code] || []), [investigatorIds, investigators]);
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
      chaosBag={chaosBag || {}}
      cycleScenarios={cycleScenarios}
      allInvestigators={allInvestigators}
      scenarioCards={scenarioCards}
    />
  );
}
