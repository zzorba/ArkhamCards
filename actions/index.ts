import Config from 'react-native-config';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

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
  LOGIN_STARTED,
  LOGIN,
  LOGIN_ERROR,
  LOGOUT,
  REPLACE_LOCAL_DECK,
  Deck,
} from './types';
import { AppState } from '../reducers';

import { getAccessToken, signInFlow, signOutFlow } from '../lib/auth';
// @ts-ignore
import { decks, loadDeck } from '../lib/authApi';

export function login(): ThunkAction<void, AppState, null, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: LOGIN_STARTED,
    });
    signInFlow().then(response => {
      if (response.success) {
        dispatch({
          type: LOGIN,
        });
        dispatch(refreshMyDecks());
      } else {
        dispatch({
          type: LOGIN_ERROR,
          error: response.error,
        });
      }
    });
  };
}

export function logout(): ThunkAction<void, AppState, null, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: LOGIN_STARTED,
    });
    signOutFlow().then(() => {
      dispatch({
        type: LOGOUT,
      });
    });
  };
}

export function verifyLogin(): ThunkAction<void, AppState, null, Action<string>> {
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

export function clearDecks(): Action<string> {
  return {
    type: CLEAR_DECKS,
  };
}

function getDecksLastModified(state: AppState): string | undefined {
  return (state.decks.myDecks && state.decks.myDecks.length) ?
    state.decks.lastModified :
    undefined;
}

export function refreshMyDecks(): ThunkAction<void, AppState, null, Action<string>> {
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

export function setNewDeck(
  id: number,
  deck: Deck
) {
  return {
    type: NEW_DECK_AVAILABLE,
    id,
    deck,
  };
}

export function updateDeck(
  id: number,
  deck: Deck,
  isWrite: boolean
) {
  return {
    type: UPDATE_DECK,
    id,
    deck,
    isWrite,
  };
}

export function replaceLocalDeck(localId: number, deck: Deck) {
  return {
    type: REPLACE_LOCAL_DECK,
    localId,
    deck,
  };
}

export function removeDeck(id: number, deleteAllVersions?: boolean) {
  return {
    type: DELETE_DECK,
    id,
    deleteAllVersions: !!deleteAllVersions,
  };
}

export function fetchPrivateDeck(
  id: number
): ThunkAction<void, AppState, null, Action<string>> {
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

export function fetchPublicDeck(
  id: number,
  useDeckEndpoint: boolean
): ThunkAction<void, AppState, null, Action<string>> {
  return (dispatch) => {
    const uri = `${Config.OAUTH_SITE}api/public/${useDeckEndpoint ? 'deck' : 'decklist'}/${id}`;
    fetch(uri, { method: 'GET' })
      .then(response => {
        if (response.ok === true) {
          return response.json();
        }
        throw new Error(`Unexpected status: ${response.status}`);
      })
      .then(json => {
        dispatch(updateDeck(id, json, false));
      }).catch((err: Error) => {
        if (!useDeckEndpoint) {
          return dispatch(fetchPublicDeck(id, true));
        }
        console.log(err);
      });
  };
}

export function setInCollection(code: string, value: boolean) {
  return {
    type: SET_IN_COLLECTION,
    code,
    value,
  };
}

export function setCycleInCollection(cycle: number, value: boolean) {
  return {
    type: SET_IN_COLLECTION,
    cycle,
    value,
  };
}

export function setPackSpoiler(code: string, value: boolean) {
  return {
    type: SET_PACK_SPOILER,
    code,
    value,
  };
}

export function setCyclePackSpoiler(cycle: number, value: boolean) {
  return {
    type: SET_PACK_SPOILER,
    cycle,
    value,
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
