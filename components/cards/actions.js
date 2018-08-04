import {
  PACKS_AVAILABLE,
  CARD_FETCH_START,
  CARD_FETCH_SUCCESS,
  CARD_FETCH_ERROR,
  UPDATE_PROMPT_DISMISSED,
} from '../../actions/types';
import { syncCards } from '../../lib/publicApi';

function shouldFetchCards(state) {
  return !state.cards.loading;
}

function cardsCache(state) {
  return state.cards.cache;
}

export function fetchCards(realm) {
  return (dispatch, getState) => {
    if (shouldFetchCards(getState())) {
      dispatch({
        type: CARD_FETCH_START,
      });
      dispatch(fetchPacks()).then(packs => {
        return syncCards(realm, packs, cardsCache(getState())).then(
          (cache) => {
            dispatch({
              type: CARD_FETCH_SUCCESS,
              cache: cache,
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

export function fetchPacks() {
  return (dispatch) => {
    return fetch('https://arkhamdb.com/api/public/packs/', { method: 'GET' })
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: PACKS_AVAILABLE,
          packs: json,
          timestamp: new Date(),
        });
        return json;
      },
      err => {
        console.log(err);
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
