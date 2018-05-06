import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import ChaosTokenIcon from './ChaosTokenIcon';

export default function ChaosToken({ id }) {
  return (
    <View style={styles.button}>
      <ChaosTokenIcon id={id} size={28} />
    </View>
  );
}

ChaosToken.propTypes = {
  id: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2e1c1',
    borderColor: '#000000',
    borderWidth: 1,
  },
});
