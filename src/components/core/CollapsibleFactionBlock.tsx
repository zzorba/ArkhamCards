import React, { useContext, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Collapsible from 'react-native-collapsible';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { FactionCodeType } from '@app_constants';
import { useEffectUpdate } from './hooks';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';

function degToRad(deg: number): string {
  return `${((deg * Math.PI) / 180)}rad`;
}

interface Props {
  open?: boolean;
  color?: string;
  children?: React.ReactNode;
  renderHeader: (toggle: React.ReactFragment) => React.ReactFragment;
  toggleOpen?: () => void;
  disabled?: boolean;
  textColor?: string;
  faction?: FactionCodeType;
  noShadow?: boolean;
}
export default function CollapsibleFactionBlock({ faction, textColor, noShadow, color, renderHeader, children, toggleOpen, open, disabled }: Props) {
  const { colors, shadow } = useContext(StyleContext);
  const openAnim = useSharedValue(open ? degToRad(-180) : degToRad(-90));
  useEffectUpdate(() => {
    openAnim.value = withTiming(open ? degToRad(-180) : degToRad(-90), { duration: 200, easing: Easing.ease });
  }, [open]);
  const iconRotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: openAnim.value }],
    };
  });
  const icon = useMemo(() => {
    return !disabled && (
      <Animated.View style={[styles.icon, iconRotateStyle]}>
        <AppIcon name="expand_less" size={36} color={textColor || '#FFFFFF'} />
      </Animated.View>
    );
  }, [iconRotateStyle, disabled, textColor]);

  return (
    <>
      { disabled ? renderHeader(icon) : (
        <TouchableWithoutFeedback onPress={toggleOpen}>
          { renderHeader(icon) }
        </TouchableWithoutFeedback>
      ) }
      <Collapsible collapsed={!open}>
        <View style={[
          styles.block,
          noShadow ? undefined : shadow.large,
          {
            borderColor: color || (faction ? colors.faction[faction].background : colors.M),
            backgroundColor: colors.background,
          },
        ]}>
          { children }
        </View>
      </Collapsible>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  icon: {
    width: 36,
    height: 36,
  },
});
