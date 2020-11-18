import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';
import ArkhamButtonIcon, { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';

interface Props {
  onPress?: () => void;
  icon: ArkhamButtonIconType;
  title: string;
}

export default function RoundedFooterButton({ onPress, icon, title }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const height = 18 * fontScale + 20;
  return (
    <Ripple
      style={[
        styles.buttonStyle,
        {
          backgroundColor: colors.L10,
          height,
          borderColor: colors.L10,
        },
      ]}
      rippleColor={colors.L20}
      onPress={onPress}
      disabled={!onPress}
    >
      <View pointerEvents="box-none" style={styles.row}>
        <ArkhamButtonIcon icon={icon} color="dark" />
        <Text style={[typography.button, { marginLeft: height / 4, color: colors.D20 }]}>
          { title }
        </Text>
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    paddingLeft: 14,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});
