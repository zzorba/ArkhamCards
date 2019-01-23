import React from 'react';
import PropTypes from 'prop-types';
import { findKey, map } from 'lodash';

import L from '../app/i18n';
import DialogPicker from './core/DialogPicker';
import {
  SORT_BY_FACTION,
  SORT_BY_PACK,
  SORT_BY_TITLE,
} from './CardSortDialog/constants';

export default class InvestigatorSortDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    sortChanged: PropTypes.func.isRequired,
    selectedSort: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this._onSortChanged = this.onSortChanged.bind(this);
  }

  sortToCopyMap() {
    return {
      [SORT_BY_TITLE]: L('Title'),
      [SORT_BY_FACTION]: L('Faction'),
      [SORT_BY_PACK]: L('Pack'),
    };
  }

  onSortChanged(sort) {
    const {
      sortChanged,
    } = this.props;
    sortChanged(findKey(this.sortToCopyMap(), entry => entry === sort));
  }

  render() {
    const {
      componentId,
      selectedSort,
    } = this.props;

    const sorts = [
      SORT_BY_TITLE,
      SORT_BY_FACTION,
      SORT_BY_PACK,
    ];

    const sortMap = this.sortToCopyMap();

    return (
      <DialogPicker
        componentId={componentId}
        options={map(sorts, sort => sortMap[sort])}
        onSelectionChanged={this._onSortChanged}
        header={L('Sort by')}
        selectedOption={sortMap[selectedSort]}
      />
    );
  }
}
