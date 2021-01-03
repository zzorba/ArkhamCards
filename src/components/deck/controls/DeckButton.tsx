import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import space, { xs } from '@styles/space';
import COLORS from '@styles/colors';

interface Props {
  title: string;
  detail?: string;
  icon?: 'settings' | 'book' | 'arkhamdb' | 'plus-thin' | 'dismiss' | 'check-thin' | 'upgrade' | 'edit' | 'email' | 'login' | 'logo';
  color?: 'red' | 'gold' | 'gray';
  onPress?: () => void;
  rightMargin?: boolean;
  thin?: boolean;
  shrink?: boolean;
  loading?: boolean;
  bottomMargin?: number;
  topMargin?: number;
}

const ICON_SIZE = {
  settings: 26,
  book: 22,
  'arkhamdb': 24,
  'logo': 28,
  'login': 24,
  'email': 24,
  'edit': 24,
  'upgrade': 34,
  'plus-thin': 24,
  'dismiss': 18,
  'check-thin': 30,
};
const ICON_STYLE = {
  settings: {},
  book: {},
  'arkhamdb': {},
  'logo': {},
  'login': {},
  'email': {},
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

const MATERIAL_ICONS = new Set(['email', 'login']);

export default function DeckButton({ title, detail, icon, color = 'gray', onPress, rightMargin, topMargin, thin, shrink, loading, bottomMargin }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const backgroundColors = {
    red: colors.warn,
    gold: colors.upgrade,
    gray: colors.D10,
  };
  const rippleColor = {
    red: colors.faction.survivor.lightBackground,
    gold: colors.faction.dual.lightBackground,
    gray: colors.M,
  };
  const iconColor = {
    red: COLORS.white,
    gold: COLORS.D20,
    gray: colors.L10,
  };
  const textColor = {
    red: COLORS.white,
    gold: COLORS.D30,
    gray: colors.L30,
  };
  const theIconColor = iconColor[color];
  const iconContent = useMemo(() => {
    if (loading) {
      return <ActivityIndicator animating color={theIconColor} size="small" />;
    }
    if (!icon) {
      return null;
    }
    if (MATERIAL_ICONS.has(icon)) {
      return <MaterialIcons name={icon} size={ICON_SIZE[icon]} color={theIconColor} />;
    }
    return <AppIcon name={icon} size={ICON_SIZE[icon]} color={theIconColor} />;
  }, [loading, icon, theIconColor]);
  return (
    <Ripple
      style={[
        styles.button,
        { backgroundColor: backgroundColors[color], flex: shrink ? undefined : 1 },
        rightMargin ? space.marginRightS : undefined,
        bottomMargin ? { marginBottom: bottomMargin } : undefined,
        topMargin ? { marginTop: topMargin } : undefined,
      ]}
      onPress={onPress}
      rippleColor={rippleColor[color]}
    >
      <View style={[styles.row, space.paddingSideXs, space.paddingTopS, space.paddingBottomS]}>
        { !!icon && (
          <View style={[
            styles.icon,
            space.marginRightS,
            thin ? { marginLeft: xs, width: 24, height: 24 } : { width: 32, height: 32 },
            ICON_STYLE[icon],
          ]}>
            { iconContent }
          </View>
        ) }
        <View style={[styles.column, space.paddingRightS, !icon ? space.paddingLeftS : undefined]}>
          <Text style={[typography.large, { color: textColor[color] }]}>{ title }</Text>
          { !!detail && <Text style={[typography.smallLabel, typography.italic, { color: textColor[color] }]}>{ detail }</Text> }
        </View>
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
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
  },
});
