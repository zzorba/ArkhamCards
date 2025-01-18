import React, { useMemo } from 'react';
import { filter, find, flatMap, head } from 'lodash';

import OddsCalculatorComponent, { SCENARIO_CODE_FIXER } from './OddsCalculatorComponent';
import { useCycleScenarios, useInvestigators } from '@components/core/hooks';
import { useCampaign, useChaosBagResults } from '@data/hooks';

import { CampaignDifficulty, CampaignId } from '@actions/types';
import { completedScenario } from '@components/campaign/constants';
import { SCENARIO_CARDS_QUERY } from '@data/sqlite/query';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import LoadingSpinner from '@components/core/LoadingSpinner';

export interface OddsCalculatorProps {
  campaignId: CampaignId;
  investigatorIds: string[];
}

const EMPTY_CHAOS_BAG = {};

export default function OddsCalculatorView({ campaignId, investigatorIds }: OddsCalculatorProps) {
  const campaign = useCampaign(campaignId);
  const chaosBag = campaign?.chaosBag || EMPTY_CHAOS_BAG;
  const cycleScenarios = useCycleScenarios(campaign?.cycleCode);
  const investigators = useInvestigators(investigatorIds);
  const allInvestigators = useMemo(() => flatMap(investigatorIds, code => investigators?.[code] || []), [investigatorIds, investigators]);

  const currentScenario = useMemo(() => {
    const hasCompletedScenario = completedScenario(campaign ? campaign.scenarioResults : []);
    return head(
      filter(cycleScenarios, scenario =>
        !scenario.interlude &&
        !hasCompletedScenario(scenario)
      )
    ) || undefined;
  }, [campaign, cycleScenarios]);
  const [scenarioCards, loading] = useCardsFromQuery({ query: SCENARIO_CARDS_QUERY });
  const encounterCode = useMemo(() => {
    const encounterCode = currentScenario && (
      currentScenario.code.startsWith('return_to_') ?
        currentScenario.code.substring('return_to_'.length) :
        currentScenario.code);
    if (encounterCode && SCENARIO_CODE_FIXER[encounterCode]) {
      return SCENARIO_CODE_FIXER[encounterCode];
    }
    return encounterCode;
  }, [currentScenario]);
  const [scenarioCard, scenarioCardText, difficulty] = useMemo(() => {
    const difficulty = campaign ? campaign.difficulty : undefined;
    const scenarioCard = (scenarioCards && encounterCode) ?
      find(scenarioCards, card => card.encounter_code === encounterCode) :
      undefined;
    const scenarioCardText = difficulty === CampaignDifficulty.HARD || difficulty === CampaignDifficulty.EXPERT ? scenarioCard?.back_text : scenarioCard?.text;
    return [
      scenarioCard,
      scenarioCardText,
      difficulty,
    ];
  }, [encounterCode, scenarioCards, campaign]);
  const chaosBagResults = useChaosBagResults(campaignId);

  if (!campaign || loading) {
    return <LoadingSpinner />;
  }
  return (
    <OddsCalculatorComponent
      campaign={campaign}
      chaosBag={chaosBag || {}}
      cycleScenarios={cycleScenarios}
      allInvestigators={allInvestigators}
      difficulty={difficulty}
      scenarioCard={scenarioCard}
      scenarioCode={encounterCode}
      scenarioIcon={encounterCode}
      scenarioCardText={scenarioCardText}
      scenarioName={currentScenario?.name}
      chaosBagResults={chaosBagResults}
    />
  );
}
