import React, { useContext, useCallback, useMemo, ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';

interface Props<T> {
  iconName?: string;
  iconNode?: ReactNode;
  text: string;
  value: T;
  onValueChange: (value: T) => void;
  selected: boolean;
  last: boolean;
}
export default function ItemPickerLine<T>({ iconName, iconNode, text, selected, last, value, onValueChange }: Props<T>) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => onValueChange(value), [onValueChange, value]);
  const icon = useMemo(() => {
    if (iconNode) {
      return iconNode;
    }
    if (iconName) {
      return <AppIcon name={iconName} size={32} color={colors.M} />;
    }
    return null;
  }, [iconNode, iconName, colors]);
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.row, !last ? borderStyle : { borderBottomWidth: 0 }]}>
        <View style={styles.contentRow}>
          <View style={styles.leadRow}>
            { !!icon && (
              <View style={[styles.icon, space.marginRightS]}>
                { icon }
              </View>
            ) }
            <Text style={[typography.menuText, { textAlignVertical: 'center' }]}>
              { text }
            </Text>
          </View>
          <View style={[styles.circle, { borderColor: colors.L10 }]}>
            { !!selected && <View style={[styles.circleFill, { backgroundColor: colors.M }]} />}
          </View>
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
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
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
