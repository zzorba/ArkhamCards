import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ripple from '@lib/react-native-material-ripple';
import ArkhamButtonIcon, { ArkhamButtonIconType } from '@icons/ArkhamButtonIcon';
import StyleContext from '@styles/StyleContext';

interface Props {
  icon: ArkhamButtonIconType;
  title: string;
  onPress: () => void;
}

function ArkhamButton({ icon, title, onPress }: Props) {
  const { colors, fontScale, typography } = useContext(StyleContext);
  const height = 18 * fontScale + 20;
  return (
    <View style={styles.wrapper}>
      <Ripple
        style={[
          styles.buttonStyle, {
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
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonStyle: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
