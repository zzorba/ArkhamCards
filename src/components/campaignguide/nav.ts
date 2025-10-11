
import { t } from 'ttag';

import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import { CampaignId } from '@actions/types';
import { CAMPAIGN_SETUP_ID } from '@data/scenario/CampaignGuide';
import { CampaignRule, Question } from '@data/scenario/types';
import { ArkhamNavigation } from '@navigation/types';

export function showRules(
  navigation: ArkhamNavigation,
  campaignId: CampaignId,
  { rules, campaignErrata, scenarioErrata, scenarioId } : {
    rules: CampaignRule[];
    campaignErrata: Question[];
    scenarioErrata?: Question[];
    scenarioId?: string;
  }
) {
  let header: string;
  if (rules.length && (campaignErrata.length || scenarioErrata?.length)) {
    header = scenarioId ? t`Rules & FAQ` : t`Campaign Rules & FAQ`;
  } else if (rules.length) {
    header = scenarioId ? t`Rules` : t`Campaign Rules`;
  } else if (campaignErrata.length || scenarioErrata?.length) {
    header = scenarioId ? t`FAQ` : t`Campaign FAQ`;
  } else {
    return;
  }

  navigation.navigate(
    'Guide.Rules', {
      campaignId,
      scenarioId: scenarioId ?? CAMPAIGN_SETUP_ID,
      standalone: false,
      rules,
      campaignErrata,
      scenarioErrata: scenarioErrata ?? [],
      header,
    },
  );
}
export function showScenario(
  navigation: ArkhamNavigation,
  scenario: ProcessedScenario,
  campaignId: CampaignId,
  campaignState: CampaignStateHelper,
  subtitle?: string,
  showLinkedScenario?: (
    scenarioId: string
  ) => void,
  processedCampaign?: ProcessedCampaign
) {
  const scenarioId = scenario.scenarioGuide.id;
  if (scenario.type === 'playable') {
    campaignState.startScenario(scenarioId);
  }
  navigation.navigate('Guide.Scenario', {
    campaignId,
    scenarioId,
    showLinkedScenario,
    processedCampaign,
    title: scenario.scenarioGuide.scenarioName(),
    subtitle,
  });
}

export default {
  showScenario,
};
