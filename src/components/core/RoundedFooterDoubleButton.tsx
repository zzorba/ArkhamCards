import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import ArkhamButtonIcon, { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';

interface Props {
  onPressA?: () => void;
  iconA: ArkhamButtonIconType;
  titleA: string;

  onPressB?: () => void;
  iconB: ArkhamButtonIconType;
  titleB: string;
}

export default function RoundedFooterDoubleButton({ onPressA, iconA, titleA, onPressB, iconB, titleB }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const height = (18 * fontScale) + 22;
  return (
    <View style={[
      styles.buttonStyle,
      {
        backgroundColor: colors.L10,
        height,
        paddingLeft: 0,
      },
    ]}>
      <Ripple
        style={[
          styles.buttonStyle,
          {
            flex: 1,
            borderBottomRightRadius: 0,
            backgroundColor: colors.L10,
            height,
          },
        ]}
        rippleColor={colors.L20}
        onPress={onPressA}
      >
        <View pointerEvents="box-none" style={styles.row}>
          <ArkhamButtonIcon icon={iconA} color="dark" />
          <Text style={[typography.button, { marginLeft: height / 4, color: colors.D20, textAlignVertical: 'center' }]}>
            { titleA }
          </Text>
        </View>
      </Ripple>
      <View style={[styles.divider, { height: height - 16, backgroundColor: colors.background }]} />
      <Ripple
        style={[
          styles.buttonStyle,
          {
            flex: 1,
            borderBottomLeftRadius: 0,
            backgroundColor: colors.L10,
            height,
          },
        ]}
        rippleColor={colors.L20}
        onPress={onPressB}
      >
        <View pointerEvents="box-none" style={styles.row}>
          <ArkhamButtonIcon icon={iconB} color="dark" />
          <Text style={[typography.button, { marginLeft: height / 4, color: colors.D20 }]}>
            { titleB }
          </Text>
        </View>
      </Ripple>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    paddingLeft: 14,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
  },
});
