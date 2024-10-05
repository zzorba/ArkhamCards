import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { find, forEach, values } from "lodash";

import {
  CLEAR_DECKS,
  SET_MY_DECKS,
  MY_DECKS_START_REFRESH,
  MY_DECKS_CACHE_HIT,
  MY_DECKS_ERROR,
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
  SYNC_IN_COLLECTION,
  SYNC_PACK_SPOILER,
  SyncInCollectionAction,
  SyncPackSpoilerAction,
} from "./types";
import { AppState, getAllPacks, getArkhamDbDecks } from "@reducers";

import { getAccessToken, signInFlow, signOutFlow } from "@lib/auth";
import * as dissonantVoices from "@lib/dissonantVoices";
import { decks } from "@lib/authApi";

export function login(): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch): void => {
    dispatch({
      type: ARKHAMDB_LOGIN_STARTED,
    });
    signInFlow().then((response) => {
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

export function verifyLogin(): ThunkAction<
  void,
  AppState,
  unknown,
  Action<string>
> {
  return (dispatch) => {
    getAccessToken().then((accessToken) => {
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

export function dissonantVoicesLogin(): ThunkAction<
  void,
  AppState,
  unknown,
  Action<string>
> {
  return (dispatch): void => {
    dispatch({
      type: DISSONANT_VOICES_LOGIN_STARTED,
    });
    dissonantVoices.signInFlow().then((response) => {
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

export function dissonantVoicesLogout(): ThunkAction<
  void,
  AppState,
  unknown,
  Action<string>
> {
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

export function dissonantVoicesVerifyLogin(): ThunkAction<
  void,
  AppState,
  unknown,
  Action<string>
> {
  return (dispatch) => {
    dissonantVoices.getAccessToken().then((accessToken) => {
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
  return values(state.decks.all) ? state.decks.lastModified : undefined;
}

export function refreshMyDecks(
  cacheArkhamDb: boolean
): ThunkAction<Promise<ArkhamDbDeck[]>, AppState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    if (cacheArkhamDb) {
      const [arkhamDbDecks] = getArkhamDbDecks(getState());
      return arkhamDbDecks;
    }
    dispatch({
      type: MY_DECKS_START_REFRESH,
    });
    try {
      // if (getState().signedIn.with_arkhamcards) {
      //   await
      // }
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
    } catch (error) {
      console.log(`ERROR: ${error.message || error}`);
      dispatch({
        type: MY_DECKS_ERROR,
        error: error.message || error,
      });
      throw new Error(error.message);
    }
  };
}

export function syncPackSettings(
  type: "in_collection" | "show_spoilers",
  updates: { [code: string]: boolean }
): SyncInCollectionAction | SyncPackSpoilerAction {
  return {
    type: type === "in_collection" ? SYNC_IN_COLLECTION : SYNC_PACK_SPOILER,
    updates,
  };
}

type UpdateRemotePack = (
  type: "in_collection" | "show_spoilers",
  updates: { [code: string]: boolean }
) => void;

function setPack(
  type: "in_collection" | "show_spoilers",
  code: string,
  value: boolean,
  updateRemote: UpdateRemotePack | undefined
) {
  const updates = { [code]: value };
  updateRemote?.(type, updates);
  return syncPackSettings(type, updates);
}

export function setCycle(
  type: "in_collection" | "show_spoilers",
  cycle_code: string,
  value: boolean,
  updateRemote: UpdateRemotePack | undefined
): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch, getState) => {
    const packs = getAllPacks(getState());
    const updates: { [code: string]: boolean } = {};
    const cyclePack = find(packs, (pack) => pack.code === cycle_code);
    if (cyclePack) {
      forEach(packs, (pack) => {
        if (pack.cycle_position === cyclePack.cycle_position) {
          updates[pack.code] = value;
        }
      });
      updateRemote?.(type, updates);
      dispatch(syncPackSettings(type, updates));
    }
  };
}

export function setInCollection(
  code: string,
  value: boolean,
  updateRemote: UpdateRemotePack
) {
  return setPack("in_collection", code, value, updateRemote);
}

export function setCycleInCollection(
  cycle_code: string,
  value: boolean,
  updateRemote: UpdateRemotePack
): ThunkAction<void, AppState, unknown, Action<string>> {
  return setCycle("in_collection", cycle_code, value, updateRemote);
}

export function setPackSpoiler(
  code: string,
  value: boolean,
  updateRemote: UpdateRemotePack
) {
  return setPack("show_spoilers", code, value, updateRemote);
}

export function setCyclePackSpoiler(
  cycle_code: string,
  value: boolean,
  updateRemote: UpdateRemotePack
): ThunkAction<void, AppState, unknown, Action<string>> {
  return setCycle("show_spoilers", cycle_code, value, updateRemote);
}

export function setPackDraft(
  code: string,
  value: boolean
): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: SET_PACK_DRAFT,
      code,
      value,
    });
  };
}

export function setCycleDraft(
  cycle_code: string,
  value: boolean
): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    dispatch({
      type: SET_PACK_DRAFT,
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
  setPackSpoiler,
};
