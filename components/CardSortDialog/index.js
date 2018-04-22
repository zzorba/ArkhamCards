import React from 'react';
import PropTypes from 'prop-types';

import DialogPicker from '../core/DialogPicker';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
} from './constants';

const SORTS = [
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
];

export default class CardSortDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    sortChanged: PropTypes.func.isRequired,
    selectedSort: PropTypes.string.isRequired,
  };

  render() {
    const {
      navigator,
      sortChanged,
      selectedSort,
    } = this.props;

    return (
      <DialogPicker
        navigator={navigator}
        options={SORTS}
        onSelectionChanged={sortChanged}
        header="Sort by"
        selectedOption={selectedSort}
      />
    );
  }
}
