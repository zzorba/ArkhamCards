import React from 'react';
import { StyleSheet, View } from 'react-native';

import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { find, range } from 'lodash';

interface Props {
  quantity: number;
  values: number[];
  toggleValue: (value: number, toggle: boolean) => void;
}
export default function CardChecklistToggles({ values, quantity, toggleValue }: Props) {
  return (
    <View style={styles.switchButton}>
      { range(0, quantity).map(idx => {
        const enabled = !!find(values, v => v === idx);
        return (
          <ArkhamSwitch
            key={idx}
            value={enabled}
            onValueChange={() => toggleValue(idx, !enabled)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  switchButton: {
    marginTop: 6,
    marginRight: 6,
    flexDirection: 'row',
  },
});
