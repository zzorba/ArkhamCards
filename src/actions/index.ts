import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { values } from 'lodash';

import {
  CLEAR_DECKS,
  SET_MY_DECKS,
  MY_DECKS_START_REFRESH,
  MY_DECKS_CACHE_HIT,
  MY_DECKS_ERROR,
  SET_IN_COLLECTION,
  SET_PACK_SPOILER,
  ARKHAMDB_LOGIN_STARTED,
  ARKHAMDB_LOGIN,
  ARKHAMDB_LOGIN_ERROR,
  ARKHAMDB_LOGOUT,
  DISSONANT_VOICES_LOGIN_STARTED,
  DISSONANT_VOICES_LOGIN,
  DISSONANT_VOICES_LOGIN_ERROR,
  DISSONANT_VOICES_LOGOUT,
  ArkhamDbDeck,
  SET_PACK_DRAFT,
} from './types';
import { AppState, getArkhamDbDecks } from '@reducers';

import { getAccessToken, signInFlow, signOutFlow } from '@lib/auth';
import * as dissonantVoices from '@lib/dissonantVoices';
import { decks } from '@lib/authApi';

export function login(): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch): void => {
    dispatch({
      type: ARKHAMDB_LOGIN_STARTED,
    });
    signInFlow().then(response => {
      if (response.success) {
        dispatch({
          type: ARKHAMDB_LOGIN,
        });
        dispatch(refreshMyDecks(false));
      } else {
        dispatch({
          type: ARKHAMDB_LOGIN_ERROR,
          error: response.error,
        });
      }
    });
  };
}

export function logout(): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: ARKHAMDB_LOGIN_STARTED,
    });
    signOutFlow().then(() => {
      dispatch({
        type: ARKHAMDB_LOGOUT,
      });
    });
  };
}

export function verifyLogin(): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    getAccessToken().then(accessToken => {
      if (accessToken) {
        dispatch({
          type: ARKHAMDB_LOGIN,
        });
      } else {
        dispatch({
          type: ARKHAMDB_LOGOUT,
        });
      }
    });
  };
}

export function dissonantVoicesLogin(): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch): void => {
    dispatch({
      type: DISSONANT_VOICES_LOGIN_STARTED,
    });
    dissonantVoices.signInFlow().then(response => {
      if (response.success) {
        dispatch({
          type: DISSONANT_VOICES_LOGIN,
        });
      } else {
        dispatch({
          type: DISSONANT_VOICES_LOGIN_ERROR,
          error: response.error,
        });
      }
    });
  };
}

export function dissonantVoicesLogout(): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: DISSONANT_VOICES_LOGIN_STARTED,
    });
    dissonantVoices.signOutFlow().then(() => {
      dispatch({
        type: DISSONANT_VOICES_LOGOUT,
      });
    });
  };
}

export function dissonantVoicesVerifyLogin(): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dissonantVoices.getAccessToken().then(accessToken => {
      if (accessToken) {
        dispatch({
          type: DISSONANT_VOICES_LOGIN,
        });
      } else {
        dispatch({
          type: DISSONANT_VOICES_LOGOUT,
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
  return values(state.decks.all) ?
    state.decks.lastModified :
    undefined;
}

export function refreshMyDecks(cacheArkhamDb: boolean): ThunkAction<Promise<ArkhamDbDeck[]>, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    if (cacheArkhamDb) {
      const [arkhamDbDecks] = getArkhamDbDecks(getState());
      return arkhamDbDecks;
    }
    dispatch({
      type: MY_DECKS_START_REFRESH,
    });
    try {
      const response = await decks(getDecksLastModified(getState()));
      if (response.cacheHit) {
        dispatch({
          type: MY_DECKS_CACHE_HIT,
          timestamp: new Date(),
        });
        const [arkhamDbDecks] = getArkhamDbDecks(getState());
        return arkhamDbDecks;
      }
      dispatch({
        type: SET_MY_DECKS,
        decks: response.decks,
        lastModified: response.lastModified,
        timestamp: new Date(),
      });
      return response.decks || [];
    } catch(error) {
      console.log(`ERROR: ${error.message || error}`);
      dispatch({
        type: MY_DECKS_ERROR,
        error: error.message || error,
      });
      throw new Error(error.message);
    }
  };
}

export function setInCollection(code: string, value: boolean): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: SET_IN_COLLECTION,
      code,
      value,
    });
  };
}

export function setCycleInCollection(cycle_code: string, value: boolean): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: SET_IN_COLLECTION,
      cycle_code,
      value,
    });
  };
}


export function setPackDraft(code: string, value: boolean): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: SET_PACK_DRAFT,
      code,
      value,
    });
  };
}

export function setCycleDraft(cycle_code: string, value: boolean): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: SET_PACK_DRAFT,
      cycle_code,
      value,
    });
  };
}

export function setPackSpoiler(code: string, value: boolean): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: SET_PACK_SPOILER,
      code,
      value,
    });
  };
}

export function setCyclePackSpoiler(cycle_code: string, value: boolean): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: SET_PACK_SPOILER,
      cycle_code,
      value,
    });
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
