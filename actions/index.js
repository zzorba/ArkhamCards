export const PACKS_AVAILABLE = 'PACKS_AVAILABLE';
export const UPDATE_PROMPT_DISMISSED = 'UPDATE_PROMPT_DISMISSED';
export const NEW_DECK_AVAILABLE = 'NEW_DECK_AVAILABLE';
export const UPDATE_DECK = 'UPDATE_DECK';
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
export const NEW_WEAKNESS_SET = 'NEW_WEAKNESS_SET';
export const EDIT_WEAKNESS_SET = 'EDIT_WEAKNESS_SET';
export const DELETE_WEAKNESS_SET = 'DELETE_WEAKNESS_SET';
export const LOGIN_STARTED = 'LOGIN_STARTED';
export const LOGIN = 'LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

import { getAccessToken, signInFlow, signOutFlow } from '../lib/auth';
import { decks, loadDeck } from '../lib/authApi';

export function createWeaknessSet(id, name, packCodes) {
  return {
    type: NEW_WEAKNESS_SET,
    id,
    set: {
      id,
      name,
      packCodes,
      created: new Date(),
      assignedCards: {},
    },
  };
}

export function editWeaknessSet(id, name, packCodes, assignedCards) {
  return {
    type: EDIT_WEAKNESS_SET,
    id: id,
    name: name || null,
    packCodes: packCodes || null,
    assignedCards: assignedCards || null,
  };
}

export function deleteWeaknessSet(id) {
  return {
    type: DELETE_WEAKNESS_SET,
    id: id,
  };
}


export function login() {
  return (dispatch) => {
    dispatch({ type: LOGIN_STARTED });
    signInFlow().then(response => {
      if (response.success) {
        dispatch({ type: LOGIN });
      } else {
        dispatch({
          type: LOGIN_ERROR,
          error: response.error,
        });
      }
    });
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({ type: LOGIN_STARTED });
    signOutFlow().then(() => {
      dispatch({
        type: LOGOUT,
      });
      dispatch(clearDecks());
    });
  };
}

export function verifyLogin() {
  return (dispatch) => {
    getAccessToken().then(accessToken => {
      if (accessToken) {
        dispatch({
          type: LOGIN,
        });
      } else {
        dispatch({
          type: LOGOUT,
        });
      }
    });
  };
}

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
      .then(json => {
        dispatch({
          type: PACKS_AVAILABLE,
          packs: json,
          timestamp: new Date(),
        });
        callback && callback(json);
      },
      err => {
        console.log(err);
      });
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
  };
}

export function setMyDecks(decks) {
  return {
    type: SET_MY_DECKS,
    decks,
  };
}

export function setNewDeck(id, deck) {
  return {
    type: NEW_DECK_AVAILABLE,
    id,
    deck,
  };
}

export function updateDeck(id, deck, isWrite) {
  return {
    type: UPDATE_DECK,
    id,
    deck,
    isWrite,
  };
}

export function fetchPrivateDeck(id) {
  return (dispatch) => {
    loadDeck(id).then(deck => {
      dispatch(updateDeck(id, deck, false));
    });
  };
}

export function fetchPublicDeck(id, useDeckEndpoint) {
  return (dispatch) => {
    const uri = `https://arkhamdb.com/api/public/${useDeckEndpoint ? 'deck' : 'decklist'}/${id}`;
    fetch(uri, { method: 'GET' })
      .then(response => {
        if (response.ok === true) {
          return response.json();
        }
        throw new Error(`Unexpected status: ${response.status}`);
      })
      .then(json => {
        dispatch(updateDeck(id, json, false));
      }).catch(err => {
        if (!useDeckEndpoint) {
          return fetchPublicDeck(id, true)(dispatch);
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

export function setCycleInCollection(cycle, value) {
  return {
    type: SET_IN_COLLECTION,
    cycle,
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

export function setCyclePackSpoiler(cycle, value) {
  return {
    type: SET_PACK_SPOILER,
    cycle,
    value,
  };
}

export function setAllPackSpoilers(spoilers) {
  return {
    type: SET_ALL_PACK_SPOILERS,
    spoilers,
  };
}

export function newCampaign(
  id,
  name,
  pack_code,
  difficulty,
  deckIds,
  chaosBag,
  campaignLog,
  weaknessPacks
) {
  return {
    type: NEW_CAMPAIGN,
    id,
    name: name,
    cycleCode: pack_code,
    difficulty,
    chaosBag,
    campaignLog,
    weaknessPacks,
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
  login,
  logout,
  verifyLogin,
  dismissUpdatePrompt,
  refreshMyDecks,
  fetchPacks,
  fetchPrivateDeck,
  fetchPublicDeck,
  setInCollection,
  setPackSpoiler,
  newCampaign,
  deleteCampaign,
  addScenarioResult,
  setMyDecks,
  setNewDeck,
  updateDeck,
};
