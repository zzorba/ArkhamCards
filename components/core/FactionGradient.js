import React from 'react';
import PropTypes from 'prop-types';
import {
  ViewPropTypes,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FACTION_DARK_GRADIENTS, FACTION_LIGHT_GRADIENTS } from '../../constants';

export default function FactionGradient({ faction_code, style, children, dark }) {
  const colors = dark ?
    FACTION_DARK_GRADIENTS[faction_code] :
    FACTION_LIGHT_GRADIENTS[faction_code];
  return (
    <LinearGradient colors={colors} style={style}>
      { children }
    </LinearGradient>
  );
}

FactionGradient.propTypes = {
  faction_code: PropTypes.string.isRequired,
  children: PropTypes.node,
  style: ViewPropTypes.style,
  dark: PropTypes.bool,
};
