import { CampaignId, Deck, Trauma } from '@actions/types';
import MiniDeckT from './MiniDeckT';

export interface DeckCampaignInfo {
  id: CampaignId;
  name: string;
  trauma: Trauma;
}

export default interface LatestDeckT extends MiniDeckT {
  deck: Deck;
  previousDeck: Deck | undefined;
  campaign?: DeckCampaignInfo;
}
