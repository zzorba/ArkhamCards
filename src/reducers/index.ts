import { combineReducers } from 'redux';
import { concat, find, filter, flatMap, forEach, keys, map, max, minBy, last, sortBy, values } from 'lodash';
import { persistReducer } from 'redux-persist';
import { createSelector } from 'reselect';
import AsyncStorage from '@react-native-community/async-storage';

import signedIn from './signedIn';
import campaigns from './campaigns';
import guides from './guides';
import filters from './filters';
import cards from './cards';
import decks from './decks';
import packs from './packs';
import settings from './settings';
import { FilterState } from 'lib/filters';
import {
  Campaign,
  ChaosBagResults,
  SingleCampaign,
  Deck,
  DecksMap,
  Pack,
  SortType,
  CampaignGuideState,
  NEW_CHAOS_BAG_RESULTS,
} from 'actions/types';
import Card, { CardsMap } from 'data/Card';

const packsPersistConfig = {
  key: 'packs',
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const cardsPersistConfig = {
  key: 'cards',
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const guidesPersistConfig = {
  key: 'guides',
  storage: AsyncStorage,
};

const decksPersistConfig = {
  key: 'decks',
  storage: AsyncStorage,
  blacklist: ['refreshing', 'error'],
};

const settingsPeristConfig = {
  key: 'settings',
  storage: AsyncStorage,
  blacklist: [],
};

const signedInPersistConfig = {
  key: 'signedIn',
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

// Combine all the reducers
const rootReducer = combineReducers({
  packs: persistReducer(packsPersistConfig, packs),
  cards: persistReducer(cardsPersistConfig, cards),
  decks: persistReducer(decksPersistConfig, decks),
  guides: persistReducer(guidesPersistConfig, guides),
  campaigns,
  signedIn: persistReducer(signedInPersistConfig, signedIn),
  settings: persistReducer(settingsPeristConfig, settings),
  filters,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

const DEFAULT_OBJECT = {};
const DEFAULT_PACK_LIST: Pack[] = [];

const allCampaignsSelector = (state: AppState) => state.campaigns.all;
const allPacksSelector = (state: AppState) => state.packs.all;
const allDecksSelector = (state: AppState) => state.decks.all;

export const getCampaigns = createSelector(
  allCampaignsSelector,
  allCampaigns => sortBy(
    values(allCampaigns),
    campaign => campaign.lastUpdated ? -new Date(campaign.lastUpdated).getTime() : 0
  )
);

export function getShowSpoilers(state: AppState, packCode: string): boolean {
  const show_spoilers = state.packs.show_spoilers || {};
  return !!show_spoilers[packCode];
}

export function getPackFetchDate(state: AppState): number | null {
  return state.packs.dateFetched;
}

export const getAllPacks = createSelector(
  allPacksSelector,
  allPacks => sortBy(
    sortBy(allPacks || DEFAULT_PACK_LIST, pack => pack.position),
    pack => pack.cycle_position
  )
);

/* eslint-disable @typescript-eslint/no-unused-vars */
const EMPTY_PACKS: Pack[] = [];
const allPacksCycleSelector = (state: AppState, cyclePack?: Pack) => getAllPacks(state);
const cycleSelector = (state: AppState, cyclePack?: Pack) => cyclePack;
export const getAllCyclePacks = createSelector(
  allPacksCycleSelector,
  cycleSelector,
  (allPacks, cyclePack) => !cyclePack ?
    EMPTY_PACKS :
    filter(allPacks, pack => pack.cycle_position === cyclePack.cycle_position)
);

export const getAllStandalonePacks = createSelector(
  allPacksSelector,
  (packs) => filter(packs, pack => pack.cycle_position === 70)
);

export function getPack(state: AppState, packCode: string): Pack | undefined {
  if (packCode) {
    return find(
      state.packs.all || DEFAULT_PACK_LIST,
      pack => pack.code === packCode
    );
  }
  return undefined;
}

export function getPackSpoilers(state: AppState) {
  return state.packs.show_spoilers || DEFAULT_OBJECT;
}

export function getPacksInCollection(state: AppState) {
  return state.packs.in_collection || DEFAULT_OBJECT;
}

export function getAllDecks(state: AppState) {
  return state.decks.all || DEFAULT_OBJECT;
}

export function getBaseDeck(state: AppState, deckId: number): Deck | undefined {
  const decks = getAllDecks(state);
  let deck = decks[deckId];
  while (deck && deck.previous_deck && decks[deck.previous_deck]) {
    deck = decks[deck.previous_deck];
  }
  return deck;
}

export function getLatestDeck(state: AppState, deckId: number): Deck | undefined {
  const decks = getAllDecks(state);
  let deck = decks[deckId];
  while (deck && deck.next_deck && decks[deck.next_deck]) {
    deck = decks[deck.next_deck];
  }
  return deck;
}

export const getDeckToCampaignMap = createSelector(
  allCampaignsSelector,
  allDecksSelector,
  (
    allCampaigns: { [id: string]: Campaign },
    allDecks: DecksMap
  ): { [id: string]: Campaign } => {
    const decks = allDecks || {};
    const campaigns = allCampaigns || {};
    const result: { [id: string]: Campaign } = {};
    forEach(
      values(campaigns),
      campaign => {
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
);

const getAllDecksForCampaignInvestigators = (
  state: AppState,
  investigators: CardsMap,
  campaign?: Campaign
) => getAllDecks(state);
const getInvestigatorsForCampaignInvestigators = (
  state: AppState,
  investigators: CardsMap,
  campaign?: Campaign
) => investigators;
const getLatestDeckIdsForCampaignInvestigators = (
  state: AppState,
  investigators: CardsMap,
  campaign?: Campaign
) => getLatestCampaignDeckIds(state, campaign);

export const getLatestCampaignInvestigators = createSelector(
  getAllDecksForCampaignInvestigators,
  getInvestigatorsForCampaignInvestigators,
  getLatestDeckIdsForCampaignInvestigators,
  (decks, investigators, latestDeckIds): Card[] => {
    const latestDecks: Deck[] = flatMap(latestDeckIds, deckId => decks[deckId]);
    return flatMap(
      filter(latestDecks, deck => !!(deck && deck.investigator_code)),
      deck => investigators[deck.investigator_code]
    );
  }
);

const EMPTY_DECK_ID_LIST: number[] = [];

const latestDeckIdsDecksSelector = (state: AppState, campaign?: Campaign) => state.decks.all;
const latestDeckIdsCampaignSelector = (state: AppState, campaign?: Campaign) => campaign;
export const getLatestCampaignDeckIds = createSelector(
  latestDeckIdsDecksSelector,
  latestDeckIdsCampaignSelector,
  (decks, campaign) => {
    if (!campaign) {
      return EMPTY_DECK_ID_LIST;
    }
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
);

const EMPTY_MY_DECKS: number[] = [];

const myDecksSelector = (state: AppState) => state.decks.myDecks;
const myDecksUpdatedSelector = (state: AppState) => state.decks.dateUpdated;
const myDecksRefreshingSelector = (state: AppState) => state.decks.refreshing;
const myDecksErrorSelector = (state: AppState) => state.decks.error;
export const getMyDecksState = createSelector(
  myDecksSelector,
  myDecksUpdatedSelector,
  myDecksRefreshingSelector,
  myDecksErrorSelector,
  (myDecks, dateUpdated, refreshing, error) => {
    return {
      myDecks: myDecks || EMPTY_MY_DECKS,
      myDecksUpdated: dateUpdated ? new Date(dateUpdated) : undefined,
      refreshing: refreshing,
      error: error || undefined,
    };
  }
);

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


const getDecksAllDecksSelector = (state: AppState, deckIds: number[]) => state.decks.all;
const getDecksDeckIdsSelector = (state: AppState, deckIds: number[]) => deckIds;
export const getDecks = createSelector(
  getDecksAllDecksSelector,
  getDecksDeckIdsSelector,
  (allDecks, deckIds) => {
    const decks: Deck[] = [];
    forEach(deckIds, deckId => {
      if (deckId) {
        const deck = allDecks[deckId];
        if (deck && deck.id) {
          decks.push(deck);
        }
      }
    });
    return decks;
  }
);

function processCampaign(campaign: Campaign): SingleCampaign {
  const latestScenario = last(campaign.scenarioResults);
  const finishedScenarios = flatMap(campaign.scenarioResults || [], r => r.scenario);
  return {
    ...campaign,
    latestScenario,
    finishedScenarios,
  };
}

export function getNextCampaignId(state: AppState): number {
  return 1 + (max(map(keys(state.campaigns.all), id => parseInt(id, 10))) || 0);
}

const getAllCampaignsWithId = (state: AppState, id: number) => state.campaigns.all;
const getIdWithId = (state: AppState, id: number) => id;
export const getCampaign = createSelector(
  getAllCampaignsWithId,
  getIdWithId,
  (allCampaigns, id): SingleCampaign | undefined => {
    if (id in allCampaigns) {
      const campaign = allCampaigns[id];
      return campaign && processCampaign(campaign);
    }
    return undefined;
  }
);

const getChaosBagResultsWithId = (state: AppState, id: number) => state.campaigns.chaosBagResults;

export const getChaosBagResults = createSelector(
  getChaosBagResultsWithId,
  getIdWithId,
  (chaosBagResults, id): ChaosBagResults => {
    if (chaosBagResults && chaosBagResults[id]) {
      return chaosBagResults[id];
    }
    return NEW_CHAOS_BAG_RESULTS;
  }
);

export function getTabooSet(state: AppState, tabooSetOverride?: number): number | undefined {
  if (tabooSetOverride !== undefined) {
    return tabooSetOverride;
  }
  return state.settings.tabooId;
}

const deckToCampaignMapForDeck = (state: AppState, deckId: number) => getDeckToCampaignMap(state);
const deckIdForDeck = (state: AppState, deckId: number) => deckId;
export const getCampaignForDeck = createSelector(
  deckToCampaignMapForDeck,
  deckIdForDeck,
  (deckToCampaign, deckId): SingleCampaign | undefined => {
    if (deckId in deckToCampaign) {
      return processCampaign(deckToCampaign[deckId]);
    }
    return undefined;
  }
);

export function getNextLocalDeckId(state: AppState): number {
  const smallestDeckId = minBy(
    map(
      concat(
        keys(state.decks.all),
        keys(state.decks.replacedLocalIds || DEFAULT_OBJECT)
      ),
      x => parseInt(x, 10)
    )
  ) || 0;
  if (smallestDeckId < 0) {
    return smallestDeckId - 1;
  }
  return -1;
}

export function getFilterState(
  state: AppState,
  filterId: string
): FilterState {
  return state.filters.all[filterId];
}

export function getMythosMode(
  state: AppState,
  filterId: string
): boolean {
  return !!state.filters.mythos[filterId];
}

export function getCardSort(
  state: AppState,
  filterId: string
): SortType {
  return state.filters.sorts[filterId];
}

export function getDefaultFilterState(
  state: AppState,
  filterId: string
): FilterState {
  return state.filters.defaults[filterId];
}

export function getGuideState(state: AppState, campaignId: number): CampaignGuideState {
  return state.guides.all[campaignId] || {
    inputs: [],
  };
}

export function getCampaignGuideState(
  state: AppState,
  campaignId: number
): CampaignGuideState {
  return getGuideState(state, campaignId);
}
