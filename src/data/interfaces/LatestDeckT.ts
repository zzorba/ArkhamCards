import { CampaignId, Deck, DeckId } from '@actions/types';

export default interface LatestDeckT {
  id: DeckId;
  investigator: string;
  deck: Deck;
  previousDeck: Deck | undefined;
  campaignId: CampaignId | undefined;
}
