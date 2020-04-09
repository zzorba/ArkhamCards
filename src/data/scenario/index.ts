import { find } from 'lodash';

import { NumberChoices } from 'actions/types';
import { FullCampaign, Effect } from './types';
import CampaignGuide, { CampaignLog } from './CampaignGuide';

export interface DisplayChoice {
  text?: string;
  flavor?: string;
  description?: string;
  steps?: string[] | null;
  effects?: Effect[] | null;
}

export interface DisplayChoiceWithId extends DisplayChoice {
  id: string;
}

export interface UniversalChoices {
  type: 'universal';
  choices: DisplayChoiceWithId[];
}

export interface PersonalizedChoices {
  type: 'personalized';
  choices: DisplayChoiceWithId[];
  perCode: NumberChoices;
}

export type Choices = PersonalizedChoices | UniversalChoices;

export function getCampaignGuide(
  id: string
): CampaignGuide | undefined {
  const allLogEntries: CampaignLog[] = require('../../../assets/campaignLogs.json');
  const allCampaigns: FullCampaign[] = require('../../../assets/allCampaigns.json');

  const campaign = find(allCampaigns, campaign =>
    campaign.campaign.id === id
  );
  const logEntries = find(allLogEntries, log => log.campaignId === id);
  return campaign && logEntries && new CampaignGuide(campaign, logEntries);
}

export default {
  getCampaignGuide,
};
