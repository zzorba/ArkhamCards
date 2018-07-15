import {
  NEW_WEAKNESS_SET,
  EDIT_WEAKNESS_SET,
  DELETE_WEAKNESS_SET,
} from '../actions/types';

// weakness_set:
//   name: 'string',
//   created: 'date',
//   packCodes: [], // Array of packs to consider
//   assignedCards: {}, [code: quantity], // Cards we've taken out of circ.
const DEFAULT_WEAKNESS_SET_STATE = {
  all: {},
};

export default function(state = DEFAULT_WEAKNESS_SET_STATE, action) {
  if (action.type === NEW_WEAKNESS_SET) {
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: action.set }) },
    );
  }
  if (action.type === DELETE_WEAKNESS_SET) {
    const all = Object.assign({}, state.all);
    delete all[action.id];
    return Object.assign({}, state, { all });
  }
  if (action.type === EDIT_WEAKNESS_SET) {
    const set = Object.assign({}, state.all[action.id]);
    if (action.name) {
      set.name = action.name;
    }
    if (action.packCodes) {
      set.packCodes = action.packCodes;
    }
    if (action.assignedCards) {
      set.assignedCards = action.assignedCards;
    }
    return Object.assign({},
      state,
      { all: Object.assign({}, state.all, { [action.id]: set }) },
    );
  }
  return state;
}
