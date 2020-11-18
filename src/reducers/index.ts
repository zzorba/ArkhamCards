import { combineReducers } from 'redux';
import { concat, find, filter, flatMap, forEach, keys, map, max, minBy, last, sortBy, uniq, values } from 'lodash';
import { persistReducer } from 'redux-persist';
import { createSelector } from 'reselect';
import AsyncStorage from '@react-native-async-storage/async-storage';

import signedIn from './signedIn';
import campaigns from './campaigns';
import guides from './guides';
import filters from './filters';
import cards from './cards';
import decks from './decks';
import packs from './packs';
import settings from './settings';
import { CardFilterData, FilterState } from '@lib/filters';
import { getSystemLanguage } from '@lib/i18n';
import {
  BackupState,
  Campaign,
  ChaosBagResults,
  SingleCampaign,
  Deck,
  DecksMap,
  Pack,
  SortType,
  CampaignGuideState,
  NEW_CHAOS_BAG_RESULTS,
  SORT_BY_TYPE,
  EditDeckState,
} from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import { ChaosBag } from '@app_constants';

const packsPersistConfig = {
  key: 'packs',
  timeout: 0,
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const cardsPersistConfig = {
  key: 'cards',
  timeout: 0,
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const guidesPersistConfig = {
  key: 'guides',
  timeout: 0,
  storage: AsyncStorage,
};

const decksPersistConfig = {
  key: 'decks',
  timeout: 0,
  storage: AsyncStorage,
  blacklist: ['refreshing', 'error', 'edits', 'editting'],
};

const settingsPeristConfig = {
  key: 'settings',
  timeout: 0,
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
    filter(
      values(allCampaigns),
      campaign => !campaign.linkedCampaignId
    ),
    campaign => {
      if (!campaign.lastUpdated) {
        return 0;
      }
      if (typeof campaign.lastUpdated === 'string') {
        return -(new Date(Date.parse(campaign.lastUpdated)).getTime());
      }
      if (typeof campaign.lastUpdated === 'number') {
        return -(new Date(campaign.lastUpdated).getTime());
      }
      return -(campaign.lastUpdated.getTime());
    }
  )
);

export const getBackupData = createSelector(
  (state: AppState) => state.decks.all,
  (state: AppState) => state.campaigns.all,
  (state: AppState) => state.guides.all,
  (decks, campaigns, guides): BackupState => {
    const deckIds: { [id: string]: string } = {};
    forEach(decks, deck => {
      if (deck.local && deck.uuid) {
        deckIds[deck.id] = deck.uuid;
      }
    });
    const campaignIds: { [id: string]: string } = {};
    forEach(campaigns, campaign => {
      if (campaign.uuid) {
        campaignIds[campaign.id] = campaign.uuid;
      }
    });
    const guidesState: { [id: string]: CampaignGuideState } = {};
    forEach(guides, (guide, id) => {
      if (guide) {
        guides[id] = guide;
      }
    });
    return {
      campaigns: values(campaigns || {}),
      decks: filter(values(decks), deck => !!deck.local),
      guides: guidesState,
      deckIds,
      campaignIds,
    };
  }
);

export const getShowSpoilers = createSelector(
  (state: AppState) => state.packs.show_spoilers,
  (state: AppState, packCode: string) => packCode,
  (show_spoilers, packCode): boolean => {
    return !!show_spoilers?.[packCode];
  }
);

export const getPackFetchDate = createSelector(
  (state: AppState) => state.packs.dateFetched,
  (dateFetched) => dateFetched
);

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

export const getPack = createSelector(
  (state: AppState) => state.packs.all,
  (state: AppState, packCode: string) => packCode,
  (all, packCode): Pack | undefined => {
    if (packCode) {
      return find(
        all || DEFAULT_PACK_LIST,
        pack => pack.code === packCode
      );
    }
    return undefined;
  }
);

export const getPackSpoilers = createSelector(
  (state: AppState) => state.packs.show_spoilers,
  (show_spoilers) => show_spoilers || DEFAULT_OBJECT
);

export const getPacksInCollection = createSelector(
  (state: AppState) => state.packs.in_collection,
  (in_collection) => in_collection || DEFAULT_OBJECT
);

export const getAllDecks = createSelector(
  (state: AppState) => state.decks.all,
  (all) => all || DEFAULT_OBJECT
);

export const getBaseDeck = createSelector(
  (state: AppState) => getAllDecks(state),
  (state: AppState, deckId: number) => deckId,
  (decks, deckId): Deck | undefined => {
    let deck = decks[deckId];
    while (deck && deck.previous_deck && decks[deck.previous_deck]) {
      deck = decks[deck.previous_deck];
    }
    return deck;
  }
);

export const getLatestDeck = createSelector(
  getAllDecks,
  (state: AppState, deckId: number) => deckId,
  (decks, deckId): Deck | undefined => {
    let deck = decks[deckId];
    while (deck && deck.next_deck && decks[deck.next_deck]) {
      deck = decks[deck.next_deck];
    }
    return deck;
  }
);

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

const EMPTY_INVESTIGATOR_IDS: string[] = [];
const getNonDeckInvestigatorsForCampaignInvestigators = (
  state: AppState,
  investigators: CardsMap,
  campaign?: Campaign
) => {
  if (!campaign || !campaign.nonDeckInvestigators) {
    return EMPTY_INVESTIGATOR_IDS;
  }
  return campaign.nonDeckInvestigators;
};

export const getLatestCampaignInvestigators = createSelector(
  getAllDecksForCampaignInvestigators,
  getInvestigatorsForCampaignInvestigators,
  getLatestDeckIdsForCampaignInvestigators,
  getNonDeckInvestigatorsForCampaignInvestigators,
  (decks, investigators, latestDeckIds, nonDeckInvestigators): Card[] => {
    const latestDecks: Deck[] = flatMap(latestDeckIds, deckId => decks[deckId]);
    return uniq([
      ...flatMap(
        filter(latestDecks, deck => !!(deck && deck.investigator_code)),
        deck => investigators[deck.investigator_code] || []
      ),
      ...flatMap(nonDeckInvestigators, code => investigators[code] || []),
    ]);
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

export const getEffectiveDeckId = createSelector(
  (state: AppState) => state.decks.replacedLocalIds,
  (state: AppState, id: number) => id,
  (replacedLocalIds: undefined | { [id: number]: number; }, id: number): number => {
    if (replacedLocalIds && replacedLocalIds[id]) {
      return replacedLocalIds[id];
    }
    return id;
  }
);

export function getDeck(id: number) {
  return createSelector(
    (state: AppState) => state.decks.all,
    (all) => {
      if (!id) {
        return null;
      }
      if (id in all) {
        return all[id];
      }
      return null;
    }
  );
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

export const getNextCampaignId = createSelector(
  (state: AppState) => state.campaigns.all,
  (all): number => {
    return 1 + (max(map(keys(all), id => parseInt(id, 10))) || 0);
  }
);

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

const EMPTY_CHAOS_BAG_RESULTS = {
  drawnTokens: [],
  sealedTokens: [],
  totalDrawnTokens: 0,
};
export const getChaosBagResults = createSelector(
  getChaosBagResultsWithId,
  getIdWithId,
  (chaosBagResults, id): ChaosBagResults => {
    if (chaosBagResults) {
      const result = chaosBagResults[id];
      if (result) {
        return result;
      }
    }
    return NEW_CHAOS_BAG_RESULTS;
  }
);

export const getTabooSet = createSelector(
  (state: AppState) => state.settings.tabooId,
  (state: AppState, tabooSetOverride?: number) => tabooSetOverride,
  (tabooId?: number, tabooSetOverride?: number) => {
    if (tabooSetOverride !== undefined) {
      return tabooSetOverride;
    }
    return tabooId;
  }
);

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

export const getNextLocalDeckId = createSelector(
  (state: AppState) => state.decks.all,
  (state: AppState) =>state.decks.replacedLocalIds,
  (all, replacedLocalIds): number => {
    const smallestDeckId = minBy(
      map(
        concat(
          keys(all),
          keys(replacedLocalIds || DEFAULT_OBJECT)
        ),
        x => parseInt(x, 10)
      )
    ) || 0;
    if (smallestDeckId < 0) {
      return smallestDeckId - 1;
    }
    return -1;
  }
);

const EMTPY_CHECKLIST: string[] = [];
export const getDeckChecklist = createSelector(
  (state: AppState) => state.decks.checklist,
  (state: AppState, id: number) => id,
  (checklist: undefined | { [id: number]: string[] | undefined }, id: number) => {
    return (checklist || {})[id] || EMTPY_CHECKLIST;
  }
);

export const getFilterState = createSelector(
  (state: AppState) => state.filters.all,
  (state: AppState, filterId: string) => filterId,
  (filters: { [componentId: string]: FilterState | undefined }, filterId: string) => {
    return filters[filterId];
  }
);

export const getMythosMode = createSelector(
  (state: AppState) => state.filters.mythos,
  (state: AppState, filterId: string) => filterId,
  (mythos: { [componentId: string]: boolean | undefined }, filterId: string) => {
    return !!mythos[filterId];
  }
);

export const getCardSort = createSelector(
  (state: AppState) => state.filters.sorts,
  (state: AppState, filterId: string) => filterId,
  (sorts, filterId): SortType => {
    return sorts[filterId] || SORT_BY_TYPE;
  }
);

export const getCardFilterData = createSelector(
  (state: AppState) => state.filters.cardData,
  (state: AppState, filterId: string) => filterId,
  (cardData, filterId): CardFilterData | undefined => {
    return cardData[filterId];
  }
);

export const getDefaultFilterState = createSelector(
  (state: AppState) => state.filters.defaults,
  (state: AppState, filterId: string) => filterId,
  (defaults, filterId): FilterState | undefined => {
    return defaults[filterId];
  }
);

const DEFAULT_GUIDE_STATE = {
  inputs: [],
};

export const getCampaignGuideState = createSelector(
  (state: AppState) => state.guides?.all,
  (state: AppState, campaignId: number) => campaignId,
  (guideState: undefined | { [campaignId: string]: CampaignGuideState | undefined }, campaignId: number) => {
    return (guideState && guideState[campaignId]) || DEFAULT_GUIDE_STATE;
  }
);

export const getLangChoice = createSelector(
  (state: AppState) => state.settings.lang,
  (state: AppState) => state.packs.lang,
  (settingsLang: string | undefined, cardsLang: string | null) => {
    if (settingsLang) {
      return settingsLang;
    }
    if (cardsLang) {
      return cardsLang;
    }
    return 'en';
  }
);

export const getLangPreference = createSelector(
  (state: AppState) => state.settings.lang,
  (state: AppState) => state.cards.lang,
  (settingsLang, cardsLang): string => {
    if (settingsLang === 'system') {
      return getSystemLanguage();
    }
    if (settingsLang) {
      return settingsLang;
    }
    if (cardsLang) {
      return cardsLang;
    }
    return getSystemLanguage();
  }
);

export const getCardLang = createSelector(
  (state: AppState) => state.cards.card_lang,
  (state: AppState) => state.cards.lang,
  (card_lang: string | null | undefined, lang: string | null | undefined) => {
    if (card_lang) {
      return card_lang;
    }
    return lang || 'en';
  }
);

export const getThemeOverride = createSelector(
  (state: AppState) => state.settings.theme,
  (theme: 'dark' | 'light' | undefined) => theme
);

export const getAppFontScale = createSelector(
  (state: AppState) => state.settings.fontScale,
  (fontScale?: number) => fontScale || 1.0
);

export const getDeckEdits = createSelector(
  (state: AppState) => state.decks.editting,
  (state: AppState) => state.decks.edits,
  (state: AppState, id: number) => id,
  (editting, edits, id: number): EditDeckState | undefined => {
    if (!editting || !editting[id] || !edits || !edits[id]) {
      return undefined;
    }
    return edits[id];
  }
);

const EMPTY_CHAOS_BAG: ChaosBag = {};
export const getCampaignChaosBag = createSelector(
  (state: AppState) => state.campaigns.all,
  (state: AppState, campaignId: number) => campaignId,
  (campaigns: { [id: string]: Campaign }, campaignId: number) => {
    const campaign = campaigns[campaignId];
    return (campaign && campaign.chaosBag) || EMPTY_CHAOS_BAG;
  }
);
