import { forEach } from 'lodash';

import {
  UPDATE_PROMPT_DISMISSED,
  PACKS_AVAILABLE,
  PACKS_CACHE_HIT,
  SET_IN_COLLECTION,
  SET_ALL_PACK_SPOILERS,
  SET_PACK_SPOILER,
} from '../actions/types';

const DEFAULT_PACKS_STATE = {
  all: [],
  dateFetched: null,
  dateUpdatePrompt: null,
  in_collection: {},
  show_spoilers: {},
  loading: false,
  lastModified: null,
};

export default function(state = DEFAULT_PACKS_STATE, action) {
  if (action.type === UPDATE_PROMPT_DISMISSED) {
    return Object.assign({},
      state,
      {
        dateUpdatePrompt: action.timestamp.getTime() / 1000,
      });
  }
  if (action.type === PACKS_CACHE_HIT) {
    return Object.assign({}, state, { loading: false });
  }
  if (action.type === PACKS_AVAILABLE) {
    return Object.assign({},
      state,
      {
        all: action.packs,
        loading: false,
        dateFetched: action.timestamp.getTime() / 1000,
        dateUpdatePrompt: action.timestamp.getTime() / 1000,
        lastModified: action.lastModified,
      });
  } else if (action.type === SET_IN_COLLECTION) {
    const new_collection = Object.assign({}, state.in_collection);
    if (action.code) {
      if (action.value) {
        new_collection[action.code] = true;
      } else {
        delete new_collection[action.code];
      }
    } else if (action.cycle) {
      forEach(state.all, pack => {
        if (pack.cycle_position === action.cycle) {
          if (action.value) {
            new_collection[pack.code] = true;
          } else {
            delete new_collection[pack.code];
          }
        }
      });
    }

    return Object.assign({},
      state,
      {
        in_collection: new_collection,
      },
    );
  } else if (action.type === SET_ALL_PACK_SPOILERS) {
    return Object.assign({},
      state,
      {
        show_spoilers: Object.assign({}, action.spoilers),
      },
    );
  } else if (action.type === SET_PACK_SPOILER) {
    const new_spoilers = Object.assign({}, state.show_spoilers);
    if (action.code) {
      if (action.value) {
        new_spoilers[action.code] = true;
      } else {
        delete new_spoilers[action.code];
      }
    } else if (action.cycle) {
      forEach(state.all, pack => {
        if (pack.cycle_position === action.cycle) {
          if (action.value) {
            new_spoilers[pack.code] = true;
          } else {
            delete new_spoilers[pack.code];
          }
        }
      });
    }

    return Object.assign({},
      state,
      {
        show_spoilers: new_spoilers,
      },
    );
  }
  return state;
}
