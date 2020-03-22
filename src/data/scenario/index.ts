import { find } from 'lodash';

import { FullCampaign } from './types';
import CampaignGuide, { CampaignLog } from './CampaignGuide';
import Card from 'data/Card';
import { Deck } from 'actions/types';

export interface InvestigatorDeck {
  investigator: Card;
  deck: Deck;
}

export const INVESTIGATOR_STATUS_ID = 'investigator_status';

export enum InvestigatorResolutionStatus {
  ALIVE = 'alive',
  RESIGNED = 'resigned',
  DEFEATED_PHYSICAL = 'physical',
  DEFEATED_MENTAL = 'mental',
  DEFEATED_SCENARIO = 'eliminated',
};
export const ORDERED_INVESTIGATOR_STATUS = [
  InvestigatorResolutionStatus.ALIVE,
  InvestigatorResolutionStatus.RESIGNED,
  InvestigatorResolutionStatus.DEFEATED_PHYSICAL,
  InvestigatorResolutionStatus.DEFEATED_MENTAL,
  InvestigatorResolutionStatus.DEFEATED_SCENARIO,
];

export function getCampaignGuide(id: string): CampaignGuide | undefined {
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
