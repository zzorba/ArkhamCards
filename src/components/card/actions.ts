import { ThunkAction } from 'redux-thunk';
import { Dispatch } from 'redux';

import { changeLocale } from '@app/i18n';
import {
  PACKS_AVAILABLE,
  PACKS_FETCH_START,
  PACKS_FETCH_ERROR,
  PACKS_CACHE_HIT,
  CARD_SET_SCHEMA_VERSION,
  CARD_FETCH_START,
  CARD_FETCH_SUCCESS,
  CARD_FETCH_ERROR,
  UPDATE_PROMPT_DISMISSED,
  SET_LANGUAGE_CHOICE,
  SetLanguageChoiceAction,
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
  CardSetSchemaVersionAction,
} from '@actions/types';
import { getCardLang, AppState } from '@reducers/index';
import { syncCards, syncTaboos } from '@lib/publicApi';
import Database from '@data/Database';

function shouldFetchCards(state: AppState) {
  return !state.cards.loading;
}

function cardsCache(state: AppState, lang: string): undefined | CardCache {
  return getCardLang(state) === lang ? state.cards.cache : undefined;
}

function taboosCache(state: AppState, lang: string): undefined | TabooCache {
  return getCardLang(state) === lang ? state.cards.tabooCache : undefined;
}

export function setLanguageChoice(choiceLang: string): SetLanguageChoiceAction {
  return {
    type: SET_LANGUAGE_CHOICE,
    choiceLang,
  };
}

export function fetchCards(
  db: Database,
  cardLang: string,
  choiceLang: string
): ThunkAction<void, AppState, null, CardSetSchemaVersionAction | CardFetchStartAction | CardFetchErrorAction | CardFetchSuccessAction> {
  return async(dispatch, getState) => {
    if (!shouldFetchCards(getState())) {
      return;
    }
    const previousLang = getCardLang(getState());
    if (cardLang && previousLang !== cardLang) {
      changeLocale(cardLang);
    }
    dispatch({
      type: CARD_SET_SCHEMA_VERSION,
      schemaVersion: Database.SCHEMA_VERSION,
    });
    dispatch({
      type: CARD_FETCH_START,
    });
    const packs = await dispatch(fetchPacks(cardLang));
    try {
      const cardCache = await syncCards(db, packs, cardLang, cardsCache(getState(), cardLang));
      try {
        const tabooCache = await syncTaboos(
          db,
          cardLang,
          taboosCache(getState(), cardLang)
        );
        db.reloadPlayerCards();
        dispatch({
          type: CARD_FETCH_SUCCESS,
          cache: cardCache || undefined,
          tabooCache: tabooCache || undefined,
          cardLang,
          choiceLang,
        });
      } catch (tabooErr) {
        dispatch({
          type: CARD_FETCH_SUCCESS,
          cache: cardCache || undefined,
          cardLang,
          choiceLang,
        });
      }
    } catch (err) {
      dispatch({
        type: CARD_FETCH_ERROR,
        error: err.message || err,
        lang: previousLang,
      });
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
