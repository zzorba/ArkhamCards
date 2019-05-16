import React from 'react';
import { countBy, keys } from 'lodash';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import { FilterState } from '../../lib/filters';
import { COLORS } from '../../styles/colors';

interface Props {
  defaultFilters: FilterState;
  filters: FilterState;
  onPress: () => void;
  lightButton?: boolean;
}

const SIZE = 36;
export default function TuneButton({ defaultFilters, filters, onPress, lightButton }: Props) {
  const count = countBy(keys(defaultFilters), key => {
    return JSON.stringify(defaultFilters[key]) !== JSON.stringify(filters[key]);
  }).true || 0;
  const defaultColor = Platform.OS === 'ios' ? '#007AFF' : COLORS.button;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.touchable}>
          <MaterialIcons name="tune" size={28} color={lightButton ? 'white' : defaultColor} />
          { count > 0 && <View style={styles.chiclet} /> }
        </View>
      </TouchableOpacity>
    </View>
  );
}

const EXTRA_ANDROID_WIDTH = (Platform.OS === 'android' ? 8 : 0)
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 8 : 12,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
    position: 'relative',
  },
  touchable: {
    padding: 4,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
  },
  chiclet: {
    borderColor: 'white',
    borderWidth: 1,
    position: 'absolute',
    top: 1,
    right: 1 + EXTRA_ANDROID_WIDTH,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
