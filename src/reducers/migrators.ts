import { flatMap, map, forEach, omit } from 'lodash';
import uuid from 'react-native-uuid';

import { DeprecatedCampaign, Campaign, DeckId, Deck, getDeckId, CampaignGuideState, GuideInput, DecksMap } from '@actions/types';

export function migrateDecks(
  decks: Deck[]
): [DecksMap, { [key: string]: DeckId | undefined}] {
  const all: DecksMap = {};
  const deckMap: { [key: string]: DeckId | undefined} = {};

  forEach(decks, deck => {
    if (!deck) {
      return;
    }

    const updatedDeck: Deck = ((deck.id < 0 || deck.local) && !deck.uuid) ?
      {
        ...deck,
        local: true,
        uuid: uuid.v4(),
      } : { ...deck };
    const deckId = getDeckId(updatedDeck);
    all[deckId.uuid] = updatedDeck;
    deckMap[deckId.id] = deckId;
  });
  forEach(all, (deck: any) => {
    if (deck.previous_deck) {
      deck.previousDeckId = deckMap[deck.previous_deck] || undefined;
      delete deck.previous_deck;
    }
    if (deck.next_deck) {
      deck.nextDeckId = deckMap[deck.next_deck] || undefined;
      delete deck.next_deck;
    }
  });
  return [all, deckMap];
}

export function migrateCampaigns(
  legacyCampaigns: DeprecatedCampaign[],
  deckMap: { [numberId: number]: DeckId | undefined },
  allDecks: { [uuid: string]: Deck }
): [{
    [campaignUuid: string]: Campaign
  }, {
    [campaignId: string]: string;
  }] {

  const all: { [uuid: string]: Campaign } = {};
  const campaignUuids: { [id: string]: string} = {};
  forEach(legacyCampaigns, (campaign: DeprecatedCampaign) => {
    if (!campaign.uuid) {
      campaign.uuid = uuid.v4();
    }
    campaignUuids[campaign.id] = campaign.uuid;
  });
  forEach(legacyCampaigns, (campaign: DeprecatedCampaign) => {
    if (!campaign) {
      return;
    }
    let deckIds: DeckId[] = [];
    if (campaign.deckIds) {
      // Already migrated, nothing needed.
      deckIds = campaign.deckIds;
    } else if (campaign.baseDeckIds) {
      deckIds = flatMap(campaign.baseDeckIds, id => deckMap[id] || []);
    } else if (campaign.latestDeckIds) {
      // Very old campaign
      deckIds = flatMap(campaign.latestDeckIds, oldDeckId => {
        const deckId = deckMap[oldDeckId];
        if (!deckId) {
          return [];
        }
        let deck = allDecks[deckId.uuid];
        while (deck && deck.previousDeckId && deck.previousDeckId.uuid in allDecks) {
          deck = allDecks[deck.previousDeckId.uuid];
        }
        return deck ? getDeckId(deck) : [];
      });
    }
    const campaignUuid = campaign.uuid || uuid.v4();
    const newCampaign: Campaign = {
      ...omit(campaign, ['baseDeckIds', 'latestDeckIds', 'uuid', 'id', 'linkedCampaignId', 'link']),
      deckIds,
      uuid: campaignUuid,
    };
    if (campaign.linkedCampaignId) {
      newCampaign.linkedCampaignUuid = campaignUuids[campaign.linkedCampaignId];
    }
    if (campaign.link) {
      newCampaign.linkUuid = {
        campaignIdA: campaignUuids[campaign.link.campaignIdA],
        campaignIdB: campaignUuids[campaign.link.campaignIdB],
      };
    }
    all[campaignUuid] = newCampaign;
  });
  return [all, campaignUuids];
}

export function migrateGuides(
  guides: { [id: string]: CampaignGuideState | undefined },
  campaignMapping: { [id: string]: string },
  deckMap: { [numberId: number]: DeckId | undefined },
): { [id: string]: CampaignGuideState | undefined } {
  const all: { [uuid: string]: CampaignGuideState | undefined } = {};
  forEach(guides, (guide, id) => {
    if (guide && campaignMapping[id]) {
      const inputs: GuideInput[] = map(guide.inputs || [], input => {
        if (input.type === 'choice_list' && input.choices.deckId && input.choices.deckId.length) {
          const deckId = deckMap[input.choices.deckId[0]];
          if (!deckId) {
            return input;
          }
          return {
            ...input,
            deckId,
          };
        }
        return input;
      });
      all[campaignMapping[id]] = {
        ...guide,
        inputs,
      };
    }
  });
  return all;
}