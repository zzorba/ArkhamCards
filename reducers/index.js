import { combineReducers } from 'redux';

import { PACKS_AVAILABLE, DECK_AVAILABLE } from '../actions/';

const DEFAULT_PACKS_STATE = { all: [], loading: true };

const packs = (state = DEFAULT_PACKS_STATE, action) => {
  if (action.type === PACKS_AVAILABLE) {
    return Object.assign({},
      state,
      {
        all: action.packs,
        loading: false,
      });
  }
  return state;
};

const DEFAULT_DECK_STATE = { all: {} };

const decks = (state = DEFAULT_DECK_STATE, action) => {
  if (action.type === DECK_AVAILABLE) {
    return Object.assign({},
      state,
      {
        all: Object.assign(
          {},
          state.all,
          { [action.id]: action.deck },
        ),
      });
  }
  return state;
};

// Combine all the reducers
const rootReducer = combineReducers({
  packs,
  decks,
});

export default rootReducer;
