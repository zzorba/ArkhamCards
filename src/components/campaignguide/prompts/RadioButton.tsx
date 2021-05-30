import React from 'react';
import { StyleSheet, View } from 'react-native';

import COLORS from '@styles/colors';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  color: 'light';
  icon: 'per_investigator';
  selected?: boolean;
}

export default function RadioButton({ icon, selected }: Props) {
  return (
    <View style={[styles.button, { backgroundColor: selected ? '#FFFBF2' : '#FFFBF244' }]}>
      { !!selected && <ArkhamIcon name={icon} size={22} color={COLORS.D30} /> }
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    width: 32,
    height: 32,
    backgroundColor: COLORS.L30,
  },
});
