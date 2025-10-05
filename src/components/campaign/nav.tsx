import { Campaign, CampaignCycleCode, CampaignId } from '@actions/types';
import { ChaosBag } from '@app_constants';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog, { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';
import { map } from 'lodash';

import { ArkhamNavigation } from '@navigation/types';

export function showAddScenarioResult(navigation: ArkhamNavigation, campaignId: CampaignId, scenarioCode?: string) {
  navigation.navigate('Campaign.AddResult', {
    id: campaignId,
    scenarioCode,
  });
}

export function showEditChaosBag(navigation: ArkhamNavigation, campaign: Campaign, updateChaosBag: (chaosBag: ChaosBag) => void) {
  navigation.navigate('Dialog.EditChaosBag', {
    chaosBag: campaign.chaosBag || {},
    updateChaosBag,
    trackDeltas: true,
    cycleCode: campaign.cycleCode,
  });
}

export function showGuideCampaignLog(
  navigation: ArkhamNavigation,
  campaignId: CampaignId,
  campaignGuide: CampaignGuide,
  campaignLog: GuidedCampaignLog,
  { standalone, hideChaosBag }: { standalone: boolean; hideChaosBag?: boolean },
  scenarioId: string | undefined,
  processedCampaign: ProcessedCampaign | undefined
) {
  navigation.navigate('Guide.Log', {
    campaignId,
    campaignLog,
    scenarioId,
    campaignGuide,
    standalone,
    hideChaosBag,
    processedCampaign,
  });
}

export function showGuideDrawChaosBag(
  navigation: ArkhamNavigation,
  campaignId: CampaignId,
  investigatorIds: string[],
  scenarioId: string | undefined,
  standalone: boolean | undefined,
) {
  navigation.navigate('Guide.DrawChaosBag', {
    campaignId,
    investigatorIds,
    scenarioId,
    standalone,
  });
}

export function showDrawChaosBag(
  navigation: ArkhamNavigation,
  campaignId: CampaignId,
  allInvestigators: CampaignInvestigator[] | undefined,
  cycleCode: CampaignCycleCode
) {
  navigation.navigate('Campaign.DrawChaosBag', {
    campaignId,
    allInvestigators: allInvestigators || [],
    cycleCode,
  });
}

export function showChaosBagOddsCalculator(
  navigation: ArkhamNavigation,
  campaignId: CampaignId,
  allInvestigators: CampaignInvestigator[] | undefined
) {
  navigation.navigate('OddsCalculator', {
    campaignId,
    investigatorIds: map(allInvestigators, card => card.card.code),
  });
}

export function showGuideChaosBagOddsCalculator(
  navigation: ArkhamNavigation,
  campaignId: CampaignId,
  chaosBag: ChaosBag,
  investigatorIds: string[],
  scenarioId: string | undefined,
  standalone: boolean | undefined,
  processedCampaign: ProcessedCampaign | undefined,
) {
  navigation.navigate('Guide.OddsCalculator', {
    campaignId,
    investigatorIds,
    chaosBag,
    scenarioId,
    standalone,
    processedCampaign,
  });
}

export function showDrawWeakness(navigation: ArkhamNavigation, campaignId: CampaignId) {
  navigation.navigate('Dialog.CampaignDrawWeakness', { campaignId });
}