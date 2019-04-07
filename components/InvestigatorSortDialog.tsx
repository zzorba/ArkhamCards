import React from 'react';
import { find, map } from 'lodash';

import L from '../app/i18n';
import DialogPicker from './core/DialogPicker';
import {
  SORT_BY_FACTION,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SortType
} from './CardSortDialog/constants';

interface Props {
  componentId: string;
  sortChanged: (sort: SortType) => void;
  selectedSort: SortType;
}

export default class InvestigatorSortDialog extends React.Component<Props> {
  static sortToCopy(sort: SortType) {
    switch (sort) {
      case SORT_BY_TITLE: return L('Title');
      case SORT_BY_FACTION: return L('Faction');
      case SORT_BY_PACK: return L('Pack');
      default:
        return 'Unknown Sort';
    }
  }

  sorts: SortType[] = [
    SORT_BY_TITLE,
    SORT_BY_FACTION,
    SORT_BY_PACK,
  ];

  _onSortChanged = (sortString: string) => {
    const {
      sortChanged,
    } = this.props;
    const sort: SortType =
      find(this.sorts, sort => InvestigatorSortDialog.sortToCopy(sort) === sortString) ||
      SORT_BY_TITLE;

    sortChanged(sort);
  };

  render() {
    const {
      componentId,
      selectedSort,
    } = this.props;

    return (
      <DialogPicker
        componentId={componentId}
        options={map(this.sorts, InvestigatorSortDialog.sortToCopy)}
        onSelectionChanged={this._onSortChanged}
        header={L('Sort by')}
        selectedOption={InvestigatorSortDialog.sortToCopy(selectedSort)}
      />
    );
  }
}
