import React, { useCallback, useContext, useMemo } from 'react';
import { t } from 'ttag';

import CampaignScenarioButton from '@components/campaign/CampaignScenarioButton';
import { showScenario } from '@components/campaignguide/nav';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { ProcessedScenario } from '@data/scenario';

interface Props {
  componentId: string;
  campaignId: number;
  campaignGuide: CampaignGuide;
  scenario: ProcessedScenario;
  linked: boolean;
  showLinkedScenario?: (
    scenarioId: string
  ) => void;
}

export default function ScenarioButton({ componentId, campaignId, campaignGuide, scenario, linked, showLinkedScenario }: Props) {
  const { campaignState } = useContext(CampaignGuideContext);
  const name = useMemo(() => {
    const attempt = (scenario.id.replayAttempt || 0) + 1;
    const scenarioName = scenario.scenarioGuide.scenarioType() === 'scenario' ?
      scenario.scenarioGuide.scenarioName() :
      scenario.scenarioGuide.fullScenarioName();
    if (attempt > 1) {
      return t`${scenarioName} (Attempt ${attempt})`;
    }
    return scenarioName;
  }, [scenario]);

  const onPress = useCallback(() => {
    showScenario(
      componentId,
      scenario,
      campaignId,
      campaignState,
      linked ? campaignGuide.campaignName() : undefined,
      showLinkedScenario
    );
  }, [componentId, scenario, campaignId, campaignGuide, linked, showLinkedScenario, campaignState]);
  return (
    <CampaignScenarioButton
      onPress={onPress}
      status={scenario.type}
      title={name}
    />
  );
}
