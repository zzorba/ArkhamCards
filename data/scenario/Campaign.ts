import { FullCampaign } from './types';

/**
 * Wrapper utility to provide structured access to campaigns.
 */
export default class Campaign {
  campaign: FullCampaign;
  constructor(campaign: FullCampaign) {
    this.campaign = campaign;
  }

  scenarios() {

  }
}
