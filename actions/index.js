export const PACKS_AVAILABLE = 'PACKS_AVAILABLE';
export const UPDATE_PROMPT_DISMISSED = 'UPDATE_PROMPT_DISMISSED';
export const DECK_AVAILABLE = 'DECK_AVAILABLE';
export const CLEAR_DECKS = 'CLEAR_DECKS';
export const NEW_DECK = 'NEW_DECK';
export const SET_MY_DECKS = 'SET_MY_DECKS';
export const MY_DECKS_START_REFRESH = 'MY_DECKS_START_REFRESH';
export const MY_DECKS_ERROR = 'MY_DECKS_ERROR';
export const SET_IN_COLLECTION = 'SET_IN_COLLECTION';
export const SET_PACK_SPOILER = 'SET_PACK_SPOILER';
export const SET_ALL_PACK_SPOILERS = 'SET_ALL_PACK_SPOILERS';
export const NEW_CAMPAIGN = 'NEW_CAMPAIGN';
export const DELETE_CAMPAIGN = 'DELETE_CAMPAIGN';
export const ADD_CAMPAIGN_SCENARIO_RESULT = 'ADD_CAMPAIGN_SCENARIO_RESULT';

import { decks } from '../lib/authApi';

export function dismissUpdatePrompt() {
  return {
    type: UPDATE_PROMPT_DISMISSED,
    timestamp: new Date(),
  };
}

export function fetchPacks(callback) {
  return (dispatch) => {
    fetch('https://arkhamdb.com/api/public/packs/', { method: 'GET' })
      .then(response => response.json())
      .then(
        json => {
          dispatch({
            type: PACKS_AVAILABLE,
            packs: json,
            timestamp: new Date(),
          });
          callback && callback(json);
        },
        err => {
          console.log(err);
        }
      );
  };
}

export function newDeck(investigator) {
  const slot = {};
  return {
    type: NEW_DECK,
  };
}

export function upgradeDeck(deck, xp, exiles) {

}

export function clearDecks() {
  return {
    type: CLEAR_DECKS,
  };
}

export function refreshMyDecks() {
  return (dispatch) => {
    dispatch({
      type: MY_DECKS_START_REFRESH,
    });
    decks().then(
      response => {
        dispatch({
          type: SET_MY_DECKS,
          decks: response,
        });
      },
      error => {
        dispatch({
          type: MY_DECKS_ERROR,
          error: error.message || error,
        });
      }
    );
  }
}

export function setMyDecks(decks) {
  return {
    type: SET_MY_DECKS,
    decks,
  };
}

export function fetchDeck(id, useDeckEndpoint) {
  return (dispatch) => {
    const uri = `https://arkhamdb.com/api/public/${useDeckEndpoint ? 'deck' : 'decklist'}/${id}`;
    fetch(uri, { method: 'GET' })
      .then(response => {
        if (response.ok === true) {
          return response.json();
        }
        throw new Error(`Unexpected status: ${response.status}`);
      })
      .then(json => dispatch({
        type: DECK_AVAILABLE,
        id,
        deck: json,
      })).catch(err => {
        if (!useDeckEndpoint) {
          return fetchDeck(id, true)(dispatch);
        }
        console.log(err);
      });
  };
}

export function setInCollection(code, value) {
  return {
    type: SET_IN_COLLECTION,
    code,
    value,
  };
}

export function setPackSpoiler(code, value) {
  return {
    type: SET_PACK_SPOILER,
    code,
    value,
  };
}

export function setAllPackSpoilers(spoilers) {
  return {
    type: SET_ALL_PACK_SPOILERS,
    spoilers,
  };
}

export function newCampaign(pack_code, name, difficulty, deckIds, chaosBag) {
  return {
    type: NEW_CAMPAIGN,
    name: name,
    cycleCode: pack_code,
    difficulty,
    chaosBag,
    deckIds,
    now: new Date(),
  };
}

export function deleteCampaign(id) {
  return {
    type: DELETE_CAMPAIGN,
    id,
  };
}


// deckIds: [],
// scenario: '',
// scenarioCode: '',
// campaignNotes: [],
// investigatorUpdates: {
//   investigator_code: {
//     trauma: {
//       physical,
//       mental,
//     },
//     xp: #,
//     killed: bool,
//     insane: bool,
//     exile: {},
//   },
//   investigator_code: {
//     ...
//   }
// }],
export function addScenarioResult(
  id,
  deckIds,
  { scenario, scenarioCode },
  campaignNotes,
  investigatorUpdates,
  chaosBag,
) {
  return {
    type: ADD_CAMPAIGN_SCENARIO_RESULT,
    id,
    scenarioResult: {
      deckIds,
      scenario,
      scenarioCode,
      campaignNotes,
      investigatorUpdates,
      chaosBag,
    },
    now: new Date(),
  };
}

export default {
  dismissUpdatePrompt,
  refreshMyDecks,
  fetchPacks,
  newDeck,
  fetchDeck,
  setInCollection,
  setPackSpoiler,
  newCampaign,
  deleteCampaign,
  addScenarioResult,
};
