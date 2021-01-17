import { find, forEach } from 'lodash';

import { Deck, DecksMap, Campaign } from '@actions/types';
import { getNextLocalDeckId, getNextCampaignId, AppState } from '@reducers';

enum CloudMergeStatus {
  NEW = 'new',
  UPDATE = 'update',
  STALE = 'stale',
  NO_CHANGE = 'no_change',
}

interface CloudMergeResult {
  status: CloudMergeStatus;
  cloudId: number;
  localId: number;
}

export function campaignFromJson(json: any) {
  return json;
}

function mergeLocalDeck(cloudDeck: Deck, decks: DecksMap, nextLocalDeckId: number): CloudMergeResult {
  const localDeck = find(decks, deck => {
    return !!(deck.local && deck.uuid && deck.uuid === cloudDeck.uuid);
  });
  if (!localDeck) {
    return {
      status: CloudMergeStatus.NEW,
      cloudId: cloudDeck.id,
      localId: nextLocalDeckId,
    };
  }
  const cloudUpdated = Date.parse(cloudDeck.date_update);
  const localUpdated = Date.parse(localDeck.date_update);
  if (cloudUpdated === localUpdated) {
    return {
      status: CloudMergeStatus.NO_CHANGE,
      cloudId: cloudDeck.id,
      localId: localDeck.id,
    };
  }
  const stale = (cloudUpdated < localUpdated);
  return {
    status: stale ? CloudMergeStatus.STALE : CloudMergeStatus.UPDATE,
    cloudId: cloudDeck.id,
    localId: localDeck.id,
  };
}

export interface DeckMergeResult {
  newDecks: Deck[];
  updatedDecks: Deck[];
  staleDecks: Deck[];
  sameDecks: Deck[];

  upgradeDecks: DecksMap;

  scenarioCount: {
    [key: string]: number;
  };

  localRemapping: {
    // Map json-id to local-id.
    [key: number]: number;
  };
}

export function mergeDecks(cloudDecks: Deck[], state: AppState): DeckMergeResult {
  let nextLocalDeckId = getNextLocalDeckId(state);
  const localRemapping: { [key: number]: number } = {};
  const deckStatus: { [id: string]: CloudMergeStatus } = {};
  forEach(cloudDecks, cloudDeck => {
    const { status, cloudId, localId } = mergeLocalDeck(cloudDeck, state.decks.all, nextLocalDeckId);
    nextLocalDeckId = Math.min(localId - 1, nextLocalDeckId);
    localRemapping[cloudId] = localId;

    deckStatus[cloudDeck.id] = status;
  });


  const newDecks: Deck[] = [];
  const updatedDecks: Deck[] = [];
  const staleDecks: Deck[] = [];
  const sameDecks: Deck[] = [];
  const upgradeDecks: DecksMap = {};
  const scenarioCount: { [key: string]: number } = {};
  forEach(cloudDecks, deck => {
    if (deck.previous_deck) {
      // Part of an upgrade chain, and not the latest.
      upgradeDecks[deck.id] = deck;
      return;
    }
    let hasUpdate = false;
    let hasNew = false;
    let hasStale = false;
    let currentDeck: Deck | undefined = deck;
    let count = 0;
    do {
      count++;
      switch (deckStatus[currentDeck.id]) {
        case CloudMergeStatus.NEW:
          hasNew = true;
          break;
        case CloudMergeStatus.NO_CHANGE:
          break;
        case CloudMergeStatus.UPDATE:
          hasUpdate = true;
          break;
        case CloudMergeStatus.STALE:
          hasStale = true;
          break;
      }
      if (!currentDeck.next_deck) {
        scenarioCount[deck.id] = count;
        break;
      }
      currentDeck = find(cloudDecks, d => !!currentDeck && d.id === currentDeck.next_deck);
    } while (currentDeck);
    if (hasNew) {
      newDecks.push(deck);
    } else if (hasStale) {
      staleDecks.push(deck);
    } else if (hasUpdate) {
      updatedDecks.push(deck);
    } else {
      sameDecks.push(deck);
    }
  });
  return {
    newDecks,
    updatedDecks,
    staleDecks,
    sameDecks,
    upgradeDecks,
    localRemapping,
    scenarioCount,
  };
}

function lastUpdated(campaign: Campaign): Date {
  if (typeof campaign.lastUpdated === 'string') {
    return new Date(Date.parse(campaign.lastUpdated));
  }
  return campaign.lastUpdated;
}

function mergeLocalCampaign(cloudCampaign: Campaign, campaigns: { [key: number]: Campaign }, nextLocalCampaignId: number): CloudMergeResult {
  const localCampaign = find(campaigns, campaign => {
    return !!campaign.uuid && campaign.uuid === cloudCampaign.uuid;
  });
  if (!localCampaign) {
    return {
      status: CloudMergeStatus.NEW,
      localId: nextLocalCampaignId,
      cloudId: cloudCampaign.id,
    };
  }
  const cloudTime = lastUpdated(cloudCampaign);
  const localTime = lastUpdated(localCampaign);
  if (cloudTime.getTime() === localTime.getTime()) {
    return {
      status: CloudMergeStatus.NO_CHANGE,
      localId: localCampaign.id,
      cloudId: cloudCampaign.id,
    };
  }

  const stale = (cloudTime.getTime() < localTime.getTime());
  return {
    status: stale ? CloudMergeStatus.STALE : CloudMergeStatus.UPDATE,
    localId: localCampaign.id,
    cloudId: cloudCampaign.id,
  };
}

export interface CampaignMergeResult {
  // Renumbered with local numbers.
  newCampaigns: Campaign[];
  updatedCampaigns: Campaign[];
  staleCampaigns: Campaign[];
  sameCampaigns: Campaign[];

  localRemapping: {
    // Map json-id to local-id.
    [key: number]: number;
  };
}

export function mergeCampaigns(cloudCampaigns: Campaign[], state: AppState): CampaignMergeResult {
  let nextCampaignId = getNextCampaignId(state);
  const localRemapping: { [key: number]: number } = {};
  const newCampaigns: Campaign[] = [];
  const updatedCampaigns: Campaign[] = [];
  const staleCampaigns: Campaign[] = [];
  const sameCampaigns: Campaign[] = [];
  forEach(cloudCampaigns, cloudCampaign => {
    const { status, cloudId, localId } = mergeLocalCampaign(cloudCampaign, state.campaigns.all, nextCampaignId);
    nextCampaignId = Math.max(localId + 1, nextCampaignId);
    localRemapping[cloudId] = localId;
    switch (status) {
      case CloudMergeStatus.NEW:
        newCampaigns.push({ ...cloudCampaign });
        break;
      case CloudMergeStatus.UPDATE:
        updatedCampaigns.push({ ...cloudCampaign });
        break;
      case CloudMergeStatus.STALE:
        staleCampaigns.push({ ...cloudCampaign });
        break;
      case CloudMergeStatus.NO_CHANGE:
        sameCampaigns.push({ ...cloudCampaign });
        break;
    }
  });
  return {
    newCampaigns,
    updatedCampaigns,
    staleCampaigns,
    localRemapping,
    sameCampaigns,
  };
}
