import { find } from 'lodash';

import { FullCampaign } from './types';
import Campaign from './Campaign';

const allCampaigns: FullCampaign[] = require('../../assets/allCampaigns.json');

function getCampaign(id: string): Campaign | undefined {
  const campaign = find(allCampaigns, campaign => campaign.campaign.id === id);
  return campaign && new Campaign(campaign);
}

export default {
  getCampaign,
};
