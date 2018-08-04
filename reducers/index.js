import { combineReducers } from 'redux';
import { find, flatMap, forEach, keys, map, max, last, sortBy, values } from 'lodash';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import signedIn from './signedIn';
import campaigns from './campaigns';
import cards from './cards';
import decks from './decks';
import packs from './packs';
import weaknesses from './weaknesses';

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
  weaknesses,
  signedIn: persistReducer(signedInPersistConfig, signedIn),
});

export default rootReducer;

export function getCampaigns(state) {
  return sortBy(
    values(state.campaigns.all),
    campaign => campaign.lastUpdated ? -new Date(campaign.lastUpdated).getTime() : 0);
}
export function getShowSpoilers(state, packCode) {
  const show_spoilers = state.packs.show_spoilers || {};
  return !!show_spoilers[packCode];
}

export function getPackFetchDate(state) {
  return state.pack.dateFetched;
}

export function getAllPacks(state) {
  return sortBy(
    sortBy(state.packs.all || [], pack => pack.position),
    pack => pack.cycle_position);
}

export function getPack(state, packCode) {
  if (packCode) {
    return find(state.packs.all || [], pack => pack.code === packCode);
  }
  return null;
}

export function getPackSpoilers(state) {
  return state.packs.show_spoilers || {};
}

export function getPacksInCollection(state) {
  return state.packs.in_collection || {};
}

export function getAllDecks(state) {
  return state.decks.all || {};
}

export function getDeck(state, id) {
  if (!id) {
    return null;
  }
  if (id in state.decks.all) {
    return state.decks.all[id];
  }
  return null;
}

export function getDecks(state, deckIds) {
  const decks = [];
  forEach(deckIds, deckId => {
    const deck = getDeck(state, deckId);
    if (deck) {
      decks.push(deck);
    }
  });
  return decks;
}

function mergeStatus(oldStatus, newStatus) {
  const oldTrauma = (oldStatus && oldStatus.trauma) || {};
  const newTrauma = (newStatus && newStatus.trauma) || {};
  return {
    trauma: {
      physical: (oldTrauma.physical || 0) + (newTrauma.physical || 0),
      mental: (oldTrauma.mental || 0) + (newTrauma.mental || 0),
      killed: oldTrauma.killed || newTrauma.killed || false,
      insane: oldTrauma.insane || newTrauma.insane || false,
    },
    xp: (oldStatus.xp || 0) + (newStatus.xp || 0),
    missionCount: (oldStatus.missionCount || 0) + 1,
  };
}

function processCampaign(campaign) {
  const latestScenario = last(campaign.scenarioResults);
  const finishedScenarios = flatMap(campaign.scenarioResults,
    scenarioResult => {
      if (scenarioResult.scenarioCode) {
        return scenarioResult.scenarioCode;
      }
      return null;
    });
  const investigatorStatus = {};
  forEach(campaign.scenarioResults, scenarioResult => {
    forEach(keys(scenarioResult.investigatorUpdates), investigator_code => {
      const status = investigatorStatus[investigator_code] || {};
      investigatorStatus[investigator_code] = mergeStatus(
        status,
        scenarioResult.investigatorUpdates[investigator_code]);
    });
  });
  return Object.assign(
    {},
    campaign,
    {
      latestScenario,
      finishedScenarios,
      investigatorStatus,
    },
  );
}

export function getNextCampaignId(state) {
  return 1 + (max(map(keys(state.campaigns.all), id => parseInt(id, 10))) || 0);
}

export function getNextWeaknessId(state) {
  return 1 + (max(map(values(state.weaknesses.all), set => set.id)) || 0);
}

export function getCampaignForDeck(state, deckId) {
  return find(values(state.campaigns.all), campaign => {
    return find(campaign.latestDeckIds, id => id === deckId);
  });
}

export function getCampaign(state, id) {
  if (id in state.campaigns.all) {
    const campaign = state.campaigns.all[id];
    return campaign ? processCampaign(campaign) : null;
  }
  return null;
}
