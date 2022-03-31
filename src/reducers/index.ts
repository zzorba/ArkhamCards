import { combineReducers } from 'redux';
import { concat, find, filter, flatMap, forEach, map, last, sortBy, uniq, values, reverse } from 'lodash';
import { persistReducer } from 'redux-persist';
import { createSelector } from 'reselect';
import { t } from 'ttag';
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
  CampaignId,
  getCampaignLastUpdated,
  getLastUpdated,
  UploadedDeck,
  ArkhamDbDeck,
} from '@actions/types';
import Card, { CardsMap } from '@data/types/Card';
import { ChaosBag, ENABLE_ARKHAM_CARDS_ACCOUNT, ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID, ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID_BETA, ENABLE_ARKHAM_CARDS_ACCOUNT_IOS, ENABLE_ARKHAM_CARDS_ACCOUNT_IOS_BETA } from '@app_constants';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import { LatestDeckRedux, MiniCampaignRedux, MiniDeckRedux, MiniLinkedCampaignRedux } from '@data/local/types';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';
import MiniDeckT from '@data/interfaces/MiniDeckT';
import LatestDeckT from '@data/interfaces/LatestDeckT';
import { Platform } from 'react-native';

const packsPersistConfig = {
  key: 'packs',
  timeout: 0,
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};

const cardsPersistConfig = {
  key: 'cards',
  timeout: 0,
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
  blacklist: ['loading', 'error', 'progress', 'fetch'],
};

const legacyGuidesPersistConfig = {
  key: 'guides',
  timeout: 0,
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
};


const guidesPersistConfig = {
  key: 'guides_2',
  timeout: 0,
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
};

const trackedQueriesPersistConfig = {
  key: 'trackedQueries',
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
  blacklist: [],
};

const legacyDecksPersistConfig = {
  key: 'decks',
  timeout: 0,
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
  blacklist: ['refreshing', 'error', 'edits', 'editting'],
};

const decksPersistConfig = {
  key: 'decks_2',
  timeout: 0,
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
  blacklist: ['refreshing', 'error', 'edits', 'editting'],
};

const campaignsPersistConfig = {
  key: 'campaigns_2',
  timeout: 0,
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
  blacklist: [],
};

const settingsPeristConfig = {
  key: 'settings',
  timeout: 0,
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
  blacklist: [],
};

