import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
} from 'react-native';

import MenuItem from './MenuItem';

export default function CardMenu({ navigator }) {
  return (
    <ScrollView>
      <MenuItem
        navigator={navigator}
        text="All Cards"
        screen="Browse.Cards"
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
          baseQuery: 'type_code != \'investigator\' && spoiler != true && type_code != \'story\'',
        }}
      />
      <MenuItem
        navigator={navigator}
        text="Encounter Cards"
        screen="Browse.Cards"
        icon="auto_fail"
        passProps={{
          baseQuery: 'spoiler == true',
        }}
      />
    </ScrollView>
  );
}

CardMenu.propTypes = {
  navigator: PropTypes.object.isRequired,
};
