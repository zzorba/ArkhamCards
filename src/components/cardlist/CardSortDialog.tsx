import { map } from 'lodash';
import { t } from 'ttag';

import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_FACTION_PACK,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
  SortType,
} from '@actions/types';
import { showOptionDialog } from '@components/nav/helper';


function sortToCopy(sort: SortType): string {
  switch (sort) {
    case SORT_BY_TYPE:
      return t`Type`;
    case SORT_BY_FACTION:
      return t`Faction, Name`;
    case SORT_BY_FACTION_PACK:
      return t`Faction, Pack`;
    case SORT_BY_COST:
      return t`Cost`;
    case SORT_BY_PACK:
      return t`Pack`;
    case SORT_BY_TITLE:
      return t`Title`;
    case SORT_BY_ENCOUNTER_SET:
      return t`Encounter Set`;
    default: {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const _exhaustiveCheck: never = sort;
      return '';
    }
  }
}


export function showSortDialog(
  sortChanged: (sort: SortType) => void,
  selectedSort: SortType,
  hasEncounterCards: boolean
) {
  const sorts: SortType[] = [
    SORT_BY_TYPE,
    SORT_BY_FACTION,
    SORT_BY_FACTION_PACK,
    SORT_BY_COST,
    SORT_BY_PACK,
    SORT_BY_TITLE,
  ];
  if (hasEncounterCards || selectedSort === SORT_BY_ENCOUNTER_SET) {
    sorts.push(SORT_BY_ENCOUNTER_SET);
  }
  showOptionDialog(
    t`Sort by`,
    map(sorts, sortToCopy),
    (index: number) => {
      sortChanged(sorts[index]);
    }
  );
}
