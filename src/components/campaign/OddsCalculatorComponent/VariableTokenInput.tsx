import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import ArkhamIcon from '@icons/ArkhamIcon';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import COLORS from '@styles/colors';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';

export interface Props {
  symbol: string;
  color: string;
  value: number;
  text: string;
  increment: (symbol: string) => void;
  decrement: (symbol: string) => void;
}

export default function VariableTokenInput({
  text,
  value,
  symbol,
  color,
  increment,
  decrement,
}: Props) {
  const { borderStyle, typography } = useContext(StyleContext);
  const inc = useCallback(() => {
    increment(symbol);
  }, [increment, symbol]);

  const dec = useCallback(() => {
    decrement(symbol);
  }, [decrement, symbol]);

  return (
    <View style={[styles.skillRow, borderStyle]}>
      <View style={[styles.row, styles.colorBox, { backgroundColor: color }]}>
        <ArkhamIcon
          name={symbol}
          size={28}
          color={COLORS.white}
        />
      </View>
      <View style={styles.text}>
        <CardTextComponent text={text} />
      </View>
      <View style={[styles.row, { paddingRight: s }]}>
        <Text style={[typography.text, styles.counterText]}>
          { value }
        </Text>
        <PlusMinusButtons
          count={value}
          size={36}
          onIncrement={inc}
          onDecrement={dec}
          color="dark"
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  text: {
    flex: 1,
    marginRight: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBox: {
    flexDirection: 'column',
    minHeight: 50,
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  skillRow: {
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  counterText: {
    fontSize: 22,
    paddingRight: s,
  },
});
