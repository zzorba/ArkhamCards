import React from 'react';
import { StyleSheet, View } from 'react-native';

import COLORS from '@styles/colors';
import ArkhamIcon from '@icons/ArkhamIcon';

interface Props {
  color: 'light';
  icon: 'per_investigator' | 'radio';
  selected?: boolean;
}

export default function RadioButton({ icon, selected }: Props) {
  if (icon === 'radio') {
    return (
      <View style={[styles.button, styles.radioButton]}>
        { selected && <View style={styles.radioFillButton} /> }
      </View>
    );
  }
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
  },
  radioButton: {
    borderWidth: 1,
    borderColor: COLORS.L30,
  },
  radioFillButton: {
    borderRadius: 12,
    width: 24,
    height: 24,
    backgroundColor: COLORS.L30,
  },
});
