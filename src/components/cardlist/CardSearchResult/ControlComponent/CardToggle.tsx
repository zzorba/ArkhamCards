import React from 'react';
import { StyleSheet, View } from 'react-native';

import ArkhamSwitch from '@components/core/ArkhamSwitch';

interface Props {
  value: boolean;
  toggleValue: (value: boolean) => void;
}
export default function CardToggle({ value, toggleValue }: Props) {
  return (
    <View style={styles.switchButton}>
      <ArkhamSwitch
        value={!!value}
        onValueChange={toggleValue}
        useGestureHandler
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
