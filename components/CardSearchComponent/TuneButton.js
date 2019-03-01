import React from 'react';
import PropTypes from 'prop-types';
import { countBy, keys } from 'lodash';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { COLORS } from '../../styles/colors';

export default function TuneButton({ defaultFilters, filters, onPress, lightButton }) {
  const count = countBy(keys(defaultFilters), key => {
    return JSON.stringify(defaultFilters[key]) !== JSON.stringify(filters[key]);
  }).true || 0;
  const defaultColor = Platform.OS === 'ios' ? '#007AFF' : COLORS.button;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <MaterialIcons name="tune" size={28} color={lightButton ? 'white' : defaultColor} />
        { count > 0 && <View style={styles.chiclet} /> }
      </View>
    </TouchableOpacity>
  );
}

TuneButton.propTypes = {
  defaultFilters: PropTypes.object,
  filters: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  lightButton: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 16,
    marginRight: Platform.OS === 'android' ? 8 : undefined,
  },
  chiclet: {
    borderColor: 'white',
    borderWidth: 1,
    position: 'absolute',
    top: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
