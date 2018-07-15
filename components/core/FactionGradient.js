import React from 'react';
import PropTypes from 'prop-types';
import {
  ViewPropTypes,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { FACTION_LIGHT_GRADIENTS } from '../../constants';

export default function FactionGradient({ faction_code, style, children }) {
  return (
    <LinearGradient
      colors={FACTION_LIGHT_GRADIENTS[faction_code]}
      style={style}
    >
      { children }
    </LinearGradient>
  );
}

FactionGradient.propTypes = {
  faction_code: PropTypes.string.isRequired,
  children: PropTypes.node,
  style: ViewPropTypes.style,
};
