import {
  CARD_FETCH_START,
  CARD_FETCH_SUCCESS,
  CARD_FETCH_ERROR,
  CARD_SET_SCHEMA_VERSION,
  CardFetchStartAction,
  CardFetchSuccessAction,
  CardFetchErrorAction,
  CardSetSchemaVersionAction,
  CardCache,
  TabooCache,
} from '@actions/types';

interface CardsState {
  loading: boolean;
  error: string | null;
  cache?: CardCache;
  tabooCache?: TabooCache;
  lang?: string | null;
  schemaVersion?: number;
}

const DEFAULT_CARDS_STATE: CardsState = {
  loading: false,
  error: null,
  cache: undefined,
  lang: null,
  schemaVersion: undefined,
};

export default function(
  state: CardsState = DEFAULT_CARDS_STATE,
  action: CardFetchStartAction | CardFetchSuccessAction | CardFetchErrorAction | CardSetSchemaVersionAction
): CardsState {
  switch (action.type) {
    case CARD_SET_SCHEMA_VERSION: {
      return {
        ...state,
        schemaVersion: action.schemaVersion,
      };
    }
    case CARD_FETCH_START: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case CARD_FETCH_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        cache: action.cache,
        tabooCache: action.tabooCache,
        lang: action.lang,
      };
    }
    case CARD_FETCH_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error,
        cache: undefined,
        tabooCache: undefined,
      };
    }
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = action;
      return state;
    }
  }
}
