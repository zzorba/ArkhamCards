import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ArkhamSwitch from '@components/core/ArkhamSwitch';
import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';

interface Props {
  title: string;
  icon: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  last?: boolean;
}

function iconSize(icon: string) {
  switch (icon) {
    case 'world':
      return 30;
    default:
      return 34;
  }
}
export default function DeckCheckboxButton({ title, icon, value, onValueChange, disabled, last }: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  return (
    <View style={[styles.wrapper, space.paddingRightS, { paddingTop: xs + s, paddingBottom: xs + s }, borderStyle, !last ? styles.border : undefined]}>
      <View style={styles.leftRow}>
        <View style={styles.icon}>
          <AppIcon name={icon} size={iconSize(icon)} color={colors.M} />
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={[typography.large]}>
              { title }
            </Text>
          </View>
        </View>
      </View>
      <ArkhamSwitch value={value} onValueChange={onValueChange} disabled={disabled} />
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
