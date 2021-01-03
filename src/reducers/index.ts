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
import deckEdits from './deckEdits';
import packs from './packs';
import settings from './settings';
import dissonantVoices from './dissonantVoices';
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
const dissonantVoicesPersistConfig = {
  key: 'dissonantVoices',
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
  deckEdits,
  dissonantVoices: persistReducer(dissonantVoicesPersistConfig, dissonantVoices),
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
        guidesState[id] = guide;
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

export function getShowSpoilers(state: AppState, packCode: string) {
  return !!state.packs.show_spoilers?.[packCode];
}

export function getPackFetchDate(state: AppState) {
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
export const makeAllCyclePacksSelector = () =>
  createSelector(
    (state: AppState, cyclePack?: Pack) => getAllPacks(state),
    (state: AppState, cyclePack?: Pack) => cyclePack,
    (allPacks, cyclePack) => !cyclePack ?
      EMPTY_PACKS :
      filter(allPacks, pack => pack.cycle_position === cyclePack.cycle_position)
  );

export const getAllStandalonePacks = createSelector(
  allPacksSelector,
  (packs) => filter(packs, pack => pack.cycle_position === 70)
);

export const makePackSelector = () =>
  createSelector(
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

export const makeBaseDeckSelector = () =>
  createSelector(
    (state: AppState) => getAllDecks(state),
    (state: AppState, deckId?: number) => deckId,
    (decks, deckId): Deck | undefined => {
      if (deckId === undefined) {
        return undefined;
      }
      let baseDeck = decks[deckId];
      while (baseDeck && baseDeck.previous_deck && decks[baseDeck.previous_deck]) {
        baseDeck = decks[baseDeck.previous_deck];
      }
      if (!baseDeck || baseDeck.id === deckId) {
        return undefined;
      }
      return baseDeck;
    }
  );

export const makeLatestDeckSelector = () =>
  createSelector(
    getAllDecks,
    (state: AppState, deckId?: number) => deckId,
    (decks, deckId): Deck | undefined => {
      if (deckId === undefined) {
        return undefined;
      }
      let latestDeck = decks[deckId];
      while (latestDeck && latestDeck.next_deck && decks[latestDeck.next_deck]) {
        latestDeck = decks[latestDeck.next_deck];
      }
      if (!latestDeck || latestDeck.id === deckId) {
        return undefined;
      }
      return latestDeck;
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

export const hasDissonantVoices = createSelector(
  (state: AppState) => state.dissonantVoices.status,
  (status): boolean => status === true
);

const EMPTY_INVESTIGATOR_IDS: string[] = [];


export function makeLatestCampaignInvestigatorsSelector(): (state: AppState, investigators?: CardsMap, campaign?: Campaign) => Card[] {
  const getLatestCampaignDeckIds: (state: AppState, campaign?: Campaign) => number[] = makeLatestCampaignDeckIdsSelector();
  const getNonDeckInvestigatorsForCampaignInvestigators = createSelector(
    (campaign?: Campaign) => campaign?.nonDeckInvestigators,
    (nonDeckInvestigators) => {
      if (!nonDeckInvestigators) {
        return EMPTY_INVESTIGATOR_IDS;
      }
      return nonDeckInvestigators;
    });
  return createSelector(
    (state: AppState, investigators?: CardsMap, campaign?: Campaign) => getAllDecks(state),
    (state: AppState, investigators?: CardsMap, campaign?: Campaign) => investigators,
    (state: AppState, investigators?: CardsMap, campaign?: Campaign) => getLatestCampaignDeckIds(state, campaign),
    (state: AppState, investigators?: CardsMap, campaign?: Campaign) => getNonDeckInvestigatorsForCampaignInvestigators(campaign),
    (decks, investigators, latestDeckIds, nonDeckInvestigators): Card[] => {
      if (!investigators) {
        return [];
      }
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
}

const EMPTY_DECK_ID_LIST: number[] = [];

export const makeLatestCampaignDeckIdsSelector = () =>
  createSelector(
    (state: AppState) => state.decks.all,
    (state: AppState, campaign?: Campaign) => !campaign,
    (state: AppState, campaign?: Campaign) => campaign?.baseDeckIds,
    (state: AppState, campaign?: Campaign) => campaign?.latestDeckIds,
    (decks, noCampaign, baseDeckIds, latestDeckIds) => {
      if (noCampaign) {
        return EMPTY_DECK_ID_LIST;
      }
      if (baseDeckIds) {
        return flatMap(baseDeckIds, deckId => {
          let deck = decks[deckId];
          while (deck && deck.next_deck && deck.next_deck in decks) {
            deck = decks[deck.next_deck];
          }
          return deck ? [deck.id] : [];
        });
      }
      return flatMap(latestDeckIds || [], deckId => {
        let deck = decks[deckId];
        while (deck && deck.next_deck && deck.next_deck in decks) {
          deck = decks[deck.next_deck];
        }
        return deck ? [deck.id] : [];
      });
    }
  );

const EMPTY_MY_DECKS: number[] = [];

const myDecksUpdatedSelector = (state: AppState) => state.decks.dateUpdated;
const myDecksRefreshingSelector = (state: AppState) => state.decks.refreshing;
const myDecksErrorSelector = (state: AppState) => state.decks.error;
export const getMyDecksState = createSelector(
  (state: AppState) => state.decks.myDecks,
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

export const getEffectiveDeckId = (state: AppState, id: number): number => {
  if (state.decks.replacedLocalIds && state.decks.replacedLocalIds[id]) {
    return state.decks.replacedLocalIds[id];
  }
  return id;
};

export const makeDeckSelector = () => {
  return createSelector(
    (state: AppState) => state.decks.all,
    (state: AppState, id: number) => id,
    (all, id) => {
      if (!id) {
        return null;
      }
      if (id in all) {
        return all[id];
      }
      return null;
    }
  );
};

export const makeGetDecksSelector = () =>
  createSelector(
    (state: AppState) => state.decks.all,
    (state: AppState, deckIds: number[]) => deckIds,
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

export const makeCampaignSelector = () =>
  createSelector(
    (state: AppState,) => state.campaigns.all,
    (state: AppState, id: number) => id,
    (allCampaigns, id): SingleCampaign | undefined => {
      if (id in allCampaigns) {
        const campaign = allCampaigns[id];
        return campaign && processCampaign(campaign);
      }
      return undefined;
    }
  );

export const makeChaosBagResultsSelector = () =>
  createSelector(
    (state: AppState) => state.campaigns.chaosBagResults,
    (state: AppState, id: number) => id,
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

export const makeTabooSetSelector = () =>
  createSelector(
    (state: AppState, tabooSetOverride?: number) => state.settings.tabooId,
    (state: AppState, tabooSetOverride?: number) => tabooSetOverride,
    (tabooId: number | undefined, tabooSetOverride: number | undefined): number | undefined => {
      if (tabooSetOverride !== undefined) {
        return tabooSetOverride;
      }
      return tabooId;
    }
  );

export const makeCampaignForDeckSelector = () =>
  createSelector(
    (state: AppState) => getDeckToCampaignMap(state),
    (state: AppState, deckId: number) => deckId,
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
  (state: AppState) => state.deckEdits.checklist,
  (state: AppState, id: number) => id,
  (checklist: { [id: number]: string[] | undefined }, id: number) => {
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

export const makeCampaignGuideStateSelector = () =>
  createSelector(
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

export const makeDeckEditsSelector = () =>
  createSelector(
    (state: AppState) => state.deckEdits.editting,
    (state: AppState) => state.deckEdits.edits,
    (state: AppState, id: number | undefined) => id,
    (editting, edits, id: number | undefined): EditDeckState | undefined => {
      if (id === undefined || !editting || !editting[id] || !edits || !edits[id]) {
        return undefined;
      }
      return edits[id];
    }
  );

const EMPTY_CHAOS_BAG: ChaosBag = {};
export const makeCampaignChaosBagSelector = () =>
  createSelector(
    (state: AppState) => state.campaigns.all,
    (state: AppState, campaignId: number) => campaignId,
    (campaigns: { [id: string]: Campaign }, campaignId: number) => {
      const campaign = campaigns[campaignId];
      return (campaign && campaign.chaosBag) || EMPTY_CHAOS_BAG;
    }
  );
