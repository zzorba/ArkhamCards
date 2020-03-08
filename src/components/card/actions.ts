import Realm from 'realm';
import { ThunkAction } from 'redux-thunk';
import { Dispatch } from 'redux';

import { changeLocale } from 'app/i18n';
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
  PacksFetchStartAction,
  PacksFetchErrorAction,
  PacksCacheHitAction,
  PacksAvailableAction,
  Pack,
  CardCache,
  TabooCache,
} from 'actions/types';
import { AppState } from 'reducers/index';
import { syncCards, syncTaboos } from 'lib/publicApi';

function shouldFetchCards(state: AppState) {
  return !state.cards.loading;
}

function cardsCache(state: AppState, lang: string): undefined | CardCache {
  return (state.cards.lang || 'en') === lang ? state.cards.cache : undefined;
}

function taboosCache(state: AppState, lang: string): undefined | TabooCache {
  return (state.cards.lang || 'en') === lang ? state.cards.tabooCache : undefined;
}

export function fetchCards(
  realm: Realm,
  lang: string
): ThunkAction<void, AppState, null, CardFetchStartAction | CardFetchErrorAction | CardFetchSuccessAction> {
  return async(dispatch, getState) => {
    if (shouldFetchCards(getState())) {
      const previousLang = (getState().cards.lang || 'en');
      if (lang && previousLang !== lang) {
        changeLocale(lang);
      }
      dispatch({
        type: CARD_FETCH_START,
      });
      const packs = await dispatch(fetchPacks(lang));
      try {
        const cardCache = await syncCards(realm, packs, lang, cardsCache(getState(), lang));
        try {
          const tabooCache = await syncTaboos(realm, lang, taboosCache(getState(), lang));
          dispatch({
            type: CARD_FETCH_SUCCESS,
            cache: cardCache || undefined,
            tabooCache: tabooCache || undefined,
            lang: lang,
          });
        } catch (tabooErr) {
          dispatch({
            type: CARD_FETCH_SUCCESS,
            cache: cardCache || undefined,
            lang: lang,
          });
        }
      } catch (err) {
        dispatch({
          type: CARD_FETCH_ERROR,
          error: err.message || err,
          lang: previousLang,
        });
      }
    }
  };
}

type PackActions = PacksFetchStartAction | PacksFetchErrorAction | PacksCacheHitAction | PacksAvailableAction;
export function fetchPacks(
  lang: string
): ThunkAction<Promise<Pack[]>, AppState, null, PackActions> {
  return (dispatch: Dispatch<PackActions>, getState: () => AppState) => {
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
    const langPrefix = lang && lang !== 'en' ? `${lang}.` : '';
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
        const packs: Pack[] = json;
        dispatch({
          type: PACKS_AVAILABLE,
          packs,
          lang,
          timestamp: new Date(),
          lastModified: newLastModified || undefined,
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
