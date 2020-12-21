import React, { useContext, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';

interface Props<T> {
  icon?: string;
  text: string;
  value: T;
  onValueChange: (value: T) => void;
  selected: boolean;
  last: boolean;
}
export default function ItemPickerLine<T>({ icon, text, selected, last, value, onValueChange }: Props<T>) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  const onPress = useCallback(() => onValueChange(value), [onValueChange, value]);
  return (
    <View style={[styles.row, !last ? borderStyle : { borderBottomWidth: 0 }]}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.contentRow}>
          <View style={styles.leadRow}>
            { !!icon && (
              <View style={[styles.icon, space.marginRightS]}>
                <AppIcon name={icon} size={32} color={colors.M} />
              </View>
            ) }
            <Text style={typography.menuText}>
              { text }
            </Text>
          </View>
          <View style={[styles.circle, { borderColor: colors.L10 }]}>
            { !!selected && <View style={[styles.circleFill, { backgroundColor: colors.M }]} />}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
