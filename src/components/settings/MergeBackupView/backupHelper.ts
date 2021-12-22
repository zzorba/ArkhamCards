import { find, forEach } from 'lodash';

import { Deck, DecksMap, Campaign, LocalDeck } from '@actions/types';
import { AppState } from '@reducers';

const enum CloudMergeStatus {
  NEW = 'new',
  UPDATE = 'update',
  STALE = 'stale',
  NO_CHANGE = 'no_change',
}

interface CloudMergeResult {
  status: CloudMergeStatus;
  cloudId: string;
}

export function campaignFromJson(json: any) {
  return json;
}

function mergeLocalDeck(cloudDeck: LocalDeck, decks: DecksMap): CloudMergeResult {
  const localDeck = find(decks, deck => {
    return !!(deck.local && deck.uuid && deck.uuid === cloudDeck.uuid);
  });
  if (!localDeck) {
    return {
      status: CloudMergeStatus.NEW,
      cloudId: cloudDeck.uuid,
    };
  }
  const cloudUpdated = Date.parse(cloudDeck.date_update);
  const localUpdated = Date.parse(localDeck.date_update);
  if (cloudUpdated === localUpdated) {
    return {
      status: CloudMergeStatus.NO_CHANGE,
      cloudId: cloudDeck.uuid,
    };
  }
  const stale = (cloudUpdated < localUpdated);
  return {
    status: stale ? CloudMergeStatus.STALE : CloudMergeStatus.UPDATE,
    cloudId: cloudDeck.uuid,
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
}

export function mergeDecks(cloudDecks: LocalDeck[], state: AppState): DeckMergeResult {
  const deckStatus: { [id: string]: CloudMergeStatus } = {};
  forEach(cloudDecks, cloudDeck => {
    const { status, cloudId } = mergeLocalDeck(cloudDeck, state.decks.all);
    deckStatus[cloudId] = status;
  });


  const newDecks: Deck[] = [];
  const updatedDecks: Deck[] = [];
  const staleDecks: Deck[] = [];
  const sameDecks: Deck[] = [];
  const upgradeDecks: DecksMap = {};
  const scenarioCount: { [key: string]: number } = {};
  forEach(cloudDecks, deck => {
    if (deck.previousDeckId) {
      // Part of an upgrade chain, and not the first.
      upgradeDecks[deck.uuid] = deck;
      return;
    }
    let hasUpdate = false;
    let hasNew = false;
    let hasStale = false;
    let currentDeck: Deck | undefined = deck;
    let count = 0;
    do {
      count++;
      switch (deckStatus [currentDeck.uuid]) {
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
      if (!currentDeck.nextDeckId) {
        scenarioCount[deck.uuid] = count;
        break;
      }
      currentDeck = find(cloudDecks, d => !!currentDeck && d.uuid === currentDeck.nextDeckId?.uuid);
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
    scenarioCount,
  };
}

function lastUpdated(campaign: Campaign): Date {
  if (typeof campaign.lastUpdated === 'string') {
    return new Date(Date.parse(campaign.lastUpdated));
  }
  return campaign.lastUpdated;
}

function mergeLocalCampaign(cloudCampaign: Campaign, campaigns: { [uuid: string]: Campaign }): CloudMergeResult {
  const localCampaign = find(campaigns, campaign => {
    return !!campaign.uuid && campaign.uuid === cloudCampaign.uuid;
  });
  if (!localCampaign) {
    return {
      status: CloudMergeStatus.NEW,
      cloudId: cloudCampaign.uuid,
    };
  }
  const cloudTime = lastUpdated(cloudCampaign);
  const localTime = lastUpdated(localCampaign);
  if (cloudTime.getTime() === localTime.getTime()) {
    return {
      status: CloudMergeStatus.NO_CHANGE,
      cloudId: cloudCampaign.uuid,
    };
  }

  const stale = (cloudTime.getTime() < localTime.getTime());
  return {
    status: stale ? CloudMergeStatus.STALE : CloudMergeStatus.UPDATE,
    cloudId: cloudCampaign.uuid,
  };
}

export interface CampaignMergeResult {
  // Renumbered with local numbers.
  newCampaigns: Campaign[];
  updatedCampaigns: Campaign[];
  staleCampaigns: Campaign[];
  sameCampaigns: Campaign[];
}

export function mergeCampaigns(cloudCampaigns: Campaign[], state: AppState): CampaignMergeResult {
  const newCampaigns: Campaign[] = [];
  const updatedCampaigns: Campaign[] = [];
  const staleCampaigns: Campaign[] = [];
  const sameCampaigns: Campaign[] = [];
  forEach(cloudCampaigns, cloudCampaign => {
    const { status } = mergeLocalCampaign(cloudCampaign, state.campaigns_2.all);
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
    sameCampaigns,
  };
}
