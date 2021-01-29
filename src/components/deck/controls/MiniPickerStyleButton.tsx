import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import space, { s } from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface Props {
  title: string;
  valueLabel: string | React.ReactNode;
  first?: boolean;
  last?: boolean;
  editable: boolean;
  onPress?: () => void;
}

export default function MiniPickerStyleButton({
  title,
  valueLabel,
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
        space.paddingSideS,
        space.paddingTopS,
        first ? styles.roundTop : undefined,
        last ? styles.roundBottom : undefined,
        { backgroundColor: colors.L20 },
      ]}
      rippleColor={colors.L30}
    >
      <View style={[styles.row, space.paddingBottomS, !last ? { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.L10 } : undefined]}>
        <View style={styles.leftRow}>
          <View style={styles.column}>
            <Text style={[typography.smallLabel, typography.dark, typography.italic]}>
              { title }
            </Text>
            <View style={[styles.row, space.paddingTopXs]}>
              { typeof valueLabel === 'string' ? (
                <Text style={[typography.large]}>
                  { valueLabel }
                </Text>
              ) : valueLabel }
            </View>
          </View>
        </View>
        { !!editable && (
          <View style={styles.editIcon}>
            <AppIcon name="edit" size={20} color={colors.M} />
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
