import { find, forEach, update } from 'lodash';

import { Deck, DecksMap, Campaign } from '@actions/types';
import { getNextLocalDeckId, getNextCampaignId, AppState } from '@reducers';

enum CloudMergeStatus {
  NEW = 'new',
  UPDATE = 'update',
  STALE = 'stale',
};

interface CloudMergeResult {
  status: CloudMergeStatus;
  cloudId: number;
  localId: number;
}

export function campaignFromJson(json: any) {
  return {
    ...json,
    lastUpdated: new Date(Date.parse(json.lastUpdated)),
  };
}

function mergeLocalDeck(cloudDeck: Deck, decks: DecksMap, nextLocalDeckId: number): CloudMergeResult {
  const localDeck = find(decks, deck => {
    return !!(deck.local && deck.local_uuid ===  cloudDeck.local_uuid);
  });
  if (!localDeck) {
    return {
      status: CloudMergeStatus.NEW,
      cloudId: cloudDeck.id,
      localId: nextLocalDeckId,
    };
  }
  const stale = (Date.parse(cloudDeck.date_update) < Date.parse(localDeck.date_update));
  return {
    status: stale ? CloudMergeStatus.STALE : CloudMergeStatus.UPDATE,
    cloudId: cloudDeck.id,
    localId: localDeck.id,
  };
}

export interface DeckMergeResult {
  // Renumbered with local numbers.
  newDecks: Deck[];
  updatedDecks: Deck[];
  staleDecks: Deck[];

  localRemapping: {
    // Map json-id to local-id.
    [key: number]: number;
  };
}

export function mergeDecks(cloudDecks: Deck[], state: AppState): DeckMergeResult {
  let nextLocalDeckId = getNextLocalDeckId(state);
  const localRemapping: { [key: number]: number } = {};
  const newDecks: Deck[] = [];
  const updatedDecks: Deck[] = [];
  const staleDecks: Deck[] = [];

  forEach(cloudDecks, cloudDeck => {
    const { status, cloudId, localId } = mergeLocalDeck(cloudDeck, state.decks.all, nextLocalDeckId);
    nextLocalDeckId = Math.min(localId - 1, nextLocalDeckId);
    localRemapping[cloudId] = localId;
    switch (status) {
      case CloudMergeStatus.NEW:
        newDecks.push({ ...cloudDeck });
        break;
      case CloudMergeStatus.UPDATE:
        updatedDecks.push({ ...cloudDeck });
        break;
      case CloudMergeStatus.STALE:
        staleDecks.push({ ...cloudDeck });
        break;
    }
  });
  return {
    newDecks,
    updatedDecks,
    staleDecks,
    localRemapping,
  };
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
  const stale = (cloudCampaign.lastUpdated.getTime() < localCampaign.lastUpdated.getTime());
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
    }
  });
  return {
    newCampaigns,
    updatedCampaigns,
    staleCampaigns,
    localRemapping,
  };
}
