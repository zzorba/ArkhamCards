import { pick } from 'lodash';

import { CardFilterData, FilterState } from '@lib/filters';
import {
  CLEAR_FILTER,
  TOGGLE_FILTER,
  UPDATE_FILTER,
  REMOVE_FILTER_SET,
  ADD_FILTER_SET,
  TOGGLE_MYTHOS,
  UPDATE_CARD_SORT,
  FilterActions,
  SortType,
  CardScreenType,
} from '@actions/types';

interface FiltersState {
  all: { [componentId: string]: FilterState | undefined };
  defaults: { [componentId: string]: FilterState };
  mythos: { [componentId: string]: boolean | undefined };
  sorts?: { [componentId: string]: SortType | undefined };
  newSorts?: { [componentId: string]: SortType[] | undefined };
  gSorts?: { [type in CardScreenType as string]: SortType[] | undefined };
  gMythosSorts?: { [type in CardScreenType as string]: SortType[] | undefined };
  cardData: { [componentId: string]: CardFilterData | undefined };
}

const DEFAULT_STATE: FiltersState = {
  all: {},
  defaults: {},
  mythos: {},
  sorts: {},
  newSorts: {},
  cardData: {},
  gSorts: {},
  gMythosSorts: {},
};

export default function(
  state: FiltersState = DEFAULT_STATE,
  action: FilterActions
): FiltersState {
  if (action.type === ADD_FILTER_SET) {
    if (state.defaults[action.id]) {
      // Already exists.
      return {
        ...state,
        cardData: {
          ...state.cardData,
          [action.id]: action.cardData,
        },
        defaults: {
          ...state.defaults,
          [action.id]: action.filters,
        },
      };
    }
    return {
      all: {
        ...state.all,
        [action.id]: undefined,
      },
      defaults: {
        ...state.defaults,
        [action.id]: action.filters,
      },
      mythos: {
        ...state.mythos,
      },
      sorts: {},
      newSorts: {},
      cardData: {
        ...state.cardData,
        [action.id]: action.cardData,
      },
      gSorts: state.gSorts,
      gMythosSorts: state.gMythosSorts,
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
    const cardData = { ...state.cardData };
    if (all[action.id]) {
      delete all[action.id];
    }
    if (defaults[action.id]) {
      delete defaults[action.id];
    }
    delete mythos[action.id];
    delete cardData[action.id];
    return {
      all,
      defaults,
      mythos,
      sorts: {},
      newSorts: {},
      cardData,
      gSorts: state.gSorts,
      gMythosSorts: state.gMythosSorts,
    };
  }
  if (action.type === TOGGLE_FILTER) {
    const existingFilters = state.all[action.id] || state.defaults[action.id];
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
    if (action.mythosMode) {
      return {
        ...state,
        gMythosSorts: {
          ...state.gMythosSorts,
          [action.cardScreen]: action.sorts,
        },
      };
    }
    return {
      ...state,
      gSorts: {
        ...state.gSorts,
        [action.cardScreen]: action.sorts,
      },
    };
  }
  if (action.type === UPDATE_FILTER) {
    const existingFilters = state.all[action.id] || state.defaults[action.id];
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
    const existingFilters = state.all[action.id] || defaultFilterState;
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
