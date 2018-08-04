import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import ChaosTokenIcon from './ChaosTokenIcon';

export default function ChaosToken({ id, status }) {
  let color = '#eeeeee';
  switch (status) {
    case 'added': color = '#cfe3d0'; break;
    case 'removed': color = '#f5d6d7'; break;
  }
  return (
    <View style={[styles.button, { backgroundColor: color }]}>
      <ChaosTokenIcon id={id} size={28} />
    </View>
  );
}

ChaosToken.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['added', 'removed']),
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    marginRight: 8,
    height: 36,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
  },
});
