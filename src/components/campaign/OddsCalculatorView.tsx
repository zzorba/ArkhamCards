import React, { useMemo } from 'react';
import { flatMap } from 'lodash';

import OddsCalculatorComponent from './OddsCalculatorComponent';
import { useCycleScenarios, useInvestigatorCards } from '@components/core/hooks';
import { useCampaign } from '@data/remote/hooks';

import { CampaignId } from '@actions/types';

export interface OddsCalculatorProps {
  campaignId: CampaignId;
  investigatorIds: string[];
}

const EMPTY_CHAOS_BAG = {};
export default function OddsCalculatorView({ campaignId, investigatorIds }: OddsCalculatorProps) {
  const campaign = useCampaign(campaignId);
  const chaosBag = campaign?.chaosBag || EMPTY_CHAOS_BAG;
  const cycleScenarios = useCycleScenarios(campaign);
  const investigators = useInvestigatorCards();
  const allInvestigators = useMemo(() => flatMap(investigatorIds, code => investigators?.[code] || []), [investigatorIds, investigators]);
  if (!campaign) {
    return null;
  }
  return (
    <OddsCalculatorComponent
      campaign={campaign}
      chaosBag={chaosBag || {}}
      cycleScenarios={cycleScenarios}
      allInvestigators={allInvestigators}
    />
  );
}
