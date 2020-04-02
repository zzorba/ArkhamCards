import { find } from 'lodash';

import { Deck, ListChoices } from 'actions/types';
import { FullCampaign, Effect } from './types';
import CampaignGuide, { CampaignLog } from './CampaignGuide';
import Card from 'data/Card';

export interface InvestigatorDeck {
  investigator: Card;
  deck?: Deck;
}

export interface DisplayChoice {
  text?: string;
  flavor?: string;
  description?: string;
  steps?: string[] | null;
  effects?: Effect[] | null;
}


export interface UniversalChoices {
  type: 'universal';
  choices: DisplayChoice[];
}

export interface PersonalizedChoices {
  type: 'personalized';
  choices: DisplayChoice[];
  perCode: ListChoices;
}

export type Choices = PersonalizedChoices | UniversalChoices;

export function getCampaignGuide(
  id: string
): CampaignGuide | undefined {
  const allLogEntries: CampaignLog[] = require('../../../assets/campaignLogs.json');
  const allCampaigns: FullCampaign[] = require('../../../assets/allCampaigns.json');

  const theId = (id === 'core' ? 'notz' : id);
  const campaign = find(allCampaigns, campaign =>
    campaign.campaign.id === theId
  );
  const logEntries = find(allLogEntries, log => log.campaignId === theId);
  return campaign && logEntries && new CampaignGuide(campaign, logEntries);
}

export default {
  getCampaignGuide,
};