const signedInPersistConfig = {
  key: 'signedIn',
  throttle: Platform.OS === 'android' ? 1000 : undefined,
  storage: AsyncStorage,
  blacklist: ['loading', 'error'],
};
const dissonantVoicesPersistConfig = {
  key: 'dissonantVoices',
  throttle: Platform.OS === 'android' ? 1000 : undefined,
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
const showCustomContentSelector = (state: AppState) => !!state.settings.customContent;
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
      campaign => {
        return (!campaign.linkedCampaignUuid && !campaign.serverId);
      }
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
        flatMap(campaign.deckIds, id => {
          const deck = getDeck(allDecks, id);
          const previousDeck = deck?.previousDeckId ? getDeck(allDecks, deck.previousDeckId) : undefined;
          return deck ? new LatestDeckRedux(deck, previousDeck, campaign) : [];
        }),
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
  showCustomContentSelector,
  (allPacks, showCustomContent) => sortBy(
    sortBy(
      concat(
        allPacks || DEFAULT_PACK_LIST,
        showCustomContent ? map([
          {
            code: 'zbh',
            cycle_code: 'fan',
            name: t`Barkham Horror`,
            position: 1,
          },
          {
            code: 'zdm',
            cycle_code: 'fan',
            name: t`Dark Matter`,
            position: 2,
          },
          {
            code: 'zaw',
            cycle_code: 'fan',
            name: t`Alice in Wonderland`,
            position: 3,
          },
          {
            code: 'zce',
            cycle_code: 'fan',
            name: t`The Crown of Egil`,
            position: 4,
          },
          {
            code: 'zcp',
            cycle_code: 'fan',
            name: t`Call of the Plaguebearer`,
            position: 5,
          },
          {
            code: 'zcc',
            cycle_code: 'fan',
            name: t`Consternation on the Constellation`,
            position: 6,
          },
        ], (p): Pack => {
          return {
            id: p.code,
            name: p.name,
            code: p.code,
            position: p.position,
            cycle_position: 100,
            available: '2022-01-01',
            known: 0,
            total: 0,
            url: 'https://arkhamcards.com',
          };
        }) : []
      ), pack => pack.position),
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
  ): {
    [uuid: string]: Campaign;
  } => {
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
        ...flatMap(nonDeckInvestigators, code => investigators[code] || []),
        ...flatMap(
          filter(latestDecks, deck => !!(deck && deck.investigator_code)),
          deck => investigators[deck.investigator_code] || []
        ),
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

export const makeLatestDecksSelector = (): (state: AppState, campaign?: Campaign) => LatestDeckT[] => {
  const campaignDeckIdsSelector = makeLatestCampaignDeckIdsSelector();
  return createSelector(
    (state: AppState) => getAllDecks(state),
    campaignDeckIdsSelector,
    (state: AppState, campaign?: Campaign) => campaign,
    (decks: DecksMap, latestDeckIds: DeckId[], campaign?: Campaign) => {
      return flatMap(latestDeckIds, deckId => {
        const deck = getDeck(decks, deckId);
        const previousDeck = deck?.previousDeckId && getDeck(decks, deck.previousDeckId);
        return deck ? new LatestDeckRedux(deck, previousDeck, campaign) : [];
      });
    }
  );
}

export const makeOtherCampiagnDeckIdsSelector = (): (state: AppState, campaign?: SingleCampaignT) => DeckId[] =>
  createSelector(
    (state: AppState) => state.decks.all,
    (state: AppState) => state.campaigns_2.all,
    (state: AppState, campaign?: SingleCampaignT) => campaign,
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

export interface MyDecksState {
  myDecks: MiniDeckT[];
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
  getDeckToCampaignMap,
  (allDecks, dateUpdated, refreshing, error, deckToCampaign) => {
    const myDecks = map(reverse(sortBy(filter(values(allDecks), deck => {
      return !!deck && !deck.nextDeckId;
    }), deck => deck.date_update)), deck => {
      const id = getDeckId(deck);
      return new MiniDeckRedux(deck, deckToCampaign[id.uuid] || undefined);
    });
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

export const makeUploadingDeckSelector = () =>
  createSelector(
    (state: AppState) => state.deckEdits.deck_uploads,
    (state: AppState, campaignId: CampaignId) => campaignId.campaignId,
    (state: AppState, campaignId: CampaignId, investigator: string) => investigator,
    (deck_uploads, campaignId, investigator) => {
      return !!find((deck_uploads || {})[campaignId] || [], i => i === investigator);
    },
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
    (deckToCampaign, deckId): Campaign | undefined => {
      if (deckId.uuid in deckToCampaign) {
        return deckToCampaign[deckId.uuid];
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

export const getEnableArkhamCardsAccount = createSelector(
  (state: AppState) => state.settings.beta1,
  (beta1: undefined | boolean): boolean => {
    return ENABLE_ARKHAM_CARDS_ACCOUNT && (
      (Platform.OS === 'ios' && (ENABLE_ARKHAM_CARDS_ACCOUNT_IOS_BETA || (ENABLE_ARKHAM_CARDS_ACCOUNT_IOS && !!beta1))) ||
      (Platform.OS === 'android' && (ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID_BETA || (ENABLE_ARKHAM_CARDS_ACCOUNT_ANDROID && !!beta1)))
    );
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

export function getDeckUploadedCampaigns(state: AppState, id: DeckId): UploadedDeck | undefined {
  const uploaded = state.decks.syncedDecks || {};
  return uploaded[id.uuid];
}

const getTrackedQueriesIds = (state: AppState) => state.trackedQueries.ids;

const getTrackedQueriesById = (state: AppState) => state.trackedQueries.byId;

export const getTrackedQueries = createSelector(
  getTrackedQueriesIds,
  getTrackedQueriesById,
  (pIds, pById) => pIds.map(o => pById[o])
);


export const getArkhamDbDecks = createSelector(
  (state: AppState) => state.decks.all,
  (state: AppState) => state.decks.refreshing,
  (state: AppState) => state.decks.error,
  (decks: DecksMap, refreshing: boolean, error: string | null): [ArkhamDbDeck[], boolean] => {
    const allDecks: ArkhamDbDeck[] = [];
    forEach(decks, deck => {
      if (!deck.local) {
        allDecks.push(deck);
      }
    });
    return [allDecks, !!error];
  }
);


export const getOnboardingDismissed = createSelector(
  (state: AppState) => state.settings.dismissedOnboarding,
  (state: AppState, onboarding: string) => onboarding,
  (dismissedOnboarding, onboarding): boolean => {
    return !!find(dismissedOnboarding || [], x => x === onboarding);
  }
);