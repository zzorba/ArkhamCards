import React from 'react';
import { StyleSheet, View } from 'react-native';

import ArkhamSwitch from '@components/core/ArkhamSwitch';

interface Props {
  value: boolean;
  toggleValue: (value: boolean) => void;
  disabled?: boolean;
}
export default function CardToggle({ value, toggleValue, disabled }: Props) {
  return (
    <View style={styles.switchButton}>
      <ArkhamSwitch
        value={!!value}
        onValueChange={toggleValue}
        disabled={disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  switchButton: {
    marginTop: 6,
    marginRight: 6,
  },
});
