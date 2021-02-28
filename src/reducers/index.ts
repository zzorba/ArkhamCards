import { combineReducers } from 'redux';
import { find, filter, flatMap, forEach, map, last, sortBy, uniq, values, reverse } from 'lodash';
import { persistReducer } from 'redux-persist';
import { createSelector } from 'reselect';
import AsyncStorage from '@react-native-async-storage/async-storage';

import signedIn from './signedIn';
import campaigns from './campaigns';
import guides from './guides';
import trackedQueries from './trackedQueries';
import filters from './filters';
import cards from './cards';
import decks from './decks';
import { legacyDecks, legacyCampaigns, legacyGuides } from './legacy';
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
  DeckId,
  getDeckId,
  LocalDeck,
  UploadedCampaignId,
  CampaignId,
  getCampaignLastUpdated,
  getLastUpdated,
} from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';
import { ChaosBag } from '@app_constants';
import { MiniCampaignT } from '@data/interfaces/MiniCampaignT';
import { MiniCampaignRedux, MiniLinkedCampaignRedux } from '@data/local/types';

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

const legacyGuidesPersistConfig = {
  key: 'guides',
  timeout: 0,
  storage: AsyncStorage,
};


const guidesPersistConfig = {
  key: 'guides_2',
  timeout: 0,
  storage: AsyncStorage,
};

const trackedQueriesPersistConfig = {
  key: 'trackedQueries',
  storage: AsyncStorage,
  blacklist: [],
};

const legacyDecksPersistConfig = {
  key: 'decks',
  timeout: 0,
  storage: AsyncStorage,
  blacklist: ['refreshing', 'error', 'edits', 'editting'],
};

const decksPersistConfig = {
  key: 'decks_2',
  timeout: 0,
  storage: AsyncStorage,
  blacklist: ['refreshing', 'error', 'edits', 'editting'],
};

