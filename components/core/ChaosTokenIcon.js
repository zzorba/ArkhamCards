import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
} from 'react-native';

import { SPECIAL_TOKENS } from '../../constants';
import ArkhamIcon from '../../assets/ArkhamIcon';

const SPECIAL_TOKENS_SET = new Set(SPECIAL_TOKENS);

export default function ChaosTokenIcon({ id, size }) {
  if (SPECIAL_TOKENS_SET.has(id)) {
    return <ArkhamIcon name={id} size={size} color="#000000" />;
  }
  return <Text style={[styles.label, { fontSize: size }]}>{ id }</Text>;
}

ChaosTokenIcon.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  label: {
    fontSize: 28,
  },
});
