import React, { useContext } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Brackets } from 'typeorm/browser';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import { useFilterButton } from '../hooks';

const SIZE = 36;

interface Props {
  parentComponentId: string;
  filterId: string;
  lightButton?: boolean;
  baseQuery?: Brackets;
  modal?: boolean;
}

function TuneButton({ parentComponentId, filterId, lightButton, baseQuery, modal }: Props) {
  const { colors } = useContext(StyleContext);
  const [hasFilters, onPress] = useFilterButton({ componentId: parentComponentId, filterId, baseQuery, modal });
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.touchable}>
          <AppIcon name="filter" size={32} color={lightButton ? 'white' : colors.M} />
          { hasFilters && <View style={styles.chiclet} /> }
        </View>
      </TouchableOpacity>
    </View>
  );
}

TuneButton.WIDTH = SIZE + (Platform.OS === 'android' ? 16 : 0);
TuneButton.HEIGHT = SIZE;

export default TuneButton;

const EXTRA_ANDROID_WIDTH = (Platform.OS === 'android' ? 4 : 0);
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 8 : 0,
    marginRight: Platform.OS === 'android' ? 8 : 0,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
    position: 'relative',
  },
  touchable: {
    padding: 4,
    width: SIZE + EXTRA_ANDROID_WIDTH,
    height: SIZE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