const campaignsPersistConfig = {
  key: 'campaigns_2',
  timeout: 0,
  storage: AsyncStorage,
  blacklist: [],
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
  legacyDecks: persistReducer(legacyDecksPersistConfig, legacyDecks),
  guides: persistReducer(guidesPersistConfig, guides),
  campaigns_2: persistReducer(campaignsPersistConfig, campaigns),
  signedIn: persistReducer(signedInPersistConfig, signedIn),
  settings: persistReducer(settingsPeristConfig, settings),
  filters,
  deckEdits,
  dissonantVoices: persistReducer(dissonantVoicesPersistConfig, dissonantVoices),
  trackedQueries: persistReducer(trackedQueriesPersistConfig, trackedQueries),
  decks: persistReducer(decksPersistConfig, decks),
  legacyGuides: persistReducer(legacyGuidesPersistConfig, legacyGuides),
  campaigns: legacyCampaigns,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

const DEFAULT_OBJECT = {};
const DEFAULT_PACK_LIST: Pack[] = [];

const allCampaignsSelector = (state: AppState) => state.campaigns_2.all;
const allGuidesSelector = (state: AppState) => state.guides.all;
const allPacksSelector = (state: AppState) => state.packs.all;
const allDecksSelector = (state: AppState) => state.decks.all;

function getCampaign(all: { [uuid: string]: Campaign }, campaignId: CampaignId): Campaign | undefined {
  return all[campaignId.campaignId];
}

export const getCampaigns = createSelector(
  allCampaignsSelector,
  allGuidesSelector,
  allDecksSelector,
  (allCampaigns, allGuides, allDecks): MiniCampaignT[] => map(
    filter(
      values(allCampaigns),
      campaign => (!campaign.linkedCampaignUuid && !campaign.serverId)
    ),
    (campaign: Campaign) => {
      if (campaign.linkUuid) {
        const campaignA = getCampaign(allCampaigns, { campaignId: campaign.linkUuid.campaignIdA, serverId: campaign.serverId });
        const campaignB = getCampaign(allCampaigns, { campaignId: campaign.linkUuid.campaignIdB, serverId: campaign.serverId });
        if (campaignA && campaignB) {
          const decksA = flatMap(campaignA.deckIds, id => getDeck(allDecks, id) || []);
          const decksB = flatMap(campaignB.deckIds, id => getDeck(allDecks, id) || []);
          return new MiniLinkedCampaignRedux(
            campaign,
            getCampaignLastUpdated(campaign),
            campaignA,
            decksA,
            getCampaignLastUpdated(campaignA, allGuides[campaignA.uuid]),
            campaignB,
            decksB,
            getCampaignLastUpdated(campaignB, allGuides[campaignB.uuid])
          );
        }
      }
      return new MiniCampaignRedux(
        campaign,
        flatMap(campaign.deckIds, id => getDeck(allDecks, id) || []),
        getCampaignLastUpdated(campaign, allGuides[campaign.uuid]),
      );
    }
  )
);

export const getBackupData = createSelector(
  (state: AppState) => state.decks.all,
  (state: AppState) => state.campaigns_2.all,
  (state: AppState) => state.guides.all,
  (decks, campaigns, guides): BackupState => {
    const guidesState: { [id: string]: CampaignGuideState } = {};
    forEach(guides, (guide, id) => {
      if (guide) {
        guidesState[id] = guide;
      }
    });
    return {
      version: 1,
      campaigns: values(campaigns || {}),
      decks: filter(values(decks), deck => !!deck.local) as LocalDeck[],
      guides: flatMap(values(guides || {}), x => x || []),
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
export const makeAllCyclePacksSelector = (): (state: AppState, cyclePack?: Pack) => Pack[] =>
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

export const makeBaseDeckSelector = (): (state: AppState, deckId?: DeckId) => Deck | undefined =>
  createSelector(
    (state: AppState) => getAllDecks(state),
    (state: AppState, deckId?: DeckId) => deckId,
    (decks, deckId): Deck | undefined => {
      if (deckId === undefined) {
        return undefined;
      }
      let baseDeck = getDeck(decks, deckId);
      while (baseDeck && baseDeck.previousDeckId) {
        const previousDeck = getDeck(decks, baseDeck.previousDeckId);
        if (!previousDeck) {
          break;
        }
        baseDeck = previousDeck;
      }
      if (!baseDeck || getDeckId(baseDeck).uuid === deckId.uuid) {
        return undefined;
      }
      return baseDeck;
    }
  );

export const makeLatestDeckSelector = (): (state: AppState, deckId?: DeckId) => Deck | undefined =>
  createSelector(
    getAllDecks,
    (state: AppState, deckId?: DeckId) => deckId,
    (decks, deckId): Deck | undefined => {
      if (deckId === undefined) {
        return undefined;
      }
      let latestDeck = getDeck(decks, deckId);
      while (latestDeck && latestDeck.nextDeckId) {
        const nextDeck = getDeck(decks, latestDeck.nextDeckId);
        if (!nextDeck) {
          break;
        }
        latestDeck = nextDeck;
      }
      if (!latestDeck || getDeckId(latestDeck).uuid === deckId.uuid) {
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
  ): { [uuid: string]: Campaign } => {
    const decks = allDecks || {};
    const campaigns = allCampaigns || {};
    const result: { [uuid: string]: Campaign } = {};
    forEach(
      values(campaigns),
      campaign => {
        forEach(campaign.deckIds || [], deckId => {
          let deck = getDeck(decks, deckId);
          while (deck) {
            result[getDeckId(deck).uuid] = campaign;
            if (deck.nextDeckId) {
              deck = getDeck(decks, deck.nextDeckId);
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
  const getLatestCampaignDeckIds: (state: AppState, campaign?: Campaign) => DeckId[] = makeLatestCampaignDeckIdsSelector();
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
      const latestDecks: Deck[] = flatMap(latestDeckIds, deckId => getDeck(decks, deckId) || []);
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

const EMPTY_DECK_ID_LIST: DeckId[] = [];

export const makeLatestCampaignDeckIdsSelector = (): (state: AppState, campaign?: Campaign) => DeckId[] =>
  createSelector(
    (state: AppState) => state.decks.all,
    (state: AppState, campaign?: Campaign) => !campaign,
    (state: AppState, campaign?: Campaign) => campaign?.deckIds,
    (decks, noCampaign, deckIds) => {
      if (noCampaign) {
        return EMPTY_DECK_ID_LIST;
      }
      if (deckIds) {
        return flatMap(deckIds, deckId => {
          let deck = getDeck(decks, deckId);
          while (deck && deck.nextDeckId) {
            const nextDeck = getDeck(decks, deck.nextDeckId);
            if (!nextDeck) {
              break;
            }
            deck = nextDeck;
          }
          return deck ? [getDeckId(deck)] : [];
        });
      }
      return [];
    }
  );

export const makeLatestDecksSelector = (): (state: AppState, campaign?: Campaign) => Deck[] =>
  createSelector(
    (state: AppState) => getAllDecks(state),
    makeLatestCampaignDeckIdsSelector(),
    (decks: DecksMap, latestDeckIds: DeckId[]) => flatMap(latestDeckIds, deckId => getDeck(decks, deckId) || [])
  );

export const makeOtherCampiagnDeckIdsSelector = (): (state: AppState, campaign?: Campaign) => DeckId[] =>
  createSelector(
    (state: AppState) => state.decks.all,
    (state: AppState) => state.campaigns_2.all,
    (state: AppState, campaign?: Campaign) => campaign,
    (decks, campaigns, campaign) => {
      if (!campaign) {
        return EMPTY_DECK_ID_LIST;
      }
      return flatMap(values(campaigns), c => {
        if (c.uuid === campaign.uuid) {
          return [];
        }
        return flatMap(c.deckIds, deckId => {
          let deck = getDeck(decks, deckId);
          while (deck && deck.nextDeckId) {
            const nextDeck = getDeck(decks, deck.nextDeckId);
            if (!nextDeck) {
              break;
            }
            deck = nextDeck;
          }
          return deck ? [getDeckId(deck)] : [];
        });
      });
    }
  );

const EMPTY_MY_DECKS: DeckId[] = [];

interface MyDecksState {
  myDecks: DeckId[];
  myDecksUpdated?: Date;
  refreshing: boolean,
  error?: string;
}
const myDecksUpdatedSelector = (state: AppState) => state.decks.dateUpdated;
const myDecksRefreshingSelector = (state: AppState) => state.decks.refreshing;
const myDecksErrorSelector = (state: AppState) => state.decks.error;
export const getMyDecksState: (state: AppState) => MyDecksState = createSelector(
  (state: AppState) => state.decks.all,
  myDecksUpdatedSelector,
  myDecksRefreshingSelector,
  myDecksErrorSelector,
  (allDecks, dateUpdated, refreshing, error) => {
    const myDecks = map(reverse(sortBy(filter(values(allDecks), deck => {
      return !!deck && !deck.nextDeckId;
    }), deck => deck.date_update)), deck => getDeckId(deck));
    return {
      myDecks: myDecks || EMPTY_MY_DECKS,
      myDecksUpdated: dateUpdated ? new Date(dateUpdated) : undefined,
      refreshing: refreshing,
      error: error || undefined,
    };
  }
);

export const getEffectiveDeckId = (state: AppState, id: DeckId): DeckId => {
  if (state.decks.replacedLocalIds && state.decks.replacedLocalIds[id.uuid]) {
    return state.decks.replacedLocalIds[id.uuid];
  }
  return id;
};

export function getDeck(all: DecksMap, id: DeckId): Deck | undefined {
  if (id.uuid in all) {
    return all[id.uuid] || undefined;
  }
  return undefined;
}

export const makeDeckSelector = () => {
  return createSelector(
    (state: AppState) => state.decks.all,
    (state: AppState, id: DeckId) => id,
    (all, id): Deck | undefined => {
      if (!id || !id.uuid) {
        return undefined;
      }
      return getDeck(all, id);
    }
  );
};

export const makeGetDecksSelector = () =>
  createSelector(
    (state: AppState) => state.decks.all,
    (state: AppState, deckIds: DeckId[]) => deckIds,
    (allDecks, deckIds) => {
      const decks: Deck[] = [];
      forEach(deckIds, deckId => {
        if (deckId) {
          const deck = getDeck(allDecks, deckId);
          if (deck && (deck.local || deck.id)) {
            decks.push(deck);
          }
        }
      });
      return decks;
    }
  );

export function processCampaign(campaign: Campaign): SingleCampaign {
  const latestScenario = last(campaign.scenarioResults);
  const finishedScenarios = flatMap(campaign.scenarioResults || [], r => r.scenario);
  const lastUpdated = getLastUpdated(campaign);
  return {
    ...campaign,
    latestScenario,
    finishedScenarios,
    lastUpdated: lastUpdated > 0 ? new Date(lastUpdated) : new Date(),
  };
}

export const makeCampaignSelector = () =>
  createSelector(
    (state: AppState,) => state.campaigns_2.all,
    (state: AppState, id: string) => id,
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
    (state: AppState) => state.campaigns_2.chaosBagResults,
    (state: AppState, id: string) => id,
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

export const makeTabooSetSelector = (): (state: AppState, tabooSetOverride?: number) => number | undefined =>
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
    (state: AppState, deckId: DeckId) => deckId,
    (deckToCampaign, deckId): SingleCampaign | undefined => {
      if (deckId.uuid in deckToCampaign) {
        return processCampaign(deckToCampaign[deckId.uuid]);
      }
      return undefined;
    }
  );

const EMTPY_CHECKLIST: string[] = [];
export const getDeckChecklist = createSelector(
  (state: AppState) => state.deckEdits.checklist,
  (state: AppState, id: DeckId) => id,
  (checklist: { [id: string]: string[] | undefined }, id: DeckId) => {
    return (checklist || {})[id.uuid] || EMTPY_CHECKLIST;
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

export const makeCampaignGuideStateSelector = () =>
  createSelector(
    (state: AppState) => state.guides?.all,
    (state: AppState, campaignUuid: string) => campaignUuid,
    (guideState: undefined | { [campaignId: string]: CampaignGuideState | undefined }, campaignUuid: string) => {
      return (guideState && guideState[campaignUuid]) || {
        uuid: campaignUuid,
        inputs: [],
      };
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
    (state: AppState, id: DeckId | undefined) => id,
    (editting, edits, id: DeckId | undefined): EditDeckState | undefined => {
      if (id === undefined || !id.uuid || !editting || !editting[id.uuid] || !edits || !edits[id.uuid]) {
        return undefined;
      }
      return edits[id.uuid];
    }
  );

const EMPTY_CHAOS_BAG: ChaosBag = {};
export const makeCampaignChaosBagSelector = () =>
  createSelector(
    (state: AppState) => state.campaigns_2.all,
    (state: AppState, campaignId: string) => campaignId,
    (campaigns: { [id: string]: Campaign }, campaignId: string) => {
      const campaign = campaigns[campaignId];
      return (campaign && campaign.chaosBag) || EMPTY_CHAOS_BAG;
    }
  );

const EMPTY_CAMPAIGN_IDS: UploadedCampaignId[] = [];
export function getDeckUploadedCampaigns(state: AppState, id: DeckId): UploadedCampaignId[] {
  const uploaded = state.decks.uploaded || {};
  return uploaded[id.uuid] || EMPTY_CAMPAIGN_IDS;
}

const getTrackedQueriesIds = (state: AppState) => state.trackedQueries.ids;

const getTrackedQueriesById = (state: AppState) => state.trackedQueries.byId;

export const getTrackedQueries = createSelector(
  getTrackedQueriesIds,
  getTrackedQueriesById,
  (pIds, pById) => pIds.map(o => pById[o])
);