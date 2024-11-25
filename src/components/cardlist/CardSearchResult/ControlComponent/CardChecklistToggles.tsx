import React from 'react';
import { StyleSheet, View } from 'react-native';

import ArkhamSwitch from '@components/core/ArkhamSwitch';
import { find, indexOf, range } from 'lodash';

interface Props {
  code: string;
  quantity: number;
  values: number[];
  toggleValue: (value: number, toggle: boolean) => void;
}
export default function CardChecklistToggles({ code, values, quantity, toggleValue }: Props) {
  return (
    <View style={styles.switchButton}>
      { range(0, quantity).map(idx => {
        const enabled: boolean = values.indexOf(idx) !== -1;
        return (
          <ArkhamSwitch
            key={`${code}-${idx}`}
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
    marginRight: 6,
    flexDirection: 'row',
  },
});
