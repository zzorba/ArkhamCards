import React, { useRef, useContext, useMemo } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { FactionCodeType } from '@app_constants';
import { useEffectUpdate } from './hooks';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';

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
  const openAnim = useRef(new Animated.Value(open ? 1 : 0));
  useEffectUpdate(() => {
    Animated.timing(
      openAnim.current,
      {
        toValue: open ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.ease,
      }
    ).start();
  }, [open]);
  const iconRotate = openAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '-180deg'],
    extrapolate: 'clamp',
  });
  const icon = useMemo(() => {
    return !disabled && (
      <Animated.View style={{ width: 36, height: 36, transform: [{ rotate: iconRotate }] }}>
        <AppIcon name="expand_less" size={36} color={textColor || '#FFFFFF'} />
      </Animated.View>
    );
  }, [iconRotate, disabled, textColor]);

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
});
