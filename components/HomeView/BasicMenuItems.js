import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import MenuItem from './MenuItem';
import { SORT_BY_ENCOUNTER_SET } from '../CardSortDialog/constants';

export default function BasicMenuItems({ navigator }) {
  return (
    <View>
      <MenuItem
        navigator={navigator}
        text="All Cards"
        screen="Browse.Cards"
        appIcon="cards"
      />
      <MenuItem
        navigator={navigator}
        text="Investigators"
        screen="Browse.Investigators"
        icon="per_investigator"
      />
      <MenuItem
        navigator={navigator}
        text="Player Cards"
        screen="Browse.Cards"
        icon="elder_sign"
        passProps={{
          baseQuery: '(type_code != \'investigator\' && spoiler != true && type_code != \'story\')',
        }}
      />
      <MenuItem
        navigator={navigator}
        text="Encounter Cards"
        screen="Browse.Cards"
        icon="auto_fail"
        passProps={{
          baseQuery: 'spoiler == true',
          sort: SORT_BY_ENCOUNTER_SET,
        }}
      />
      <MenuItem
        navigator={navigator}
        text="Weakness Sets"
        screen="Weakness.Chooser"
        icon="weakness"
      />
    </View>
  );
}

BasicMenuItems.propTypes = {
  navigator: PropTypes.object.isRequired,
};
