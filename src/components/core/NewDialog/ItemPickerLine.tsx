import React, { useContext, useCallback, useMemo, ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import ArkhamSwitch from '../ArkhamSwitch';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props<T> {
  iconName?: string;
  iconNode?: ReactNode;
  rightNode?: ReactNode;
  text: string;
  disabled?: boolean;
  description?: string;
  value: T;
  onValueChange: (value: T) => void;
  selected: boolean;
  last: boolean;
  indicator?: 'check' | 'radio'
}
const ARKHAM_ICONS = new Set(['weakness', 'wild']);
export default function ItemPickerLine<T>({ iconName, iconNode, disabled, text, description, rightNode, selected, last, value, indicator = 'radio', onValueChange }: Props<T>) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    onValueChange(value);
  }, [onValueChange, value]);
  const icon = useMemo(() => {
    if (iconNode) {
      return iconNode;
    }
    if (iconName) {
      if (ARKHAM_ICONS.has(iconName)) {
        return <ArkhamIcon name={iconName} size={32} color={colors.M} />;
      }
      return <AppIcon name={iconName} size={32} color={colors.M} />;
    }
    return null;
  }, [iconNode, iconName, colors]);
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={[styles.row, !last ? borderStyle : { borderBottomWidth: 0 }]}>
        <View style={styles.contentRow}>
          <View style={styles.leadRow}>
            { !!icon && (
              <View style={[styles.icon, space.marginRightS]}>
                { !disabled && icon }
              </View>
            ) }
            { description ? (
              <View style={styles.column}>
                <Text style={[typography.menuText, { textAlignVertical: 'center', flex: 1 }]}>
                  { text }
                </Text>
                <Text style={[typography.cardTraits, { flex: 1 }]} numberOfLines={2} ellipsizeMode="clip">
                  { description }
                </Text>
              </View>
            ) : (
              <Text style={[typography.menuText, { textAlignVertical: 'center', flex: 1 }]}>
                { text }
              </Text>
            ) }
          </View>
          { !!rightNode && rightNode }
          { indicator === 'radio' ? (
            <View style={[styles.circle, { borderColor: disabled ? colors.L20 : colors.L10 }]}>
              { !!selected && <View style={[styles.circleFill, { backgroundColor: colors.M }]} />}
            </View>
          ) : (
            <ArkhamSwitch value={selected} color="dark" />
          ) }
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: s,
    marginRight: s,
    paddingTop: s,
    paddingBottom: s,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  icon: {
    minWidth: 32,
    minHeight: 32,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
  },
  circleFill: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
