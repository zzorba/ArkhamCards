import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space, { s, xs } from '@styles/space';

interface Props {
  title: string;
  description?: string;
  icon: string | React.ReactNode;
  control: React.ReactNode;
  last?: boolean;
  loading?: boolean;
  growControl?: boolean;
  titleFirst?: boolean;
}

function iconSize(icon: string) {
  switch (icon) {
    case 'world':
    case 'sort-by-alpha':
    case 'mythos-busters':
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
export default function DeckActionRow({ title, titleFirst, description, icon, last, control, loading, growControl }: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
  return (
    <View style={[styles.wrapper, space.paddingRightS, { paddingTop: xs + s, paddingBottom: xs + s }, borderStyle, !last ? styles.border : undefined]}>
      <View style={[space.marginRightXs, styles.leftRow]}>
        <View style={styles.icon}>
          { typeof icon === 'string' ? (
            <AppIcon name={icon} size={iconSize(icon)} color={colors.M} />
          ) : icon }
        </View>
        <View style={styles.column}>
          { !!description && !titleFirst && <Text style={[typography.smallLabel, typography.italic, typography.dark]}>{ description }</Text> }
          <View style={styles.row}>
            <Text style={[typography.large]}>
              { title }
            </Text>
          </View>
          { !!description && !!titleFirst && <Text style={[typography.smallLabel, typography.italic, typography.dark]}>{ description }</Text> }
        </View>
      </View>
      { loading ? (
        <View style={[styles.control, growControl ? styles.flex : undefined]}>
          <ActivityIndicator color={colors.lightText} size="small" animating />
        </View>
      ) : (
        <View style={[styles.control, growControl ? styles.flex : undefined]}>{control}</View>
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    maxWidth: 120,
  },
  flex: {
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

