import { flatMap, map } from 'lodash';

export function campaignInvestigators(campaign, decks) {
  return map(
    flatMap(campaign.latestDeckIds || [], deckId => decks[deckId]),
    deck => deck.investigator_code);
}

export default {
  campaignInvestigators,
};
