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

export function getBaseDeck(state, deckId) {
  const decks = getAllDecks(state);
  let deck = decks[deckId];
  while (deck && deck.previous_deck && decks[deck.previous_deck]) {
    deck = decks[deck.previous_deck];
  }
  return deck;
}

export function getLatestDeck(state, deckId) {
  const decks = getAllDecks(state);
  let deck = decks[deckId];
  while (deck && deck.next_deck && decks[deck.next_deck]) {
    deck = decks[deck.next_deck];
  }
  return deck;
}

export function getDeckToCampaignMap(state) {
  const decks = state.decks.all || {};
  const campaigns = state.campaigns.all;
  const result = {};
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

export function getLatestDeckIds(campaign, state) {
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

export function getMyDecksState(state) {
  return {
    myDecks: state.decks.myDecks || [],
    myDecksUpdated: state.decks.dateUpdated ? new Date(state.decks.dateUpdated) : null,
    refreshing: state.decks.refreshing,
    error: state.decks.error,
  };
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
    if (deck && deck.id) {
      decks.push(deck);
    }
  });
  return decks;
}

function processCampaign(campaign) {
  const latestScenario = last(campaign.scenarioResults);
  const finishedScenarios = flatMap(campaign.scenarioResults, r => r.scenario);
  return Object.assign(
    {},
    campaign,
    {
      latestScenario,
      finishedScenarios,
    },
  );
}

export function getNextCampaignId(state) {
  return 1 + (max(map(keys(state.campaigns.all), id => parseInt(id, 10))) || 0);
}

export function getNextWeaknessId(state) {
  return 1 + (max(map(values(state.weaknesses.all), set => set.id)) || 0);
}

export function getCampaign(state, id) {
  if (id in state.campaigns.all) {
    const campaign = state.campaigns.all[id];
    return campaign ? processCampaign(campaign) : null;
  }
  return null;
}
