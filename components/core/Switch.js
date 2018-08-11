import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  Switch,
} from 'react-native';

import { COLORS } from '../../styles/colors';

export default function CustomSwitch(props) {
  return (
    <Switch
      thumbTintColor={Platform.OS === 'android' ? COLORS.lightBlue : null}
      onTintColor="#222222"
      {...props}
    />
  );
}
