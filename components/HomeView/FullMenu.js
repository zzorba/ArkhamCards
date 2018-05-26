import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
} from 'react-native';

import MenuItem from './MenuItem';

export default function FullMenu({ navigator }) {
  return (
    <ScrollView>
      <MenuItem navigator={navigator} text="Popular Decks" screen="Browse.Decks" />
      <MenuItem navigator={navigator} text="Investigators" screen="Browse.Investigators" />
      <MenuItem navigator={navigator} text="All Cards" screen="Browse.Cards" />
      <MenuItem navigator={navigator} text="My Campaigns" screen="My.Campaigns" />
      <MenuItem navigator={navigator} text="My Decks" screen="My.Decks" />
    </ScrollView>
  );
}

FullMenu.propTypes = {
  navigator: PropTypes.object.isRequired,
};
