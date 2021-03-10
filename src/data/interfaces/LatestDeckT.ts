import { Deck, Trauma } from '@actions/types';
import MiniDeckT from './MiniDeckT';

export interface DeckCampaignInfo {
  name: string;
  trauma: Trauma;
}

export default interface LatestDeckT extends MiniDeckT {
  deck: Deck;
  previousDeck: Deck | undefined;
  campaign?: DeckCampaignInfo;
}
