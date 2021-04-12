import { filter } from 'lodash';

import {
  TrackedQueriesAction,
  TRACKED_QUERIES_ADD,
  TRACKED_QUERIES_REMOVE,
  TrackedQuery,
} from '@actions/types';

interface TrackedQueriesById {
  [key: string]: TrackedQuery;
}

type TrackedQueriesIds = string[];

interface TrackedQueriesState {
  byId: TrackedQueriesById;
  ids: TrackedQueriesIds;
}

const DEFAULT_STATE: TrackedQueriesState = {
  byId: {},
  ids: [],
};

export default function(
  state: TrackedQueriesState = DEFAULT_STATE,
  action: TrackedQueriesAction
): TrackedQueriesState {
  switch (action.type) {
    case TRACKED_QUERIES_ADD:
      return {
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload,
        },
        ids: [
          ...state.ids,
          action.payload.id,
        ],
      };
    case TRACKED_QUERIES_REMOVE: {
      const byId = {
        ...state.byId,
      };
      delete byId[action.payload];
      return {
        byId,
        ids: filter(state.ids, id => id !== action.payload),
      };
    }
    default:
      return state;
  }
}
