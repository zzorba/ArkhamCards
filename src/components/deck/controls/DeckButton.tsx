import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import AppIcon from '@icons/AppIcon';
import space, { s, xs } from '@styles/space';
import COLORS from '@styles/colors';
import ArkhamIcon from '@icons/ArkhamIcon';
import EncounterIcon from '@icons/EncounterIcon';

export type DeckButtonIcon =
  'headset' |
  'discord' |
  'vk' |
  'telegram' |
  'faq' |
  'trauma' |
  'backup' |
  'seal' |
  'lock' |
  'log' |
  'finish' |
  'wrench' |
  'plus-button' |
  'minus-button' |
  'right-arrow' |
  'weakness' |
  'card-outline' |
  'world' |
  'deck' |
  'draw' |
  'tdea' |
  'tdeb' |
  'tools' |
  'difficulty' |
  'chaos_bag' |
  'chart' |
  'elder_sign' |
  'delete' |
  'per_investigator' |
  'settings' |
  'book' |
  'arkhamdb' |
  'plus-thin' |
  'dismiss' |
  'check-thin' |
  'upgrade' |
  'edit' |
  'email' |
  'login' |
  'logo';

interface Props {
  title: string;
  detail?: string;
  icon?: DeckButtonIcon;
  encounterIcon?: string;
  color?: 'red' | 'red_outline' | 'gold' | 'default' | 'dark_gray' | 'light_gray';
  onPress?: () => void;
  rightMargin?: number;
  thin?: boolean;
  shrink?: boolean;
  loading?: boolean;
  bottomMargin?: number;
  leftMargin?: number;
  topMargin?: number;
  disabled?: boolean;
  noShadow?: boolean;
  bigEncounterIcon?: boolean;
  rightNode?: React.ReactNode;
}

const ICON_SIZE: { [icon: string]: number | undefined } = {
  faq: 24,
  trauma: 32,
  backup: 24,
  'plus-button': 32,
  'minus-button': 32,
  'right-arrow': 32,
  'plus-thin': 24,
  'check-thin': 30,
  weakness: 24,
  'card-outline': 24,
  tdea: 28,
  tdeb: 28,
  book: 22,
  draw: 24,
  arkhamdb: 24,
  logo: 28,
  login: 24,
  email: 24,
  edit: 24,
  upgrade: 34,
  dismiss: 22,
};
const ICON_SIZE_THIN: { [icon: string]: number | undefined } = {
  upgrade: 26,
};

const ICON_STYLE: { [icon: string]: ViewStyle | undefined } = {
  'check-thin': {
    marginTop: -2,
  },
  upgrade: {
    marginTop: 0,
  },
};

