import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
} from 'react-native';

import { SPECIAL_TOKENS } from '../../constants';
import ArkhamIcon from '../../assets/ArkhamIcon';

const SPECIAL_TOKENS_SET = new Set(SPECIAL_TOKENS);

export default function ChaosTokenIcon({ id, size, color = '#000' }) {
  if (SPECIAL_TOKENS_SET.has(id)) {
    return <ArkhamIcon name={id} size={size} color={color} />;
  }
  return <Text style={[styles.label, { fontSize: size, color: color }]} allowFontScaling={false}>{ id }</Text>;
}

ChaosTokenIcon.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  color: PropTypes.string,
};

const styles = StyleSheet.create({
  label: {
    fontSize: 28,
    fontFamily: 'System',
  },
});
