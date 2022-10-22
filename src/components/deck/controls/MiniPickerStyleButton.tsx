import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface Props {
  title: string;
  valueLabel: string | React.ReactNode;
  icon?: string;
  first?: boolean;
  last?: boolean;
  editable: boolean;
  onPress?: () => void;
}

export default function MiniPickerStyleButton({
  title,
  valueLabel,
  icon = 'edit',
  first,
  last,
  editable,
  onPress,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  return (
    <Ripple
      onPress={onPress}
      disabled={!editable}
      style={[
        first ? styles.roundTop : undefined,
        last ? styles.roundBottom : undefined,
        {
          backgroundColor: colors.L20,
          minHeight: 32,
        },
      ]}
      contentStyle={[
        space.paddingSideS,
        space.paddingTopXs,
      ]}
      rippleColor={colors.L30}
    >
      <View style={[
        styles.row,
        space.paddingBottomXs,
        { minHeight: 36 },
        !last ? { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.L10 } : undefined]}>
        <View style={styles.leftRow}>
          <View style={styles.row}>
            <Text style={[typography.small, typography.dark, typography.italic, { flex: 1.5, textAlignVertical: 'center' }, space.paddingRightS]}>
              { title }
            </Text>
            <View style={[styles.row, space.paddingTopXs, typeof valueLabel === 'string' ? undefined : space.paddingBottomXs, { flex: 2 }]}>
              { typeof valueLabel === 'string' ? (
                <Text style={[typography.large]}>
                  { valueLabel }
                </Text>
              ) : valueLabel }
            </View>
          </View>
        </View>
        <View style={styles.editIcon}>
          { !!editable && <AppIcon name={icon} size={26} color={colors.M} /> }
        </View>
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
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
  editIcon: {
    width: 24,
    height: 24,
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
