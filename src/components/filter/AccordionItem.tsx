import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
  const heightAnim = useRef(new Animated.Value(enabled ? 1 : 0));

  useEffect(() => {
    heightAnim.current.stopAnimation(() => {
      Animated.timing(heightAnim.current, {
        toValue: enabled ? 1 : 0,
        duration: 250,
        easing: enabled ? Easing.in(Easing.ease) : Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  }, [enabled]);

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
  const containerHeight = heightAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [COLLAPSED_HEIGHT, COLLAPSED_HEIGHT + height],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View style={[styles.container, borderStyle, { height: containerHeight }]}>
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
