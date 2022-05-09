import { find, forEach } from 'lodash';

import {
  UPDATE_PROMPT_DISMISSED,
  PACKS_FETCH_START,
  PACKS_FETCH_ERROR,
  PACKS_AVAILABLE,
  PACKS_CACHE_HIT,
  SET_IN_COLLECTION,
  SET_PACK_SPOILER,
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
    return Object.assign({},
      state,
      {
        dateUpdatePrompt: action.timestamp.getTime() / 1000,
      });
  }
  if (action.type === PACKS_FETCH_START) {
    return Object.assign({}, state, {
      loading: true,
      error: null,
    });
  }
  if (action.type === PACKS_FETCH_ERROR) {
    return Object.assign({}, state, {
      loading: false,
      error: action.error,
    });
  }
  if (action.type === PACKS_CACHE_HIT) {
    return Object.assign({}, state, {
      loading: false,
      dateFetched: action.timestamp.getTime() / 1000,
      dateUpdatePrompt: action.timestamp.getTime() / 1000,
    });
  }
  if (action.type === PACKS_AVAILABLE) {
    return Object.assign({},
      state,
      {
        all: action.packs,
        lang: action.lang,
        loading: false,
        dateFetched: action.timestamp.getTime() / 1000,
        dateUpdatePrompt: action.timestamp.getTime() / 1000,
        lastModified: action.lastModified,
      });
  }

  if (action.type === SET_IN_COLLECTION) {
    const new_collection = Object.assign({}, state.in_collection);
    if (action.code) {
      if (action.value) {
        new_collection[action.code] = true;
      } else {
        delete new_collection[action.code];
      }
    } else if (action.cycle_code) {
      const cyclePack = find(state.all, pack => pack.code === action.cycle_code);
      if (cyclePack) {
        forEach(state.all, pack => {
          if (pack.cycle_position === cyclePack.cycle_position) {
            if (action.value) {
              new_collection[pack.code] = true;
            } else {
              delete new_collection[pack.code];
            }
          }
        });
      }
    }

    return Object.assign({},
      state,
      {
        in_collection: new_collection,
      },
    );
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

  if (action.type === SET_PACK_SPOILER) {
    const new_spoilers = Object.assign({}, state.show_spoilers);
    if (action.code) {
      if (action.value) {
        new_spoilers[action.code] = true;
      } else {
        delete new_spoilers[action.code];
      }
    } else if (action.cycle_code) {
      const cyclePack = find(state.all, pack => pack.code === action.cycle_code);
      if (cyclePack) {
        forEach(state.all, pack => {
          if (pack.cycle_position === cyclePack.cycle_position) {
            if (action.value) {
              new_spoilers[pack.code] = true;
            } else {
              delete new_spoilers[pack.code];
            }
          }
        });
      }
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
