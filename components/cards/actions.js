import {
  PACKS_AVAILABLE,
  PACKS_CACHE_HIT,
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
  return (dispatch, getState) => {
    const lastModified = getState().packs.lastModified;
    const packs = getState().packs.all;
    const headers = {};
    if (lastModified && packs && packs.length) {
      headers['If-Modified-Since'] = lastModified;
    }
    return fetch('https://arkhamdb.com/api/public/packs/', {
      method: 'GET',
      headers: headers,
   }).then(response => {
      const lastModified = response.headers.get('Last-Modified');
      if (response.status === 304) {
        // Cache hit, no change needed.
        dispatch({ type: PACKS_CACHE_HIT });
        return Promise.resolve(packs);
      }
      const newLastModified = response.headers.get('Last-Modified');
      return response.json().then(json => {
        dispatch({
          type: PACKS_AVAILABLE,
          packs: json,
          timestamp: new Date(),
          lastModified: newLastModified,
        });
        return json;
      });
    }).catch(err => {
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
