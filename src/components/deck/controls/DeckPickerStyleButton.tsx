import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  icon?: string | React.ReactNode;
  title: string;
  valueLabel: string | React.ReactNode;
  valueLabelDescription?: string;
  first?: boolean;
  last?: boolean;
  loading?: boolean;
  editable: boolean;
  onPress?: () => void;
  noLabelDivider?: boolean;
  editIcon?: string;
  theme?: 'light' | 'dark';
}

function iconSize(icon: string) {
  switch (icon) {
    case 'per_investigator':
      return 26;
    default:
      return 32;
  }
}

export default function DeckPickerStyleButton({
  icon,
  title,
  valueLabel,
  valueLabelDescription,
  first,
  last,
  loading,
  editable,
  onPress,
  noLabelDivider,
  editIcon = 'edit',
  theme = 'light',
}: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const iconNode = useMemo(() => {
    if (!icon) {
      return null;
    }
    if (typeof icon === 'string') {
      return (
        <View style={styles.icon}>
          { icon === 'per_investigator' ? (
            <ArkhamIcon name={icon} size={iconSize(icon)} color={colors.M} />
          ) : (
            <AppIcon name={icon} size={iconSize(icon)} color={colors.M} />
          ) }
        </View>
      );
    }
    return (
      <View style={styles.icon}>
        {icon}
      </View>
    );
  }, [icon, colors]);
  return (
    <Ripple
      onPress={onPress}
      disabled={!editable}
      style={[
        space.paddingSideS,
        space.paddingTopS,
        first ? styles.roundTop : undefined,
        last ? styles.roundBottom : undefined,
        { backgroundColor: theme === 'light' ? colors.L20 : colors.D20 },
      ]}
      rippleColor={theme === 'light' ? colors.L30 : colors.D10}
    >
      <View style={[styles.row, space.paddingBottomS, !last ? { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.L10 } : undefined]}>
        <View style={styles.leftRow}>
          { iconNode }
          <View style={styles.column}>
            <Text style={[typography.smallLabel, { color: theme === 'light' ? colors.D30 : colors.L30 }, typography.italic]}>
              { title }
            </Text>
            <View style={[styles.row, space.paddingTopXs]}>
              { typeof valueLabel === 'string' ? (
                <Text style={[typography.large, { color: theme === 'light' ? colors.D30 : colors.L30 }]}>
                  { valueLabel }
                </Text>
              ) : valueLabel }
              { !!valueLabelDescription && (
                <Text style={[typography.small, { color: colors.M, lineHeight: 16 * fontScale }]}>
                  { noLabelDivider ? `  ${valueLabelDescription}` : ` · ${valueLabelDescription}` }
                </Text>
              ) }
            </View>
          </View>
        </View>
        { (!!editable || !!loading) && (
          <View style={styles.editIcon}>
            { !!editable && <AppIcon name={editIcon} size={32} color={colors.M} /> }
            { !!loading && <ActivityIndicator size="small" animating color={colors.M} /> }
          </View>
        ) }
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    width: 32,
    height: 32,
    marginLeft: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundTop: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  roundBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
