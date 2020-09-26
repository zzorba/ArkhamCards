import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BasicListRow from './BasicListRow';
import StyleContext from '@styles/StyleContext';
import PlusMinusButtons from './PlusMinusButtons';

interface Props {
  inc: () => void;
  dec: () => void;
  value: number;
  label: string;
  min?: number;
  max?: number;
}

export default function CounterRow({ inc, dec, value, label, max, min }: Props) {
  const { typography, gameFont, fontScale } = useContext(StyleContext);
  const count = (
    <View style={[styles.count, { width: 40 * fontScale }]}>
      <Text style={[typography.mediumGameFont, { fontFamily: gameFont }]}>{value}</Text>
    </View>
  );
  return (
    <BasicListRow>
      <View style={styles.row}>
        <View>
          <Text style={typography.large}>
            { label }
          </Text>
        </View>
        <PlusMinusButtons
          onIncrement={inc}
          onDecrement={dec}
          min={min}
          max={max}
          count={value}
          countRender={count}
        />
      </View>
    </BasicListRow>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
