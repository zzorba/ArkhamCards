import {
  NEW_DECK_AVAILABLE,
  DELETE_DECK,
  UPDATE_DECK,
  CLEAR_DECKS,
  SET_MY_DECKS,
  MY_DECKS_START_REFRESH,
  MY_DECKS_CACHE_HIT,
  MY_DECKS_ERROR,
  SET_IN_COLLECTION,
  SET_PACK_SPOILER,
  SET_ALL_PACK_SPOILERS,
  NEW_WEAKNESS_SET,
  EDIT_WEAKNESS_SET,
  DELETE_WEAKNESS_SET,
  LOGIN_STARTED,
  LOGIN,
  LOGIN_ERROR,
  LOGOUT,
  REPLACE_LOCAL_DECK,
} from './types';

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

export function clearDecks() {
  return {
    type: CLEAR_DECKS,
  };
}

function getDecksLastModified(state) {
  return (state.decks.myDecks && state.decks.myDecks.length) ?
    state.decks.lastModified :
    null;
}

export function refreshMyDecks() {
  return (dispatch, getState) => {
    dispatch({
      type: MY_DECKS_START_REFRESH,
    });
    decks(getDecksLastModified(getState())).then(response => {
      if (response.cacheHit) {
        dispatch({
          type: MY_DECKS_CACHE_HIT,
          timestamp: new Date(),
        });
      } else {
        dispatch({
          type: SET_MY_DECKS,
          decks: response.decks,
          lastModified: response.lastModified,
          timestamp: new Date(),
        });
      }
    },
    error => {
      console.log(`ERROR: ${error.message || error}`);
      dispatch({
        type: MY_DECKS_ERROR,
        error: error.message || error,
      });
    });
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

export function replaceLocalDeck(localId, deck) {
  return {
    type: REPLACE_LOCAL_DECK,
    localId,
    deck,
  };
}

export function removeDeck(id, deleteAllVersions) {
  return {
    type: DELETE_DECK,
    id,
    deleteAllVersions: !!deleteAllVersions,
  };
}

export function fetchPrivateDeck(id) {
  return (dispatch) => {
    loadDeck(id).then(deck => {
      dispatch(updateDeck(id, deck, false));
    }).catch(err => {
      if (err.message === 'Not Found') {
        dispatch(removeDeck(id));
      }
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


export default {
  login,
  logout,
  verifyLogin,
  refreshMyDecks,
  fetchPrivateDeck,
  fetchPublicDeck,
  setInCollection,
  setPackSpoiler,
  setNewDeck,
  updateDeck,
  removeDeck,
  replaceLocalDeck,
};
