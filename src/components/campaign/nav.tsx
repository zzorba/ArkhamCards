import { Campaign, CampaignCycleCode, CampaignId } from '@actions/types';
import { ChaosBag } from '@app_constants';
import { CampaignLogProps } from '@components/campaignguide/CampaignLogView';
import { GuideDrawChaosBagProps } from '@components/campaignguide/GuideDrawChaosBagView';
import { GuideOddsCalculatorProps } from '@components/campaignguide/GuideOddsCalculatorView';
import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import Card from '@data/types/Card';
import { map } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import { AddScenarioResultProps } from './AddScenarioResultView';
import { CampaignDrawChaosBagProps } from './CampaignDrawChaosBagView';
import { CampaignDrawWeaknessProps } from './CampaignDrawWeaknessDialog';

import { EditChaosBagProps } from './EditChaosBagDialog';
import { OddsCalculatorProps } from './OddsCalculatorView';

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
  chaosBag: ChaosBag,
  investigatorIds: string[],
  scenarioId: string | undefined,
  standalone: boolean | undefined,
) {
  Navigation.push<GuideDrawChaosBagProps>(componentId, {
    component: {
      name: 'Guide.DrawChaosBag',
      passProps: {
        campaignId,
        chaosBag,
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
  allInvestigators: Card[],
  cycleCode: CampaignCycleCode
) {
  Navigation.push<CampaignDrawChaosBagProps>(componentId, {
    component: {
      name: 'Campaign.DrawChaosBag',
      passProps: {
        campaignId,
        allInvestigators,
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

export function showChaosBagOddsCalculator(componentId: string, campaignId: CampaignId, allInvestigators: Card[]) {
  Navigation.push<OddsCalculatorProps>(componentId, {
    component: {
      name: 'OddsCalculator',
      passProps: {
        campaignId,
        investigatorIds: map(allInvestigators, card => card.code),
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
  standalone: boolean | undefined
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