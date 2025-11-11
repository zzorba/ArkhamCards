import React, { useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Platform,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AnimatedArkhamIcon } from '@icons/ArkhamIcon';
import { toggleMythosMode } from '@components/filter/actions';
import { AppState, getMythosMode } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { useEffectUpdate } from '@components/core/hooks';

const SIZE = 32;

interface Props extends Record<string, unknown> {
  filterId: string;
}

const WIDTH = SIZE * 2 + 12;
const HEIGHT = SIZE + 4;

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
      color: interpolateColor(toggleAnim.value, [0, 0.25, 0.75, 1], [dark, dark, light, light]),
    };
  }, [dark, light]);
  const mythosStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(toggleAnim.value, [0, 0.25, 0.75, 1], [light, light, dark, dark]),
    };
  }, [light, dark]);
  const movingCircleX = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: interpolate(toggleAnim.value, [0, 1], [2, SIZE + 6]) }],
    };
  });
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={{ overflow: 'visible' }}>
        <View style={styles.buttonContainer}>
          <View style={[styles.buttonFrame, { borderColor: backgroundColor }]} />
          <Animated.View style={[
            styles.circle,
            { backgroundColor },
            movingCircleX,
          ]} />
          <View style={[styles.iconWrapper, { top: 2, left: 2 }]}>
            <Animated.Text style={investigatorStyle} allowFontScaling={false}>
              <AnimatedArkhamIcon
                name={'per_investigator'}
                size={24}
              />
            </Animated.Text>
          </View>
          <View style={[styles.iconWrapper, { top: 2, right: 2 }]}>
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

const PADDING = 2;
MythosButton.WIDTH = WIDTH + (PADDING * 2);
MythosButton.HEIGHT = HEIGHT + (PADDING * 2);

export default MythosButton;

const styles = StyleSheet.create({
  container: {
    width: WIDTH + (PADDING * 2),
    height: HEIGHT + (PADDING * 2),
    position: 'relative',
    marginLeft: 0,
    marginTop: Platform.OS === 'android' ? 8 : PADDING,
    marginRight: Platform.OS === 'android' ? 4 : PADDING,
    marginBottom: 8,
    padding: PADDING,
    overflow: 'visible',
  },
  iconWrapper: {
    width: SIZE,
    height: SIZE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    position: 'absolute',
  },
  circle: {
    borderRadius: SIZE / 2,
    width: SIZE,
    height: SIZE,
    position: 'absolute',
    top: 2,
  },
  buttonFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: (SIZE + 4) / 2,
    overflow: 'visible',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    width: SIZE * 2 + 4 * 2,
    height: SIZE + 2 * 2,
    overflow: 'visible',
  },
});
