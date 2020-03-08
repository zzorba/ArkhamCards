import {
  CLEAR_FILTER,
  TOGGLE_FILTER,
  UPDATE_FILTER,
  ADD_FILTER_SET,
  REMOVE_FILTER_SET,
  SYNC_FILTER_SET,
  TOGGLE_MYTHOS,
  UPDATE_CARD_SORT,
  ClearFilterAction,
  ToggleFilterAction,
  UpdateFilterAction,
  AddFilterSetAction,
  SyncFilterSetAction,
  RemoveFilterSetAction,
  ToggleMythosAction,
  UpdateCardSortAction,
  SortType,
} from 'actions/types';
import { FilterState } from 'lib/filters';

export function toggleMythosMode(
  id: string,
  value: boolean
): ToggleMythosAction {
  return {
    type: TOGGLE_MYTHOS,
    id,
    value,
  };
}

export function updateCardSort(
  id: string,
  sort: SortType
): UpdateCardSortAction {
  return {
    type: UPDATE_CARD_SORT,
    id,
    sort,
  };
}

export function clearFilters(
  id: string,
  clearTraits?: string[]
): ClearFilterAction {
  return {
    type: CLEAR_FILTER,
    id,
    clearTraits,
  };
}

export function toggleFilter(
  id: string,
  key: keyof FilterState,
  value: boolean
): ToggleFilterAction {
  return {
    type: TOGGLE_FILTER,
    id,
    key,
    value,
  };
}

export function updateFilter(
  id: string,
  key: keyof FilterState,
  value: any,
): UpdateFilterAction {
  return {
    type: UPDATE_FILTER,
    id,
    key,
    value,
  };
}

export function addFilterSet(
  id: string,
  filters: FilterState,
  sort?: SortType,
  mythosToggle?: boolean
): AddFilterSetAction {
  return {
    type: ADD_FILTER_SET,
    id,
    filters,
    sort,
    mythosToggle,
  };
}

export function syncFilterSet(
  id: string,
  filters: FilterState
): SyncFilterSetAction {
  return {
    type: SYNC_FILTER_SET,
    id,
    filters,
  };
}

export function removeFilterSet(
  id: string
): RemoveFilterSetAction {
  return {
    type: REMOVE_FILTER_SET,
    id,
  };
}
