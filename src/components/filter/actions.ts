import {
  CLEAR_FILTER,
  TOGGLE_FILTER,
  UPDATE_FILTER,
  ADD_FILTER_SET,
  REMOVE_FILTER_SET,
  TOGGLE_MYTHOS,
  UPDATE_CARD_SORT,
  ClearFilterAction,
  ToggleFilterAction,
  UpdateFilterAction,
  AddFilterSetAction,
  RemoveFilterSetAction,
  ToggleMythosAction,
  UpdateCardSortAction,
  SortType,
  DEFAULT_SORT,
} from '@actions/types';
import { ThunkAction } from 'redux-thunk';
import { FilterState } from '@lib/filters';
import { calculateDefaultDbFilterState } from '@components/filter/DefaultFilterState';
import Database from '@data/sqlite/Database';
import { AppState } from '@reducers';
import { Brackets } from 'typeorm/browser';

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

export function updateCardSorts(
  id: string,
  sorts: SortType[]
): UpdateCardSortAction {
  return {
    type: UPDATE_CARD_SORT,
    id,
    sorts,
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


export function addDbFilterSet(
  id: string,
  db: Database,
  query?: Brackets,
  sort?: SortType,
  tabooSetId?: number,
  mythosToggle?: boolean
): ThunkAction<void, AppState, unknown, AddFilterSetAction> {
  return async(dispatch, getState) => {
    const [filters, cardData] = await calculateDefaultDbFilterState(db, query, tabooSetId);
    const defaultSort: SortType[] = getState().settings.cardSort || DEFAULT_SORT;
    const filterAction: AddFilterSetAction = {
      type: ADD_FILTER_SET,
      id,
      filters,
      sorts: sort ? [sort] : defaultSort,
      mythosToggle,
      cardData,
    };
    dispatch(filterAction);
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
