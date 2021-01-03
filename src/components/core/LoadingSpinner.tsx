import AppIcon from '@icons/AppIcon';
import { m } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import React, { useContext, useEffect, useState } from 'react';
import { Animated, ActivityIndicator, Easing, StyleSheet, View } from 'react-native';

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
export function NewLoading({ size }: Props) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.outerWrapper, { width: size, height: size }]}>
      <Spinner size={size} value={value0} />
      <Spinner size={size} value={value1} />
    </View>
  );
}

export default function LoadingSpinner({ large, inline }: { large?: boolean, inline?: boolean }) {
  const { backgroundStyle, colors } = useContext(StyleContext);
  if (inline) {
    return (
      <View style={styles.inline}>
        <ActivityIndicator size={large ? 'large' : 'small'} color={colors.lightText} animating />
      </View>
    );
  }
  return (
    <View style={[styles.loading, backgroundStyle]}>
      <ActivityIndicator size={large ? 'large' : 'small'} color={colors.lightText} animating />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  inline: {
    padding: m,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
