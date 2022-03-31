import React, { ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { t } from 'ttag';

import ToggleButton from '@components/core/ToggleButton';
import { isBig, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  label: string;
  height: number;
  children: ReactNode;
  enabled: boolean;
  toggleName: string;
  onToggleChange: (toggleName: string, enabled: boolean) => void;
}

export default function AccordionItem({ label, height, children, enabled, toggleName, onToggleChange }: Props) {
  const { fontScale, borderStyle, typography } = useContext(StyleContext);
  const heightAnim = useSharedValue(enabled ? 1 : 0);

  useEffect(() => {
    heightAnim.value = withTiming(
      enabled ? 1 : 0,
      {
        duration: 200,
        easing: enabled ? Easing.in(Easing.ease) : Easing.out(Easing.ease),
      }
    );
  }, [enabled, heightAnim]);

  const togglePressed = useCallback(() => {
    onToggleChange(toggleName, !enabled);
  }, [toggleName, onToggleChange, enabled]);

  const labelSection = useMemo(() => {
    return (
      <View style={styles.row}>
        <Text style={typography.text}>
          { label }
        </Text>
        <ToggleButton
          accessibilityLabel={t`Enable`}
          value={enabled}
          onPress={togglePressed}
          size={20}
          icon="expand"
        />
      </View>
    );
  }, [label, enabled, typography, togglePressed]);

  const COLLAPSED_HEIGHT = 22 + 18 * fontScale * (isBig ? 1.25 : 1.0);
  const containerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(heightAnim.value, [0, 1], [COLLAPSED_HEIGHT, COLLAPSED_HEIGHT + height]),
    };
  }, [height, COLLAPSED_HEIGHT]);
  return (
    <Animated.View style={[styles.container, borderStyle, containerStyle]}>
      { labelSection }
      { children }
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    paddingTop: xs,
    paddingBottom: xs,
    paddingLeft: s,
    paddingRight: s,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
