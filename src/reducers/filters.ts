import { pick } from 'lodash';

import { FilterState } from 'lib/filters';
import {
  SORT_BY_TYPE,
  CLEAR_FILTER,
  TOGGLE_FILTER,
  UPDATE_FILTER,
  REMOVE_FILTER_SET,
  ADD_FILTER_SET,
  SYNC_FILTER_SET,
  TOGGLE_MYTHOS,
  UPDATE_CARD_SORT,
  FilterActions,
  SortType,
} from 'actions/types';

interface FiltersState {
  all: { [componentId: string]: FilterState };
  defaults: { [componentId: string]: FilterState };
  mythos: { [componentId: string]: boolean };
  sorts: { [componentId: string]: SortType };
}

const DEFAULT_STATE: FiltersState = {
  all: {},
  defaults: {},
  mythos: {},
  sorts: {},
};

export default function(
  state: FiltersState = DEFAULT_STATE,
  action: FilterActions
): FiltersState {
  if (action.type === ADD_FILTER_SET) {
    return {
      all: {
        ...state.all,
        [action.id]: action.filters,
      },
      defaults: {
        ...state.defaults,
        [action.id]: action.filters,
      },
      mythos: {
        ...state.mythos,
        [action.id]: !action.mythosToggle,
      },
      sorts: {
        ...state.sorts,
        [action.id]: action.sort || SORT_BY_TYPE,
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
  if (action.type === TOGGLE_MYTHOS) {
    return {
      ...state,
      mythos: {
        ...state.mythos,
        [action.id]: action.value,
      },
    };
  }
  if (action.type === REMOVE_FILTER_SET) {
    const all = { ...state.all };
    const defaults = { ...state.defaults };
    const mythos = { ...state.mythos };
    const sorts = { ...state.sorts };
    if (all[action.id]) {
      delete all[action.id];
    }
    if (defaults[action.id]) {
      delete defaults[action.id];
    }
    delete mythos[action.id];
    delete sorts[action.id];
    return {
      all,
      defaults,
      mythos,
      sorts,
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
  if (action.type === UPDATE_CARD_SORT) {
    return {
      ...state,
      sorts: {
        ...state.sorts,
        [action.id]: action.sort,
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
