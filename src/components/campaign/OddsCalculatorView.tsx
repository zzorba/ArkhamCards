import React, { useMemo } from 'react';
import { flatMap, forEach } from 'lodash';
import { useSelector } from 'react-redux';

import OddsCalculatorComponent from './OddsCalculatorComponent';
import CardQueryWrapper from '@components/card/CardQueryWrapper';
import { campaignScenarios, Scenario } from '@components/campaign/constants';
import { SCENARIO_CARDS_QUERY } from '@data/query';
import { AppState, getCampaign } from '@reducers';
import { useInvestigatorCards } from '@components/core/hooks';

export interface OddsCalculatorProps {
  campaignId: number;
  investigatorIds: string[];
}

const EMPTY_CHAOS_BAG = {};
export default function OddsCalculatorView({ campaignId, investigatorIds }: OddsCalculatorProps) {
  const campaign = useSelector((state: AppState) => getCampaign(state, campaignId));
  const chaosBag = campaign?.chaosBag || EMPTY_CHAOS_BAG;
  const cycleScenarios = useMemo(() => campaign ? campaignScenarios(campaign.cycleCode) : [], [campaign]);
  const scenarioByCode = useMemo(() => {
    const result: { [code: string]: Scenario } = {};
    forEach(cycleScenarios, scenario => {
      result[scenario.code] = scenario;
    });
    return result;
  }, [cycleScenarios]);
  const investigators = useInvestigatorCards();
  const allInvestigators = useMemo(() => flatMap(investigatorIds, code => investigators?.[code] || []), [investigatorIds, investigators]);

  if (!campaign) {
    return null;
  }
  return (
    <CardQueryWrapper name="odds" query={SCENARIO_CARDS_QUERY}>
      { scenarioCards => (
        <OddsCalculatorComponent
          campaign={campaign}
          chaosBag={chaosBag || {}}
          cycleScenarios={cycleScenarios}
          scenarioByCode={scenarioByCode}
          allInvestigators={allInvestigators}
          scenarioCards={scenarioCards}
        />
      ) }
    </CardQueryWrapper>
  );
}
