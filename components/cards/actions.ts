import Realm from 'realm';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  PACKS_AVAILABLE,
  PACKS_FETCH_START,
  PACKS_FETCH_ERROR,
  PACKS_CACHE_HIT,
  CARD_FETCH_START,
  CARD_FETCH_SUCCESS,
  CARD_FETCH_ERROR,
  UPDATE_PROMPT_DISMISSED,
  CardFetchStartAction,
  CardFetchSuccessAction,
  CardFetchErrorAction,
  Pack,
  CardCache,
} from '../../actions/types';
import { AppState } from '../../reducers/index';
import { syncCards } from '../../lib/publicApi';

function shouldFetchCards(state: AppState) {
  return !state.cards.loading;
}

function cardsCache(state: AppState, lang: string): undefined | CardCache {
  /* eslint-disable eqeqeq */
  return state.cards.lang == lang ? state.cards.cache : undefined;
}

export function fetchCards(
  realm: Realm,
  lang: string
): ThunkAction<void, AppState, null, Action<string>> {
  return (dispatch, getState) => {
    if (shouldFetchCards(getState())) {
      dispatch({
        type: CARD_FETCH_START,
      });
      dispatch(fetchPacks(lang)).then(packs => {
        return syncCards(realm, packs, lang, cardsCache(getState(), lang)).then(
          (cache) => {
            dispatch({
              type: CARD_FETCH_SUCCESS,
              cache: cache,
              lang: lang,
            });
          },
          (err) => {
            dispatch({
              type: CARD_FETCH_ERROR,
              error: err.message || err,
            });
          },
        );
      });
    }
  };
}

export function fetchPacks(
  lang: string
): ThunkAction<Promise<Pack[]>, AppState, null, Action<string>> {
  return (dispatch, getState) => {
    dispatch({
      type: PACKS_FETCH_START,
    });
    const state = getState().packs;
    const lastModified = state.lastModified;
    const packs = state.all;
    const headers = new Headers();
    /* eslint-disable eqeqeq */
    if (lastModified && packs && packs.length && state.lang == lang) {
      headers.append('If-Modified-Since', lastModified);
    }
    const langPrefix = lang ? `${lang}.` : '';
    return fetch(`https://${langPrefix}arkhamdb.com/api/public/packs/`, {
      method: 'GET',
      headers: headers,
    }).then(response => {
      if (response.status === 304) {
        // Cache hit, no change needed.
        dispatch({
          type: PACKS_CACHE_HIT,
          timestamp: new Date(),
        });
        return Promise.resolve(packs);
      }
      const newLastModified = response.headers.get('Last-Modified');
      return response.json().then(json => {
        dispatch({
          type: PACKS_AVAILABLE,
          packs: json,
          lang: lang,
          timestamp: new Date(),
          lastModified: newLastModified,
        });
        return json;
      });
    }).catch(err => {
      console.log(err);
      dispatch({
        type: PACKS_FETCH_ERROR,
        error: err.message || err,
      });
      return [];
    });
  };
}


export function dismissUpdatePrompt() {
  return {
    type: UPDATE_PROMPT_DISMISSED,
    timestamp: new Date(),
  };
}

export default {
  fetchPacks,
  fetchCards,
  dismissUpdatePrompt,
};