const MATERIAL_ICONS = new Set(['email', 'delete', 'login', 'backup', 'headset']);
const ARKHAM_ICONS = new Set(['per_investigator', 'faq', 'elder_sign', 'weakness']);
const ENCOUNTER_ICONS = new Set(['tdea', 'tdeb']);
export default function DeckButton({
  disabled,
  title,
  detail,
  encounterIcon,
  bigEncounterIcon,
  icon,
  color = 'default',
  onPress,
  leftMargin,
  rightMargin,
  topMargin,
  thin,
  shrink,
  loading,
  bottomMargin,
  noShadow,
  rightNode,
}: Props) {
  const { colors, fontScale, typography, shadow } = useContext(StyleContext);
  const backgroundColors = {
    red_outline: colors.D30,
    red: colors.warn,
    gold: colors.upgrade,
    default: colors.D10,
    light_gray: colors.L20,
    dark_gray: colors.L10,
  };
  const rippleColor = {
    red_outline: colors.D10,
    red: colors.faction.survivor.lightBackground,
    gold: colors.faction.dual.lightBackground,
    default: colors.M,
    light_gray: colors.L30,
    dark_gray: colors.L20,
  };
  const iconColor = {
    red_outline: colors.warn,
    red: COLORS.white,
    gold: COLORS.D20,
    default: colors.L10,
    light_gray: colors.M,
    dark_gray: colors.D10,
  };
  const textColor = {
    red_outline: colors.L30,
    red: COLORS.L30,
    gold: COLORS.D30,
    default: colors.L30,
    light_gray: colors.D20,
    dark_gray: colors.D20,
  };
  const detailTextColor = {
    red_outline: colors.L30,
    red: COLORS.L30,
    gold: COLORS.D30,
    default: colors.L30,
    light_gray: colors.D10,
    dark_gray: colors.D10,
  };
  const disabledTextColor = {
    red_outline: colors.L10,
    red: COLORS.L30,
    gold: COLORS.D10,
    default: colors.L10,
    light_gray: colors.D10,
    dark_gray: colors.D10,
  };
  const theIconColor = iconColor[color];
  const iconContent = useMemo(() => {
    if (loading) {
      return <ActivityIndicator animating color={theIconColor} size="small" />;
    }
    if (encounterIcon) {
      return <EncounterIcon encounter_code={encounterIcon} size={bigEncounterIcon ? 32 : 26} color={theIconColor} />;
    }
    if (!icon) {
      return null;
    }
    const size = (thin ? ICON_SIZE_THIN[icon] : undefined) || ICON_SIZE[icon] || 26;
    if (MATERIAL_ICONS.has(icon)) {
      return <MaterialIcons name={icon} size={size} color={theIconColor} />;
    }
    if (ARKHAM_ICONS.has(icon)) {
      return <ArkhamIcon name={icon === 'faq' ? 'wild' : icon} size={size} color={theIconColor} />;
    }
    if (ENCOUNTER_ICONS.has(icon)) {
      return <EncounterIcon encounter_code={icon} size={size} color={theIconColor} />;
    }
    return <AppIcon name={icon} size={size} color={theIconColor} />;
  }, [loading, icon, thin, encounterIcon, bigEncounterIcon, theIconColor]);
  const topTextHeight = 22 * Math.max(1.0, fontScale);
  const textHeight = (detail ? 10 : 0) * Math.max(1.0, fontScale) + topTextHeight;
  const height = textHeight + s * 2 + xs * 2;
  return (
    <Ripple
      disabled={disabled}
      style={[
        {
          minHeight: height,
          borderRadius: color === 'dark_gray' || color === 'light_gray' ? 8 : 4,
          backgroundColor: backgroundColors[color],
        },
        color === 'dark_gray' && !noShadow ? shadow.large : undefined,
        shrink ? undefined : styles.grow,
        leftMargin ? { marginLeft: leftMargin } : undefined,
        rightMargin ? { marginRight: rightMargin } : undefined,
        bottomMargin ? { marginBottom: bottomMargin } : undefined,
        topMargin ? { marginTop: topMargin } : undefined,
      ]}
      onPress={onPress}
      rippleColor={rippleColor[color]}
    >
      <View style={[
        styles.row,
        icon ? { justifyContent: 'flex-start' } : { justifyContent: 'center' },
        space.paddingSideXs,
        space.paddingTopS,
        space.paddingBottomS,
      ]}>
        { !!iconContent && (
          <View style={[
            styles.icon,
            space.marginLeftXs,
            bigEncounterIcon ? {} : space.marginRightS,
            thin ? { marginLeft: xs, width: 28, height: 32 * fontScale } : { width: 32, height: 32 * fontScale },
            loading || !icon ? undefined : ICON_STYLE[icon],
          ]}>
            { iconContent }
          </View>
        ) }
        <View style={[styles.column, space.paddingRightS, !icon ? space.paddingLeftS : undefined, shrink ? undefined : styles.grow, space.paddingTopXs]}>
          <View style={styles.row}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              style={[
                { textAlignVertical: 'center' },
                detail ? typography.large : typography.cardName,
                { minHeight: topTextHeight, color: disabled ? disabledTextColor[color] : textColor[color] },
              ]}
            >
              { title }
            </Text>
          </View>
          { !!detail && (
            <Text style={[typography.smallButtonLabel, { marginTop: 1, color: detailTextColor[color] }]} numberOfLines={2}>
              { detail }
            </Text>
          ) }
        </View>
        { !!rightNode && rightNode }
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  grow: {
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
  },
});
