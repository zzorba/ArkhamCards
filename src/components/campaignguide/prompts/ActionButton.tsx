import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import space from '@styles/space';
import { ThemeColors } from '@styles/theme';
import LanguageContext from '@lib/i18n/LanguageContext';

type LEFT_ICON = 'plus-button' | 'check' | 'close' | 'undo' | 'shuffle' | 'deck' | 'edit';
interface Props {
  color: 'dark' | 'light' | 'green' | 'red';
  onPress: () => void;
  leftIcon?: LEFT_ICON;
  rightIcon?: 'right-arrow';
  title: string;
  disabled?: boolean;
  loading?: boolean;
  shrinkText?: boolean;
}

function getBackgroundColor(color: 'dark' | 'light' | 'green' | 'red', colors: ThemeColors): string {
  switch (color) {
    case 'dark': return colors.D10;
    case 'light': return colors.L15;
    case 'green': return colors.campaign.text.setup;
    case 'red': return colors.campaign.text.resolution;
  }
}


function getRippleColor(color: 'dark' | 'light' | 'green' | 'red', colors: ThemeColors): string {
  switch (color) {
    case 'dark': return colors.M;
    case 'light': return colors.L30;
    case 'green': return colors.faction.rogue.lightBackground;
    case 'red': return colors.faction.survivor.lightBackground;
  }
}

const LEFT_ICON_SIZE = {
  edit: 24,
  shuffle: 24,
  deck: 24,
  undo: 24,
  'plus-button': 24,
  check: 16,
  close: 24,
};

export default function ActionButton({ color, loading, onPress, title, leftIcon, rightIcon, disabled, shrinkText }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const enabledColor = color === 'light' ? colors.D20 : colors.L30;
  const textColor = disabled ? colors.D10 : enabledColor;

  const leftIconContent = useMemo(() => {
    if (!leftIcon) {
      return null;
    }
    if (loading) {
      return (
        <View>
          <ActivityIndicator animating color={textColor} size="small" />
        </View>
      );
    }
    return (
      <View style={{ width: 24 }}>
        { leftIcon === 'shuffle' ? (
          <MaterialCommunityIcons
            name="shuffle-variant"
            size={24}
            color={textColor}
          />
        ) : (
          <AppIcon size={LEFT_ICON_SIZE[leftIcon]} name={leftIcon} color={textColor} />
        ) }
      </View>
    );
  }, [leftIcon, loading, textColor]);
  const hideText = (lang === 'de' && leftIcon === 'undo');
  const content = useMemo(() => {
    return (
      <View style={styles.button}>
        { leftIconContent}
        { !hideText && (
          <Text numberOfLines={2} style={[
            leftIcon ? space.marginLeftS : undefined,
            space.paddingTopXs,
            typography.cardName,
            { color: textColor, flexShrink: 1 },
            { textAlignVertical: 'center' },
          ]} adjustsFontSizeToFit={shrinkText}>
            { title }
          </Text>
        ) }
        { rightIcon && <View style={space.paddingLeftS}><AppIcon size={28} name={rightIcon} color={textColor} /></View> }
      </View>
    );
  }, [leftIconContent, rightIcon, textColor, typography, title, hideText, leftIcon, shrinkText]);
  const rightPadding = hideText ? 12 : 20;
  if (disabled) {
    return (
      <View style={[
        styles.button,
        {
          backgroundColor: colors.L20,
          borderColor: color === 'green' ? colors.faction.rogue.lightBackground : colors.D10,
          borderWidth: 1,
          borderRadius: 24,
          borderStyle: color === 'green' ? 'solid' : 'dashed',
          height: 40,
          paddingLeft: leftIcon ? 12 : 20,
          paddingRight: rightIcon ? 8 : rightPadding,
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
          paddingRight: rightIcon ? 8 : rightPadding,
        },
      ]}
      onPress={onPress}
      rippleColor={getRippleColor(color, colors)}
      rippleSize={48}
      accessibilityLabel={title}
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