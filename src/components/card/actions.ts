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
  CardRequestFetchAction,
  CARD_REQUEST_FETCH,
} from '@actions/types';
import { getCardLang, AppState } from '@reducers/index';
import { NON_LOCALIZED_CARDS, syncCards, syncTaboos } from '@lib/publicApi';
import Database from '@data/sqlite/Database';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

const VERBOSE = false;
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

export function requestFetchCards(
  cardLang: string,
  choiceLang: string,
): CardRequestFetchAction {
  return {
    type: CARD_REQUEST_FETCH,
    cardLang,
    choiceLang,
  };
}

export function fetchCards(
  db: Database,
  anonClient: ApolloClient<NormalizedCacheObject>,
  cardLang: string,
  choiceLang: string,
  updateProgress: (progress: number, msg?: string) => void
): ThunkAction<void, AppState, unknown, CardSetSchemaVersionAction | CardFetchStartAction | CardFetchErrorAction | CardFetchSuccessAction> {
  return async(dispatch, getState) => {
    VERBOSE && console.log('Fetch Cards called');
    if (!shouldFetchCards(getState())) {
      VERBOSE && console.log('Skipping fetch cards');
      return;
    }
    const previousLang = getCardLang(getState());
    if (cardLang && previousLang !== cardLang) {
      VERBOSE && console.log('Locale changed');
      changeLocale(cardLang);
    }
    dispatch({
      type: CARD_SET_SCHEMA_VERSION,
      schemaVersion: Database.SCHEMA_VERSION,
    });
    dispatch({
      type: CARD_FETCH_START,
    });
    VERBOSE && console.log('Fetching packs');
    const packs = await dispatch(fetchPacks(cardLang));
    VERBOSE && console.log('Packs fetched');

    try {
      const state = getState();
      const sqliteVersion = await db.sqliteVersion();

      const cardCache = await syncCards(updateProgress, db, sqliteVersion, anonClient, packs, cardLang, cardsCache(state, cardLang));
      try {
        const tabooCache = await syncTaboos(
          updateProgress,
          db,
          sqliteVersion,
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
      console.log(err);
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
): ThunkAction<Promise<Pack[]>, AppState, unknown, PackActions> {
  return async(dispatch: Dispatch<PackActions>, getState: () => AppState) => {
    try {
      VERBOSE && console.log('entered fetchPacks');
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
      const langPrefix = lang && !NON_LOCALIZED_CARDS.has(lang) ? `${lang}.` : '';
      VERBOSE && console.log(`Fetch called: https://${langPrefix}arkhamdb.com/api/public/packs/`);
      const response = await fetch(`https://${langPrefix}arkhamdb.com/api/public/packs/`, {
        method: 'GET',
        headers: headers,
      });
      VERBOSE && console.log('Got packs response');
      if (response.status === 304) {
        VERBOSE && console.log('Packs returned 304');
        // Cache hit, no change needed.
        dispatch({
          type: PACKS_CACHE_HIT,
          timestamp: new Date(),
        });
        return packs;
      }
      const newLastModified = response.headers.get('Last-Modified');
      const json = await response.json();
      VERBOSE && console.log('Got packs json');
      const newPacks: Pack[] = json;
      dispatch({
        type: PACKS_AVAILABLE,
        packs: newPacks,
        lang,
        timestamp: new Date(),
        lastModified: newLastModified || undefined,
      });
      return newPacks;
    } catch(err){
      console.log(err);
      dispatch({
        type: PACKS_FETCH_ERROR,
        error: err.message || err,
      });
      return [];
    }
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
