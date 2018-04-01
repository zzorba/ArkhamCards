import { combineReducers } from 'redux';

import { PACKS_AVAILABLE, DECK_AVAILABLE, SET_IN_COLLECTION } from '../actions/';

const DEFAULT_PACKS_STATE = {
  all: [],
  in_collection: {},
  loading: true,
};

const packs = (state = DEFAULT_PACKS_STATE, action) => {
  if (action.type === PACKS_AVAILABLE) {
    return Object.assign({},
      state,
      {
        all: action.packs,
        loading: false,
      });
  } else if (action.type === SET_IN_COLLECTION) {
    const new_collection = Object.assign({}, state.in_collection);
    if (action.value) {
      new_collection[action.code] = true;
    } else {
      delete new_collection[action.code];
    }
    return Object.assign({},
      state,
      {
        in_collection: new_collection,
      },
    );
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
