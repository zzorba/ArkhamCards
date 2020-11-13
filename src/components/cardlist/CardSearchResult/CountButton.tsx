import React, { useCallback, useContext, useRef } from 'react';
import {
  Animated,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from 'react-native';

import { rowHeight, buttonWidth, BUTTON_PADDING } from './constants';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import { useEffectUpdate } from '@components/core/hooks';

const DEPRESS_HEIGHT = 6;

interface Props {
  count: number;
  text?: string;
  selected?: boolean;
  onPress: (count: number) => void;
}

export default function CountButton({ count, text, selected, onPress }: Props) {
  const { fontScale, typography } = useContext(StyleContext);
  const anim = useRef(new Animated.Value(selected ? 1.0 : 0.0));
  useEffectUpdate(() => {
    anim.current.stopAnimation(() => {
      Animated.timing(anim.current, {
        toValue: selected ? 1 : 0,
        duration: selected ? 250 : 100,
        useNativeDriver: true,
      }).start();
    });
  }, [selected]);

  const handlePress = useCallback(() => {
    onPress(count);
  }, [onPress, count]);
  const translateY = anim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DEPRESS_HEIGHT],
    extrapolate: 'clamp',
  });
  return (
    <TouchableWithoutFeedback onPress={handlePress} delayPressIn={0}>
      <View style={[
        styles.container,
        {
          height: rowHeight(fontScale),
          width: buttonWidth(fontScale),
        },
      ]}>
        <View style={[styles.shadow, {
          height: rowHeight(fontScale) / 2,
          width: buttonWidth(fontScale),
        }]} />
        <Animated.View style={[
          styles.button,
          {
            height: rowHeight(fontScale) - DEPRESS_HEIGHT - 2 - 8,
            width: buttonWidth(fontScale),
            borderColor: selected ? '#1b526f' : '#5191b2',
            backgroundColor: selected ? '#22678b' : '#59a9d2',
            transform: [{ translateY: translateY }],
          },
        ]}>
          { !!text && (
            <Text style={[typography.text, styles.buttonText]}>
              { text }
            </Text>
          ) }
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: BUTTON_PADDING,
    position: 'relative',
  },
  button: {
    position: 'absolute',
    top: 4,
    left: 0,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  shadow: {
    backgroundColor: '#0e2c3c',
    borderRadius: 4,
    position: 'absolute',
    bottom: 4,
    left: 0,
  },
});
