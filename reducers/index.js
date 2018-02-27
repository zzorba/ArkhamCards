import { combineReducers } from 'redux';

import { CARDS_AVAILABLE, PACKS_AVAILABLE, DECK_AVAILABLE } from "../actions/"

const allState = { all: [], loading: true };

const cards = (state = allState, action) => {
  switch (action.type) {
    case CARDS_AVAILABLE:
      const cards = {};
      action.cards.forEach(card => {
        cards[card.code] = card;
      });
      state = Object.assign({},
        state,
        {
          all: cards,
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

const DEFAULT_DECK_STATE = { all: {} };

const decks = (state = DEFAULT_DECK_STATE, action) => {
  switch (action.type) {
    case DECK_AVAILABLE:
      state = Object.assign({},
        state,
        {
          all: Object.assign({}, state.all, {
            [action.id]: action.deck,
          }),
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
  decks,
    // ,[ANOTHER REDUCER], [ANOTHER REDUCER] ....
});

export default rootReducer;
