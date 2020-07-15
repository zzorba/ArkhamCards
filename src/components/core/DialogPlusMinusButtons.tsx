import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import typography from '@styles/typography';
import space, { s } from '@styles/space';

interface Props {
  label: string;
  value: number;
  max?: number;
  inc: () => void;
  dec: () => void;
  disabled?: boolean;
}

export default function DialogPlusMinusButtons({
  label,
  value,
  max,
  inc,
  dec,
  disabled,
}: Props) {
  return (
    <View style={[styles.counterColumn, space.paddingTopXs]}>
      <Text style={typography.dialogLabel}>
        { label }
      </Text>
      <View style={styles.buttonsRow}>
        <Text style={[typography.label, styles.labelText]}>
          { value }
        </Text>
        <PlusMinusButtons
          count={value}
          max={max}
          onIncrement={inc}
          onDecrement={dec}
          size={36}
          disabled={disabled}
          color="dark"
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  counterColumn: {
    marginRight: Platform.OS === 'ios' ? 28 : 8,
    marginLeft: Platform.OS === 'ios' ? 28 : 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingBottom: s,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  labelText: {
    fontWeight: '900',
    minWidth: 30,
  },
});
