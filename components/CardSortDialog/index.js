import React from 'react';
import PropTypes from 'prop-types';
import { connectRealm } from 'react-native-realm';

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
    navigator: PropTypes.object.isRequired,
    sortChanged: PropTypes.func.isRequired,
    selectedSort: PropTypes.string.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    query: PropTypes.string,
    hasEncounterCards: PropTypes.bool.isRequired,
  };

  render() {
    const {
      navigator,
      sortChanged,
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

    return (
      <DialogPicker
        navigator={navigator}
        options={sorts}
        onSelectionChanged={sortChanged}
        header="Sort by"
        selectedOption={selectedSort}
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
    return {
      hasEncounterCards: results.cards.filtered(`${props.query} and (encounter_code != null)`).length > 0,
    };
  },
});
