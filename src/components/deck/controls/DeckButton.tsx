import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import space, { xs } from '@styles/space';

interface Props {
  title: string;
  detail?: string;
  icon: 'plus-thin' | 'dismiss' | 'check-thin' | 'upgrade' | 'edit';
  color?: 'red' | 'gold';
  onPress?: () => void;
  rightMargin?: boolean;
  thin?: boolean;
}

const ICON_SIZE = {
  'edit': 24,
  'upgrade': 34,
  'plus-thin': 24,
  'dismiss': 18,
  'check-thin': 30,
};
const ICON_STYLE = {
  'check-thin': {
    marginTop: -6,
  },
  'edit': {},
  'upgrade': {
    marginTop: 0,
  },
  'dismiss': {},
  'plus-thin': {},
};


export default function DeckButton({ title, detail, icon, color, onPress, rightMargin, thin }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const backgroundColors = {
    red: colors.warn,
    gold: colors.upgrade,
  };
  const rippleColor = {
    red: colors.faction.survivor.lightBackground,
    gold: colors.faction.dual.lightBackground,
  };
  return (
    <Ripple style={[
      styles.button,
      { backgroundColor: color ? backgroundColors[color] : colors.D10 },
      rightMargin ? space.marginRightS : undefined,
    ]} onPress={onPress} rippleColor={color ? rippleColor[color] : colors.M}>
      <View style={[styles.row, space.paddingSideXs, space.paddingTopS, space.paddingBottomS]}>
        <View style={[
          styles.icon,
          space.marginRightS,
          thin ? { marginLeft: xs, width: 24, height: 24 } : { width: 32, height: 32 },
          ICON_STYLE[icon],
        ]}>
          <AppIcon name={icon} size={ICON_SIZE[icon]} color={!color ? colors.L10 : colors.L30} />
        </View>
        <View style={styles.column}>
          <Text style={[typography.large, color === 'gold' ? undefined : typography.inverted]}>{ title }</Text>
          { !!detail && <Text style={[typography.smallLabel, typography.italic, color === 'gold' ? typography.dark : typography.inverted]}>{ detail }</Text> }
        </View>
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
});
