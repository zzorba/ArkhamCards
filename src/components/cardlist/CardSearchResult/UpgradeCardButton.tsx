import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';

import AppIcon from '@icons/AppIcon';
import Ripple from '@lib/react-native-material-ripple';
import StyleContext from '@styles/StyleContext';

interface Props {
  onPress: () => void;
}

export default function UpgradeButton({ onPress }: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <Ripple style={[
      styles.button,
      {
        backgroundColor: colors.L20,
        width: 32,
        height: 32,
      },
    ]} onPress={onPress} rippleColor={colors.M} rippleSize={100}>
      <AppIcon
        size={24}
        color={colors.M}
        name="upgrade"
      />
    </Ripple>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
  },
});
