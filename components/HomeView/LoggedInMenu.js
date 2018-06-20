import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import withLoginGate from '../withLoginGate';
import MenuItem from './MenuItem';

function LoggedInMenu({ navigator }) {
  return (
    <View>
      <MenuItem
        navigator={navigator}
        text="My Decks"
        screen="My.Decks"
        icon="deck"
      />
    </View>
  );
}

LoggedInMenu.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default withLoginGate(LoggedInMenu);
