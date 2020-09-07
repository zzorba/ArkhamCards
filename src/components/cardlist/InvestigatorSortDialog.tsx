import { map } from 'lodash';
import { t } from 'ttag';

import { showOptionDialog } from '@components/nav/helper';
import {
  SORT_BY_FACTION,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SortType,
} from '@actions/types';

function sortToCopy(sort: SortType) {
  switch (sort) {
    case SORT_BY_TITLE: return t`Title`;
    case SORT_BY_FACTION: return t`Faction`;
    case SORT_BY_PACK: return t`Pack`;
    default:
      return 'Unknown Sort';
  }
}

export function showInvestigatorSortDialog(
  sortChanged: (sort: SortType) => void
) {
  const sorts: SortType[] = [
    SORT_BY_TITLE,
    SORT_BY_FACTION,
    SORT_BY_PACK,
  ];
  showOptionDialog(
    t`Sort by`,
    map(sorts, sortToCopy),
    (index: number) => {
      sortChanged(sorts[index]);
    }
  )
}
