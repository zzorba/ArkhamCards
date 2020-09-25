import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';

interface Props {
  onPress: () => void;
}

export default function UpgradeButton({ onPress }: Props) {
  const { colors, fontScale } = useContext(StyleContext);
  return (
    <Ripple style={[
      styles.button,
      {
        backgroundColor: colors.M,
      },
    ]} onPress={onPress} rippleColor={colors.L10} rippleSize={100}>
      <MaterialCommunityIcons
        size={18 * fontScale}
        color="#FFF"
        name="arrow-up-bold"
      />
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 8,
    marginRight: 4,
  },
});
