import {
  CARD_FETCH_START,
  CARD_FETCH_SUCCESS,
  CARD_FETCH_ERROR,
  CardFetchStartAction,
  CardFetchSuccessAction,
  CardFetchErrorAction,
  CardCache,
} from '../actions/types';

interface CardsState {
  loading: boolean;
  error: string | null;
  cache?: CardCache;
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
        lang: action.lang,
      };
    }
    case CARD_FETCH_ERROR: {
      return {
        loading: false,
        error: action.error,
        cache: undefined,
      };
    }
    default: {
      return state;
    }
  }
}
