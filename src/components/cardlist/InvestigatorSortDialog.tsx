import { findIndex, map } from 'lodash';
import { t } from 'ttag';
import { useMemo } from 'react';

import { useOptionDialog } from '@components/nav/helper';
import {
  SORT_BY_CARD_ID,
  SORT_BY_FACTION,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SortType,
} from '@actions/types';

function sortToCopy(sort: SortType) {
  switch (sort) {
    case SORT_BY_TITLE: return t`Title`;
    case SORT_BY_FACTION: return t`Class`;
    case SORT_BY_PACK: return t`Pack`;
    default:
      return 'Unknown Sort';
  }
}

export function useInvestigatorSortDialog(
  selection: SortType[],
  sortChanged: (sort: SortType[]) => void
) {
  const [sortCopy, sorts] = useMemo(() => {
    const sorts: SortType[] = [
      SORT_BY_TITLE,
      SORT_BY_FACTION,
      SORT_BY_PACK,
    ];
    return [
      map(sorts, sortToCopy),
      sorts,
    ];
  }, []);
  return useOptionDialog(
    t`Sort by`,
    findIndex(sorts, x => x === selection[0]),
    sortCopy,
    (index: number) => {
      switch (sorts[index]) {
        case SORT_BY_TITLE: sortChanged([SORT_BY_TITLE]); break;
        case SORT_BY_FACTION: sortChanged([SORT_BY_FACTION, SORT_BY_TITLE]); break;
        case SORT_BY_PACK: sortChanged([SORT_BY_PACK, SORT_BY_CARD_ID]); break;
      }
    }
  );
}
