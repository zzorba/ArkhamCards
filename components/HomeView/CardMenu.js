import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
} from 'react-native';

import BasicMenuItems from './BasicMenuItems';
import LoggedInMenu from './LoggedInMenu';

export default function CardMenu({ navigator }) {
  return (
    <ScrollView>
      <BasicMenuItems navigator={navigator} />
      <LoggedInMenu navigator={navigator} />
    </ScrollView>
  );
}

CardMenu.propTypes = {
  navigator: PropTypes.object.isRequired,
};
