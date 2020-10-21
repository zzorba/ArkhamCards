import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import React, { useContext, useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface Props {
  size: number;
}

const DURATION = 5000;
function Spinner({ value, size }: { size: number; value: Animated.Value }) {
  const { colors } = useContext(StyleContext);
  const spin = value.interpolate({
    inputRange: [0, 1],
    outputRange: ['120deg', '0deg'],
  });


  const scale = value.interpolate({
    inputRange: [0, 1],
    outputRange: [size / 3, size],
  });

  const color = value.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [colors.D30, colors.D30, colors.background],
  });
  const opacity = value.interpolate({
    inputRange: [0, 0.4, 0.95, 1],
    outputRange: [0, 0.2, 0.2, 0],
  });

  return (
    <Animated.View
      style={[styles.spinner, { transform: [{ rotate: spin }], width: size, height: size }]}
    >
      <View style={[styles.wrapper, { width: size, height: size }]}>
        <AnimatedAppIcon name="spinner" style={{ fontSize: scale, color, opacity }} />
      </View>
    </Animated.View>
  );
}

const AnimatedAppIcon = Animated.createAnimatedComponent(AppIcon);
export default function Loading({ size }: Props) {
  const [value0] = useState(new Animated.Value(0));
  const [value1] = useState(new Animated.Value(0));
  useEffect(() => {
    Animated.stagger(
      DURATION / 2,
      [
        Animated.loop(
          Animated.timing(value0, {
            toValue: 1.0,
            duration: DURATION,
            easing: Easing.linear,
            useNativeDriver: false,
          })
        ),
        Animated.loop(
          Animated.timing(value1, {
            toValue: 1.0,
            duration: DURATION,
            easing: Easing.linear,
            useNativeDriver: false,
          })
        ),
      ]
    ).start();
  }, []);

  return (
    <View style={[styles.outerWrapper, { width: size, height: size }]}>
      <Spinner size={size} value={value0} />
      <Spinner size={size} value={value1} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
