import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import ArkhamButtonIcon, { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  icon: ArkhamButtonIconType;
  title: string;
  onPress: () => void;
  grow?: boolean;
}

function ArkhamButton({ icon, title, onPress, grow }: Props) {
  const { colors, fontScale, shadow, typography } = useContext(StyleContext);
  const height = 18 * fontScale + 20;
  return (
    <View style={[styles.wrapper, grow ? { flexDirection: 'row' } : styles.inline]}>
      <Ripple
        style={[
          shadow.medium,
          grow ? styles.grow : undefined,
          {
            backgroundColor: colors.M,
            height,
            borderRadius: height / 2,
            paddingLeft: height / 4,
          },
        ]}
        rippleColor={colors.L10}
        onPress={onPress}
      >
        <View pointerEvents="box-none" style={styles.row}>
          <ArkhamButtonIcon icon={icon} color="light" />
          <Text style={[typography.button, { marginLeft: height / 4 }]}>
            { title }
          </Text>
        </View>
      </Ripple>
    </View>
  );
}

ArkhamButton.Height = (fontScale: number) => {
  return (fontScale * 18) + 20 + 20;
};
export default ArkhamButton;

const styles = StyleSheet.create({
  wrapper: {
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  grow: {
    flex: 1,
  },
  inline: {
    paddingLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
