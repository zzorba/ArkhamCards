import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import withLoginGate from '../withLoginGate';
import MenuItem from './MenuItem';

const SHOW_CAMPAIGN_BUTTON = false;

function LoggedInMenu({ navigator }) {
  return (
    <View>
      <MenuItem
        navigator={navigator}
        text="My Decks"
        screen="My.Decks"
        icon="deck"
      />
      { SHOW_CAMPAIGN_BUTTON && (
        <MenuItem
          navigator={navigator}
          text="My Campaigns"
          screen="My.Campaigns"
          icon="book"
        />
      ) }
    </View>
  );
}

LoggedInMenu.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default withLoginGate(LoggedInMenu);
