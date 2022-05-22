import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import AppIcon from '@icons/AppIcon';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';

interface Props {
  icon?: string;
  text: string;
  control: React.ReactNode;
  height?: number;
  paddingBottom?: number;
  hideIcon?: boolean;
}
export default function NewDialogContentLine({ icon, text, control, height, paddingBottom, hideIcon }: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <View style={[styles.row, height ? { minHeight: height } : undefined, { paddingBottom }]}>
      <View style={styles.leadRow}>
        {!hideIcon && (
          <View style={[styles.icon, space.marginRightXs]}>
            { !!icon && <AppIcon name={icon} size={32} color={colors.M} /> }
          </View>
        ) }
        <Text style={[typography.menuText, !icon ? typography.italic : undefined, styles.text]}>
          { text }
        </Text>
      </View>
      { control }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
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
  text: {
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
