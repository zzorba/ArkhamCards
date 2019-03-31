export const SORT_BY_TYPE = 'Type';
export const SORT_BY_FACTION = 'Faction';
export const SORT_BY_COST = 'Cost';
export const SORT_BY_PACK = 'Pack';
export const SORT_BY_TITLE = 'Title';
export const SORT_BY_ENCOUNTER_SET = 'Encounter Set';

export type SortType =
  typeof SORT_BY_TYPE |
  typeof SORT_BY_FACTION |
  typeof SORT_BY_COST |
  typeof SORT_BY_PACK |
  typeof SORT_BY_TITLE |
  typeof SORT_BY_ENCOUNTER_SET;
