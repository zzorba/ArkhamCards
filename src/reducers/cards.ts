import {
  CARD_FETCH_START,
  CARD_FETCH_SUCCESS,
  CARD_FETCH_ERROR,
  CARD_SET_SCHEMA_VERSION,
  CARD_REQUEST_FETCH,
  CardFetchStartAction,
  CardFetchSuccessAction,
  CardFetchErrorAction,
  CardSetSchemaVersionAction,
  CardRequestFetchAction,
  CardCache,
  TabooCache,
} from '@actions/types';

interface CardsState {
  loading: boolean;
  error: string | null;
  progress?: number;
  cache?: CardCache;
  tabooCache?: TabooCache;
  lang?: string | null;

  card_lang?: string | null;
  schemaVersion?: number;

  fetch?: {
    card_lang: string
    choice_lang: string;
  };
}

const DEFAULT_CARDS_STATE: CardsState = {
  loading: false,
  progress: undefined,
  error: null,
  cache: undefined,
  lang: null,
  card_lang: null,
  schemaVersion: undefined,
  fetch: undefined,
};

export default function(
  state: CardsState = DEFAULT_CARDS_STATE,
  action: CardFetchStartAction | CardRequestFetchAction | CardFetchSuccessAction | CardFetchErrorAction | CardSetSchemaVersionAction
): CardsState {
  switch (action.type) {
    case CARD_REQUEST_FETCH:
      return {
        ...state,
        fetch: {
          card_lang: action.cardLang,
          choice_lang: action.choiceLang,
        },
      };
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
        progress: undefined,
        fetch: undefined,
      };
    }
    case CARD_FETCH_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: null,
        progress: undefined,
        cache: action.cache,
        tabooCache: action.tabooCache,
        lang: undefined,
        fetch: undefined,
        card_lang: action.cardLang,
      };
    }
    case CARD_FETCH_ERROR: {
      return {
        ...state,
        loading: false,
        progress: undefined,
        error: action.error,
        cache: undefined,
        tabooCache: undefined,
        fetch: undefined,
      };
    }
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = action;
      return state;
    }
  }
}
