import { CampaignCycleCode, CampaignId, Deck, Trauma } from '@actions/types';
import { SimpleUser } from '@data/remote/hooks';
import MiniDeckT from './MiniDeckT';

export interface DeckCampaignInfo {
  id: CampaignId;
  name: string;
  trauma: Trauma;
  cycleCode: CampaignCycleCode;
}

export default interface LatestDeckT extends MiniDeckT {
  owner: SimpleUser | undefined;
  deck: Deck;
  previousDeck: Deck | undefined;
  campaign?: DeckCampaignInfo;
}
