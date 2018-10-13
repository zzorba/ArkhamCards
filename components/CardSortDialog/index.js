import React from 'react';
import PropTypes from 'prop-types';
import { findKey, map } from 'lodash';
import { connectRealm } from 'react-native-realm';

import L from '../../app/i18n';
import DialogPicker from '../core/DialogPicker';
import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
} from './constants';

class CardSortDialog extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    sortChanged: PropTypes.func.isRequired,
    selectedSort: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    query: PropTypes.string,
    searchTerm: PropTypes.string,
    hasEncounterCards: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this._onSortChanged = this.onSortChanged.bind(this);
  }

  sortToCopyMap() {
    return {
      [SORT_BY_TYPE]: L('Type'),
      [SORT_BY_FACTION]: L('Faction'),
      [SORT_BY_COST]: L('Cost'),
      [SORT_BY_PACK]: L('Pack'),
      [SORT_BY_TITLE]: L('Title'),
      [SORT_BY_ENCOUNTER_SET]: L('Encounter Set'),
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
      hasEncounterCards,
    } = this.props;

    const sorts = [
      SORT_BY_TYPE,
      SORT_BY_FACTION,
      SORT_BY_COST,
      SORT_BY_PACK,
      SORT_BY_TITLE,
    ];
    if (hasEncounterCards || selectedSort === SORT_BY_ENCOUNTER_SET) {
      sorts.push(SORT_BY_ENCOUNTER_SET);
    }

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

export default connectRealm(CardSortDialog, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    if (!props.query) {
      return {
        hasEncounterCards: true,
      };
    }
    const encounterQuery = `(${props.query}) and (encounter_code != null or (linked_card != null && linked_card.encounter_code != null))`;
    return {
      hasEncounterCards: results.cards.filtered(encounterQuery, props.searchTerm).length > 0,
    };
  },
});
