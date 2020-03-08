import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import {
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
} from './types';
import { AppState } from 'reducers';

import { getAccessToken, signInFlow, signOutFlow } from 'lib/auth';
// @ts-ignore
import { decks } from 'lib/authApi';

export function login(): ThunkAction<void, AppState, {}, Action> {
  return (dispatch: ThunkDispatch<AppState, {}, Action>): void => {
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

export function refreshMyDecks(): ThunkAction<void, AppState, {}, Action> {
  return (dispatch: ThunkDispatch<AppState, {}, Action>, getState: () => AppState) => {
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
  setInCollection,
  setPackSpoiler,
};
