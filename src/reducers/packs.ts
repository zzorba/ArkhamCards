import { find, forEach } from 'lodash';

import {
  UPDATE_PROMPT_DISMISSED,
  PACKS_FETCH_START,
  PACKS_FETCH_ERROR,
  PACKS_AVAILABLE,
  PACKS_CACHE_HIT,
  SYNC_IN_COLLECTION,
  SYNC_PACK_SPOILER,
  PacksActions,
  Pack,
  SET_PACK_DRAFT,
} from '@actions/types';

interface PacksState {
  all: Pack[];
  dateFetched: number | null;
  dateUpdatePrompt: number | null;
  in_collection: {
    [code: string]: boolean;
  };
  show_spoilers: {
    [code: string]: boolean;
  };
  draft?: {
    [code: string]: boolean;
  };
  loading: boolean;
  error: string | null;
  lastModified: string | null;
  lang: string | null;
}

const DEFAULT_PACKS_STATE: PacksState = {
  all: [],
  dateFetched: null,
  dateUpdatePrompt: null,
  in_collection: { core: true },
  show_spoilers: {},
  loading: false,
  error: null,
  lastModified: null,
  lang: null, // defaults to 'en'
};

export default function(
  state: PacksState = DEFAULT_PACKS_STATE,
  action: PacksActions
): PacksState {
  if (action.type === UPDATE_PROMPT_DISMISSED) {
    return {
      ...state,
      dateUpdatePrompt: action.timestamp.getTime() / 1000,
    };
  }
  if (action.type === PACKS_FETCH_START) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === PACKS_FETCH_ERROR) {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }
  if (action.type === PACKS_CACHE_HIT) {
    return {
      ...state,
      loading: false,
      dateFetched: action.timestamp.getTime() / 1000,
      dateUpdatePrompt: action.timestamp.getTime() / 1000,
    };
  }
  if (action.type === PACKS_AVAILABLE) {
    return {
      ...state,
      all: action.packs,
      lang: action.lang,
      loading: false,
      dateFetched: action.timestamp.getTime() / 1000,
      dateUpdatePrompt: action.timestamp.getTime() / 1000,
      lastModified: action.lastModified || null,
    };
  }


  if (action.type === SYNC_IN_COLLECTION) {
    const new_collection = Object.assign({}, state.in_collection);
    forEach(action.updates, (value, code) => {
      if (value) {
        new_collection[code] = true;
      } else {
        delete new_collection[code];
      }
    });
    return {
      ...state,
      in_collection: new_collection,
    };
  }

  if (action.type === SYNC_PACK_SPOILER) {
    const new_spoilers = Object.assign({}, state.show_spoilers);
    forEach(action.updates, (value, code) => {
      if (value) {
        new_spoilers[code] = true;
      } else {
        delete new_spoilers[code];
      }
    });
    return {
      ...state,
      show_spoilers: new_spoilers,
    };
  }

  if (action.type === SET_PACK_DRAFT) {
    const new_draft = Object.assign({}, state.draft || {});
    if (action.code) {
      if (action.value) {
        new_draft[action.code] = true;
      } else {
        delete new_draft[action.code];
      }
    } else if (action.cycle_code) {
      const cyclePack = find(state.all, pack => pack.code === action.cycle_code);
      if (cyclePack) {
        forEach(state.all, pack => {
          if (pack.cycle_position === cyclePack.cycle_position) {
            if (action.value) {
              new_draft[pack.code] = true;
            } else {
              delete new_draft[pack.code];
            }
          }
        });
      }
    }
    return {
      ...state,
      draft: new_draft,
    };
  }

  return state;
}
