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

interface Props {
  setting: 'card_grid' | 'draft_grid';
  lightButton?: boolean;
}

function ListToggleButton({ lightButton, setting }: Props) {
  const { colors } = useContext(StyleContext);
  const [cardGrid, setCardGrid] = useSettingFlag(setting);
  const onPress = useCallback(() => setCardGrid(!cardGrid), [cardGrid, setCardGrid]);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.touchable}>
          <AppIcon name={cardGrid ? 'grid' : 'list'} size={32} color={lightButton ? 'white' : colors.M} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

ListToggleButton.WIDTH = SIZE + (Platform.OS === 'android' ? 16 : 0);
ListToggleButton.HEIGHT = SIZE;

export default ListToggleButton;

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
