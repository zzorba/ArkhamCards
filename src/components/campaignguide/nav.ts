import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { ScenarioProps } from '@components/campaignguide/ScenarioView';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import { CampaignId } from '@actions/types';
import { CampaignRulesProps } from './CampaignRulesView';
import { CAMPAIGN_SETUP_ID } from '@data/scenario/CampaignGuide';
import { CampaignRule, Question } from '@data/scenario/types';

export function showRules(
  componentId: string,
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

  Navigation.push<CampaignRulesProps>(
    componentId, {
      component: {
        name: 'Guide.Rules',
        passProps: {
          campaignId,
          scenarioId: scenarioId ?? CAMPAIGN_SETUP_ID,
          standalone: false,
          rules,
          campaignErrata,
          scenarioErrata: scenarioErrata ?? [],
        },
        options: {
          topBar: {
            title: {
              text: header,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    },
  );
}
export function showScenario(
  componentId: string,
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
  Navigation.push<ScenarioProps>(componentId, {
    component: {
      name: 'Guide.Scenario',
      passProps: {
        campaignId,
        scenarioId,
        showLinkedScenario,
        processedCampaign,
      },
      options: {
        topBar: {
          title: {
            text: scenario.scenarioGuide.scenarioName(),
          },
          subtitle: subtitle ? {
            text: subtitle,
          } : undefined,
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}

export default {
  showScenario,
};
