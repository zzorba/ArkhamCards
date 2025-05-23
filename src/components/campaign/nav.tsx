import { Campaign, CampaignCycleCode, CampaignId } from '@actions/types';
import { ChaosBag } from '@app_constants';
import { CampaignLogProps } from '@components/campaignguide/CampaignLogView';
import { GuideDrawChaosBagProps } from '@components/chaos/GuideDrawChaosBagView';
import { GuideOddsCalculatorProps } from '@components/chaos/GuideOddsCalculatorView';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog, { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import { map } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import { AddScenarioResultProps } from './AddScenarioResultView';
import { CampaignDrawChaosBagProps } from '../chaos/CampaignDrawChaosBagView';
import { CampaignDrawWeaknessProps } from './CampaignDrawWeaknessDialog';

import { EditChaosBagProps } from '../chaos/EditChaosBagDialog';
import { OddsCalculatorProps } from '../chaos/OddsCalculatorView';

export function showAddScenarioResult(componentId: string, campaignId: CampaignId, scenarioCode?: string) {
  Navigation.push<AddScenarioResultProps>(componentId, {
    component: {
      name: 'Campaign.AddResult',
      passProps: {
        id: campaignId,
        scenarioCode,
      },
    },
  });
}

export function showEditChaosBag(componentId: string, campaign: Campaign, updateChaosBag: (chaosBag: ChaosBag) => void) {
  Navigation.push<EditChaosBagProps>(componentId, {
    component: {
      name: 'Dialog.EditChaosBag',
      passProps: {
        chaosBag: campaign.chaosBag || {},
        updateChaosBag,
        trackDeltas: true,
        cycleCode: campaign.cycleCode,
      },
      options: {
        topBar: {
          title: {
            text: t`Chaos Bag`,
          },
          backButton: {
            title: t`Cancel`,
          },
        },
      },
    },
  });
}


export function showGuideCampaignLog(
  componentId: string,
  campaignId: CampaignId,
  campaignGuide: CampaignGuide,
  campaignLog: GuidedCampaignLog,
  { standalone, hideChaosBag }: { standalone: boolean; hideChaosBag?: boolean },
  scenarioId: string | undefined,
  processedCampaign: ProcessedCampaign | undefined
) {
  Navigation.push<CampaignLogProps>(componentId, {
    component: {
      name: 'Guide.Log',
      passProps: {
        campaignId,
        campaignLog,
        scenarioId,
        campaignGuide,
        standalone,
        hideChaosBag,
        processedCampaign,
      },
      options: {
        topBar: {
          title: {
            text: t`Campaign Log`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}

export function showGuideDrawChaosBag(
  componentId: string,
  campaignId: CampaignId,
  investigatorIds: string[],
  scenarioId: string | undefined,
  standalone: boolean | undefined,
) {
  Navigation.push<GuideDrawChaosBagProps>(componentId, {
    component: {
      name: 'Guide.DrawChaosBag',
      passProps: {
        campaignId,
        investigatorIds,
        scenarioId,
        standalone,
      },
      options: {
        topBar: {
          title: {
            text: t`Chaos Bag`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}

export function showDrawChaosBag(
  componentId: string,
  campaignId: CampaignId,
  allInvestigators: CampaignInvestigator[] | undefined,
  cycleCode: CampaignCycleCode
) {
  Navigation.push<CampaignDrawChaosBagProps>(componentId, {
    component: {
      name: 'Campaign.DrawChaosBag',
      passProps: {
        campaignId,
        allInvestigators: allInvestigators || [],
        cycleCode,
      },
      options: {
        topBar: {
          title: {
            text: t`Chaos Bag`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}

export function showChaosBagOddsCalculator(componentId: string, campaignId: CampaignId, allInvestigators: CampaignInvestigator[] | undefined) {
  Navigation.push<OddsCalculatorProps>(componentId, {
    component: {
      name: 'OddsCalculator',
      passProps: {
        campaignId,
        investigatorIds: map(allInvestigators, card => card.card.code),
      },
      options: {
        topBar: {
          title: {
            text: t`Odds Calculator`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}


export function showGuideChaosBagOddsCalculator(
  componentId: string,
  campaignId: CampaignId,
  chaosBag: ChaosBag,
  investigatorIds: string[],
  scenarioId: string | undefined,
  standalone: boolean | undefined,
  processedCampaign: ProcessedCampaign | undefined,
) {
  Navigation.push<GuideOddsCalculatorProps>(componentId, {
    component: {
      name: 'Guide.OddsCalculator',
      passProps: {
        campaignId,
        investigatorIds,
        chaosBag,
        scenarioId,
        standalone,
        processedCampaign,
      },
      options: {
        topBar: {
          title: {
            text: t`Odds Calculator`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}

export function showDrawWeakness(componentId: string, campaignId: CampaignId) {
  Navigation.push<CampaignDrawWeaknessProps>(componentId, {
    component: {
      name: 'Dialog.CampaignDrawWeakness',
      passProps: {
        campaignId,
      },
      options: {
        topBar: {
          title: {
            text: t`Draw Weaknesses`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}