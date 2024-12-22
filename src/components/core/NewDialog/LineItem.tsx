import React, { useContext, useMemo, ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import ArkhamIcon from '@icons/ArkhamIcon';
import TextWithIcons from '../TextWithIcons';

interface Props {
  iconName?: string;
  iconNode?: ReactNode;
  rightNode?: ReactNode;
  indicatorNode?: ReactNode;
  text: string;
  disabled?: boolean;
  description?: string;
  last: boolean;
}
const ARKHAM_ICONS = new Set(['weakness', 'wild']);
export default function LineItem({ iconName, iconNode, disabled, text, description, rightNode, last, indicatorNode }: Props) {
  const { borderStyle, colors, typography } = useContext(StyleContext);
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
              <Text style={[typography.cardTraits, { flex: 1 }]} numberOfLines={3} ellipsizeMode="clip">
                <TextWithIcons size={16} color={colors.lightText} text={description} />
              </Text>
            </View>
          ) : (
            <Text style={[typography.menuText, { textAlignVertical: 'center', flex: 1 }]}>
              { text }
            </Text>
          ) }
        </View>
        { !!rightNode && rightNode }
        { !!indicatorNode && indicatorNode }
      </View>
    </View>
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
});
