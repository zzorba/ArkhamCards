import { ThunkAction } from 'redux-thunk';

import { changeLocale } from '@app/i18n';
import {
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
  CardCache,
  CardSetSchemaVersionAction,
  CardRequestFetchAction,
  CARD_REQUEST_FETCH,
  SET_AUDIO_LANGUAGE_CHOICE,
  SetAudioLanguageChoiceAction,
} from '@actions/types';
import { getCardLang, AppState } from '@reducers/index';
import { syncCards } from '@lib/publicApi';
import Database from '@data/sqlite/Database';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

const VERBOSE = false;
function shouldFetchCards(state: AppState) {
  return !state.cards.loading;
}

export function cardsCache(state: AppState, lang: string): undefined | CardCache {
  return getCardLang(state) === lang ? state.cards.cache : undefined;
}

export function setLanguageChoice(choiceLang: string): SetLanguageChoiceAction {
  return {
    type: SET_LANGUAGE_CHOICE,
    choiceLang,
  };
}


export function setAudioLanguageChoice(choiceLang: string): SetAudioLanguageChoiceAction {
  return {
    type: SET_AUDIO_LANGUAGE_CHOICE,
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
  updateProgress: (progress: number, estimateMillis?: number, msg?: string) => void
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
    try {
      const state = getState();
      const sqliteVersion = await db.sqliteVersion();

      const cardCache = await syncCards(updateProgress, db, sqliteVersion, anonClient, dispatch, cardLang, cardsCache(state, cardLang));
      try {
        db.reloadPlayerCards();
        dispatch({
          type: CARD_FETCH_SUCCESS,
          cache: cardCache || undefined,
          tabooCache: undefined,
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
export function dismissUpdatePrompt() {
  return {
    type: UPDATE_PROMPT_DISMISSED,
    timestamp: new Date(),
  };
}

export default {
  fetchCards,
  dismissUpdatePrompt,
};
