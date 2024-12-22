import React, { useCallback, useContext } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { TouchableOpacity } from '@components/core/Touchables';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import { useSettingFlag } from '@components/core/hooks';

const SIZE = 36;

interface Props extends Record<string, unknown> {
  lightButton?: boolean;
}

function MapToggleButton({ lightButton }: Props) {
  const { colors } = useContext(StyleContext);
  const [mapList, setMapList] = useSettingFlag('map_list');
  const onPress = useCallback(() => setMapList(!mapList), [mapList, setMapList]);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.touchable}>
          <AppIcon name={mapList ? 'map' : 'list'} size={32} color={lightButton ? 'white' : colors.M} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

MapToggleButton.WIDTH = SIZE + (Platform.OS === 'android' ? 16 : 0);
MapToggleButton.HEIGHT = SIZE;

export default MapToggleButton;

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
});
