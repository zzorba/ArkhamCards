import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import space from '@styles/space';
import { ThemeColors } from '@styles/theme';

type LEFT_ICON = 'plus-thin' | 'check' | 'close' | 'undo';
interface Props {
  color: 'dark' | 'light' | 'green' | 'red';
  onPress: () => void;
  leftIcon?: LEFT_ICON;
  rightIcon?: 'right-arrow';
  title: string;
  disabled?: boolean;
}

function getBackgroundColor(color: 'dark' | 'light' | 'green' | 'red', colors: ThemeColors): string {
  switch (color) {
    case 'dark': return colors.D10;
    case 'light': return colors.L15;
    case 'green': return colors.campaign.setup;
    case 'red': return colors.campaign.resolution;
  }
}

const LEFT_ICON_SIZE = {
  'undo': 24,
  'plus-thin': 18,
  'check': 16,
  'close': 24,
};

export default function ActionButton({ color, onPress, title, leftIcon, rightIcon, disabled }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const content = useMemo(() => {
    const enabledColor = color === 'light' ? colors.D20 : colors.L30;
    const textColor = disabled ? colors.D10 : enabledColor;
    return (
      <View style={styles.button}>
        { leftIcon && <View style={space.paddingRightS}><AppIcon size={LEFT_ICON_SIZE[leftIcon]} name={leftIcon} color={textColor} /></View> }
        <Text style={[space.paddingTopXs, typography.cardName, { color: textColor }]}>
          { title }
        </Text>
        { rightIcon && <View style={space.paddingLeftS}><AppIcon size={28} name={rightIcon} color={textColor} /></View> }
      </View>
    );
  }, [leftIcon, rightIcon, disabled, color, colors, typography, title]);
  if (disabled) {
    return (
      <View style={[
        styles.button,
        {
          backgroundColor: colors.L20,
          borderColor: colors.D10,
          borderWidth: 1,
          borderRadius: 24,
          borderStyle: 'dashed',
          height: 40,
          paddingLeft: leftIcon ? 12 : 20,
          paddingRight: rightIcon ? 8 : 20,
        },
      ]}>
        { content }
      </View>
    );
  }
  return (
    <Ripple
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(color, colors),
          height: 40,
          borderRadius: 24,
          paddingLeft: leftIcon ? 12 : 20,
          paddingRight: rightIcon ? 8 : 20,
        },
      ]}
      onPress={onPress}
      rippleColor={colors.M}
      rippleSize={48}
    >
      { content }
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});