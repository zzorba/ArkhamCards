import React, { useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Pressable,
  Platform,
  View,
} from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import AppIcon from '@icons/AppIcon';
import { AnimatedArkhamIcon } from '@icons/ArkhamIcon';
import { toggleMythosMode } from '@components/filter/actions';
import { AppState, getMythosMode } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { useEffectUpdate } from '@components/core/hooks';
import { s } from '@styles/space';

const SIZE = 32;

interface Props extends Record<string, unknown> {
  filterId: string;
}

const WIDTH = SIZE * 2 + 12;
const HEIGHT = SIZE;

function MythosButton({ filterId }: Props) {
  const { colors } = useContext(StyleContext);
  const mythosMode = useSelector((state: AppState) => getMythosMode(state, filterId));
  const toggleAnim = useSharedValue(mythosMode ? 1 : 0);
  const [mythosModeState, setMythosModeState] = useState(mythosMode);
  const dispatch = useDispatch();
  useEffectUpdate(() => {
    setMythosModeState(mythosMode);
  }, [mythosMode]);

  useEffectUpdate(() => {
    toggleAnim.value = withTiming(mythosModeState ? 1 : 0, { duration: 250 });
  }, [mythosModeState]);

  const onPress = useCallback(() => {
    const newState = !mythosModeState;
    setMythosModeState(newState);
    setTimeout(() => dispatch(toggleMythosMode(filterId, newState)), 20);
  }, [setMythosModeState, dispatch, mythosModeState, filterId]);

  const dark = colors.D30;
  const light = colors.L10;
  const backgroundColor = colors.L10;

  const investigatorStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(toggleAnim.value, [0,0.25,0.75, 1], [dark, dark, light, light]) as string,
    };
  }, [dark, light]);
  const mythosStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(toggleAnim.value, [0,0.25,0.75, 1], [light, light, dark, dark]) as string,
    };
  }, [light, dark]);
  const movingCircleX = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: interpolate(toggleAnim.value, [0, 1], [0, SIZE + 2.5]) }],
    };
  });
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <View style={[styles.buttonContainer, { borderColor: backgroundColor }]}>
          <View style={styles.buttonFrame}>
            <AppIcon name="mythos_button_frame" size={SIZE + 5} color={backgroundColor} />
          </View>
          <Animated.View style={[
            styles.circle,
            { backgroundColor },
            movingCircleX,
          ]} />
          <View style={styles.iconWrapper}>
            <Animated.Text style={investigatorStyle} allowFontScaling={false}>
              <AnimatedArkhamIcon
                name={'per_investigator'}
                size={24}
              />
            </Animated.Text>
          </View>
          <View style={styles.iconWrapper}>
            <Animated.Text style={mythosStyle} allowFontScaling={false}>
              <AnimatedArkhamIcon
                name={'auto_fail'}
                size={24}
              />
            </Animated.Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const LEFT_MARGIN = Platform.OS === 'android' ? s : 0;
MythosButton.WIDTH = WIDTH + LEFT_MARGIN;
MythosButton.HEIGHT = HEIGHT;

export default MythosButton;

const styles = StyleSheet.create({
  container: {
    width: MythosButton.WIDTH,
    height: MythosButton.HEIGHT,
    marginLeft: LEFT_MARGIN,
    paddingLeft: 2,
    paddingTop: 2,
    position: 'relative',
    marginBottom: 8,
  },
  iconWrapper: {
    width: SIZE,
    height: SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:  0,
  },
  circle: {
    borderRadius: SIZE / 2,
    width: SIZE,
    height: SIZE,
    position: 'absolute',
    top: 1,
    left: 1,
  },
  buttonFrame: {
    position: 'absolute',
    top: -2,
    left: -2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    width: SIZE * 2 + 5,
    height: SIZE + 4,
    paddingTop: 1,
    paddingLeft: 1,
    paddingRight: 1,
  },
});
