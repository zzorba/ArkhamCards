import { combineReducers } from 'redux';
import { concat, find, flatMap, forEach, keys, map, max, minBy, last, sortBy, values } from 'lodash';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import signedIn from './signedIn';
import campaigns from './campaigns';
import cards from './cards';
import decks from './decks';
import packs from './packs';
import settings from './settings';
import { Campaign, SingleCampaign, Deck } from '../actions/types';

const packsPersistConfig = {
  key: 'packs',
  storage,
  blacklist: ['loading', 'error'],
};

const cardsPersistConfig = {
  key: 'cards',
  storage,
  blacklist: ['loading', 'error'],
};

const decksPersistConfig = {
  key: 'decks',
  storage,
  blacklist: ['refreshing', 'error'],
};

const settingsPeristConfig = {
  key: 'settings',
  storage,
  blacklist: [],
};

const signedInPersistConfig = {
  key: 'signedIn',
  storage,
  blacklist: ['loading', 'error'],
};

// Combine all the reducers
const rootReducer = combineReducers({
  packs: persistReducer(packsPersistConfig, packs),
  cards: persistReducer(cardsPersistConfig, cards),
  decks: persistReducer(decksPersistConfig, decks),
  campaigns,
  signedIn: persistReducer(signedInPersistConfig, signedIn),
  settings: persistReducer(settingsPeristConfig, settings),
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

export function getCampaigns(state: AppState) {
  return sortBy(
    values(state.campaigns.all),
    campaign => campaign.lastUpdated ? -new Date(campaign.lastUpdated).getTime() : 0);
}
export function getShowSpoilers(state: AppState, packCode: string) {
  const show_spoilers = state.packs.show_spoilers || {};
  return !!show_spoilers[packCode];
}

export function getPackFetchDate(state: AppState) {
  return state.packs.dateFetched;
}

export function getAllPacks(state: AppState) {
  return sortBy(
    sortBy(state.packs.all || [], pack => pack.position),
    pack => pack.cycle_position);
}

export function getPack(state: AppState, packCode: string) {
  if (packCode) {
    return find(state.packs.all || [], pack => pack.code === packCode);
  }
  return null;
}

export function getPackSpoilers(state: AppState) {
  return state.packs.show_spoilers || {};
}

export function getPacksInCollection(state: AppState) {
  return state.packs.in_collection || {};
}

export function getAllDecks(state: AppState) {
  return state.decks.all || {};
}

export function getBaseDeck(state: AppState, deckId: number) {
  const decks = getAllDecks(state);
  let deck = decks[deckId];
  while (deck && deck.previous_deck && decks[deck.previous_deck]) {
    deck = decks[deck.previous_deck];
  }
  return deck;
}

export function getLatestDeck(state: AppState, deckId: number) {
  const decks = getAllDecks(state);
  let deck = decks[deckId];
  while (deck && deck.next_deck && decks[deck.next_deck]) {
    deck = decks[deck.next_deck];
  }
  return deck;
}

export function getDeckToCampaignMap(state: AppState): {
  [id: string]: Campaign;
} {
  const decks = state.decks.all || {};
  const campaigns = state.campaigns.all;
  const result: { [id: string]: Campaign } = {};
  forEach(values(campaigns), campaign => {
    forEach(campaign.baseDeckIds || [], deckId => {
      let deck = decks[deckId];
      while (deck) {
        result[deck.id] = campaign;
        if (deck.next_deck) {
          deck = decks[deck.next_deck];
        } else {
          break;
        }
      }
    });
  });
  return result;
}

export function getLatestDeckIds(state: AppState, campaign?: Campaign) {
  if (!campaign) {
    return [];
  }
  const decks = state.decks.all;
  if (campaign.baseDeckIds) {
    return flatMap(campaign.baseDeckIds, deckId => {
      let deck = decks[deckId];
      while (deck && deck.next_deck && deck.next_deck in decks) {
        deck = decks[deck.next_deck];
      }
      return deck ? [deck.id] : [];
    });
  }
  return flatMap(campaign.latestDeckIds || [], deckId => {
    let deck = decks[deckId];
    while (deck && deck.next_deck && deck.next_deck in decks) {
      deck = decks[deck.next_deck];
    }
    return deck ? [deck.id] : [];
  });
}

export function getMyDecksState(state: AppState) {
  return {
    myDecks: state.decks.myDecks || [],
    myDecksUpdated: state.decks.dateUpdated ? new Date(state.decks.dateUpdated) : undefined,
    refreshing: state.decks.refreshing,
    error: state.decks.error || undefined,
  };
}

export function getEffectiveDeckId(state: AppState, id: number): number {
  const replacedLocalIds = state.decks.replacedLocalIds;
  if (replacedLocalIds && replacedLocalIds[id]) {
    return replacedLocalIds[id];
  }
  return id;
}

export function getDeck(state: AppState, id: number): Deck | null {
  if (!id) {
    return null;
  }
  if (id in state.decks.all) {
    return state.decks.all[id];
  }
  return null;
}

export function getDecks(state: AppState, deckIds: number[]): Deck[] {
  const decks: Deck[] = [];
  forEach(deckIds, deckId => {
    const deck = getDeck(state, deckId);
    if (deck && deck.id) {
      decks.push(deck);
    }
  });
  return decks;
}

function processCampaign(campaign: Campaign): SingleCampaign {
  const latestScenario = last(campaign.scenarioResults);
  const finishedScenarios = flatMap(campaign.scenarioResults || [], r => r.scenario);
  return Object.assign(
    {},
    campaign,
    {
      latestScenario,
      finishedScenarios,
    },
  );
}

export function getNextCampaignId(state: AppState) {
  return 1 + (max(map(keys(state.campaigns.all), id => parseInt(id, 10))) || 0);
}

export function getCampaign(state: AppState, id: number): SingleCampaign | null {
  if (id in state.campaigns.all) {
    const campaign = state.campaigns.all[id];
    return campaign ? processCampaign(campaign) : null;
  }
  return null;
}

export function getTabooSet(state: AppState): number | undefined {
  return state.settings.tabooId;
}

export function getCampaignForDeck(
  state: AppState,
  deckId: number
): SingleCampaign | null {
  const deckToCampaign = getDeckToCampaignMap(state);
  if (deckId in deckToCampaign) {
    return processCampaign(deckToCampaign[deckId]);
  }
  return null;
}

export function getNextLocalDeckId(state: AppState) {
  const smallestDeckId = minBy(
    map(
      concat(
        keys(state.decks.all),
        keys(state.decks.replacedLocalIds || {})
      ),
      x => parseInt(x, 10)
    )
  ) || 0;
  if (smallestDeckId < 0) {
    return smallestDeckId - 1;
  }
  return -1;
}
