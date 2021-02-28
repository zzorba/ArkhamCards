import React, { useMemo } from 'react';
import { flatMap } from 'lodash';

import OddsCalculatorComponent from '@components/campaign/OddsCalculatorComponent';
import { ChaosBag } from '@app_constants';
import Card from '@data/types/Card';
import { useCycleScenarios, useInvestigatorCards } from '@components/core/hooks';
import { useCampaign } from '@data/remote/hooks';
import { CampaignId } from '@actions/types';

export interface GuideOddsCalculatorProps {
  campaignId: CampaignId;
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
  if (!campaign) {
    return null;
  }
  return (
    <OddsCalculatorComponent
      campaign={campaign}
      chaosBag={chaosBag}
      cycleScenarios={cycleScenarios}
      allInvestigators={allInvestigators}
    />
  );
}
