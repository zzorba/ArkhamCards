import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';

interface Props {
  title: string;
  description?: string;
  icon: string;
  control: React.ReactNode;
  last?: boolean;
  loading?: boolean;
}

function iconSize(icon: string) {
  switch (icon) {
    case 'world':
    case 'sort-by-alpha':
      return 30;
    case 'elder_sign':
    case 'copy':
      return 26;
    case 'sort':
      return 18;
    default:
      return 34;
  }
}
export default function DeckActionRow({ title, description, icon, last, control, loading }: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  return (
    <View style={[styles.wrapper, space.paddingRightS, { paddingTop: xs + s, paddingBottom: xs + s }, borderStyle, !last ? styles.border : undefined]}>
      <View style={[space.marginRightXs, styles.leftRow]}>
        <View style={styles.icon}>
          <AppIcon name={icon} size={iconSize(icon)} color={colors.M} />
        </View>
        <View style={styles.column}>
          { !!description && <Text style={[typography.smallLabel, typography.italic, typography.dark]}>{ description }</Text> }
          <View style={styles.row}>
            <Text style={[typography.large]}>
              { title }
            </Text>
          </View>
        </View>
      </View>
      { loading ? <ActivityIndicator color={colors.lightText} size="small" animating /> : <View style={styles.control}>{control}</View> }
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    maxWidth: 100,
    flex: 1,
  },
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

