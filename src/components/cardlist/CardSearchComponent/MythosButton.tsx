import React, { useCallback, useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Animated,
  StyleSheet,
  Pressable,
  Platform,
  View,
  Easing,
} from 'react-native';

import AppIcon from '@icons/AppIcon';
import { AnimatedArkhamIcon } from '@icons/ArkhamIcon';
import { toggleMythosMode } from '@components/filter/actions';
import { AppState, getMythosMode } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { useEffectUpdate } from '@components/core/hooks';
import { s } from '@styles/space';

const SIZE = 32;

interface Props {
  filterId: string;
}

const WIDTH = SIZE * 2 + 12;
const HEIGHT = SIZE;

function MythosButton({ filterId }: Props) {
  const { colors } = useContext(StyleContext);
  const mythosMode = useSelector((state: AppState) => getMythosMode(state, filterId));
  const toggleAnim = useRef(new Animated.Value(mythosMode ? 1 : 0));
  const colorAnim = useRef(new Animated.Value(mythosMode ? 1 : 0));
  const [mythosModeState, setMythosModeState] = useState(mythosMode);
  const dispatch = useDispatch();
  useEffectUpdate(() => {
    setMythosModeState(mythosMode);
  }, [mythosMode]);

  useEffectUpdate(() => {
    Animated.timing(
      toggleAnim.current,
      {
        toValue: mythosModeState ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.linear,
      }
    ).start();
    Animated.timing(
      colorAnim.current,
      {
        toValue: mythosModeState ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
        easing: Easing.linear,
      }
    ).start();
  }, [mythosModeState]);

  const onPress = useCallback(() => {
    const newState = !mythosModeState;
    dispatch(toggleMythosMode(filterId, newState));
    setMythosModeState(newState);
  }, [setMythosModeState, dispatch, mythosModeState, filterId]);
  const investigatorColor = colorAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.D30, colors.L10],
  });
  const mythosColor = colorAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.L10, colors.D30],
  });
  const movingCircleX = toggleAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SIZE + 2.5],
  });

  const backgroundColor = colors.L10;

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <View style={[styles.buttonContainer, { borderColor: backgroundColor }]}>
          <View style={styles.buttonFrame}>
            <AppIcon name="mythos_button_frame" size={SIZE + 5} color={backgroundColor} />
          </View>
          <Animated.View style={[
            styles.circle,
            {
              backgroundColor,
              transform: [{ translateX: movingCircleX }],
            },
          ]} />
          <View style={styles.iconWrapper}>
            <Animated.Text style={{ color: investigatorColor }} allowFontScaling={false}>
              <AnimatedArkhamIcon
                name={'per_investigator'}
                size={24}
              />
            </Animated.Text>
          </View>
          <View style={styles.iconWrapper}>
            <Animated.Text style={{ color: mythosColor }} allowFontScaling={false}>
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
