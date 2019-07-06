import { pick } from 'lodash';

import { FilterState } from '../lib/filters'
import {
  CLEAR_FILTER,
  TOGGLE_FILTER,
  UPDATE_FILTER,
  REMOVE_FILTER_SET,
  ADD_FILTER_SET,
  SYNC_FILTER_SET,
  FilterActions,
} from '../actions/types';

interface FiltersState {
  all: { [componentId: string]: FilterState };
  defaults: { [componentId: string]: FilterState };
}

const DEFAULT_STATE: FiltersState = {
  all: {},
  defaults: {},
};

export default function(
  state: FiltersState = DEFAULT_STATE,
  action: FilterActions
): FiltersState {
  if (action.type === ADD_FILTER_SET) {
    return {
      ...state,
      all: {
        ...state.all,
        [action.id]: action.filters,
      },
      defaults: {
        ...state.all,
        [action.id]: action.filters,
      },
    };
  }
  if (action.type === SYNC_FILTER_SET) {
    return {
      ...state,
      all: {
        ...state.all,
        [action.id]: action.filters,
      },
    };
  }
  if (action.type === REMOVE_FILTER_SET) {
    const all = { ...state.all };
    const defaults = { ...state.defaults };
    if (all[action.id]) {
      delete all[action.id];
    }
    if (defaults[action.id]) {
      delete defaults[action.id];
    }
    return {
      ...state,
      all,
      defaults,
    };
  }
  if (action.type === TOGGLE_FILTER) {
    const existingFilters = state.all[action.id];
    return {
      ...state,
      all: {
        ...state.all,
        [action.id]: {
          ...existingFilters,
          [action.key]: action.value,
        },
      },
    };
  }
  if (action.type === UPDATE_FILTER) {
    const existingFilters = state.all[action.id];
    return {
      ...state,
      all: {
        ...state.all,
        [action.id]: {
          ...existingFilters,
          [action.key]: action.value,
        },
      },
    };
  }
  if (action.type === CLEAR_FILTER) {
    const defaultFilterState = state.defaults[action.id];
    const existingFilters = state.all[action.id];
    const filters = (action.clearTraits && action.clearTraits.length) ? {
      ...existingFilters,
      ...pick(defaultFilterState, action.clearTraits),
    } : defaultFilterState;
    return {
      ...state,
      all: {
        ...state.all,
        [action.id]: filters,
      },
    };
  }
  return state;
}
