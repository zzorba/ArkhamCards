import {
  CARD_FETCH_START,
  CARD_FETCH_SUCCESS,
  CARD_FETCH_ERROR,
  CardFetchStartAction,
  CardFetchSuccessAction,
  CardFetchErrorAction,
  CardCache,
  TabooCache,
} from 'actions/types';

interface CardsState {
  loading: boolean;
  error: string | null;
  cache?: CardCache;
  tabooCache?: TabooCache;
  lang?: string | null;
}

const DEFAULT_CARDS_STATE: CardsState = {
  loading: false,
  error: null,
  cache: undefined,
  lang: null,
};

export default function(
  state: CardsState = DEFAULT_CARDS_STATE,
  action: CardFetchStartAction | CardFetchSuccessAction | CardFetchErrorAction
): CardsState {
  switch (action.type) {
    case CARD_FETCH_START: {
      return Object.assign({},
        state,
        {
          loading: true,
          error: null,
        },
      );
    }
    case CARD_FETCH_SUCCESS: {
      return {
        loading: false,
        error: null,
        cache: action.cache,
        tabooCache: action.tabooCache,
        lang: action.lang,
      };
    }
    case CARD_FETCH_ERROR: {
      return {
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
