import { CampaignId, DeckId } from '@actions/types';

export default interface MiniDeckT {
  id: DeckId;
  name: string;
  investigator: string;
  date_update: string;
  campaign_id?: CampaignId;
  tags?: string[];
}
