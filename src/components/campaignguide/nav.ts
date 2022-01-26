import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import { ScenarioProps } from '@components/campaignguide/ScenarioView';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import { ProcessedCampaign, ProcessedScenario } from '@data/scenario';
import { CampaignId } from '@actions/types';

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
