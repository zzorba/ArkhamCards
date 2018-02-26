import { combineReducers } from 'redux';

import { CARDS_AVAILABLE, PACKS_AVAILABLE } from "../actions/"

const allState = { all: [], loading: true };

const cards = (state = allState, action) => {
  switch (action.type) {
    case CARDS_AVAILABLE:
      state = Object.assign({},
        state,
        {
          all: action.cards,
          loading: false,
        });
      return state;
    default:
      return state;
  }
};

const packs = (state = allState, action) => {
  switch (action.type) {
    case PACKS_AVAILABLE:
      state = Object.assign({},
        state,
        {
          all: action.packs,
          loading: false,
        });
      return state;
    default:
      return state;
  }
};

// Combine all the reducers
const rootReducer = combineReducers({
  cards,
  packs,
    // ,[ANOTHER REDUCER], [ANOTHER REDUCER] ....
});

export default rootReducer;
