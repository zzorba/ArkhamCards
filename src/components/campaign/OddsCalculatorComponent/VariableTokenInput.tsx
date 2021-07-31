import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChaosTokenType } from '@app_constants';
import ChaosToken from '../ChaosToken';

export interface Props {
  symbol: ChaosTokenType;
  value: number;
  text: string;
  increment: (symbol: string) => void;
  decrement: (symbol: string) => void;
}

export default function VariableTokenInput({
  text,
  value,
  symbol,
  increment,
  decrement,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const inc = useCallback(() => {
    increment(symbol);
  }, [increment, symbol]);

  const dec = useCallback(() => {
    decrement(symbol);
  }, [decrement, symbol]);

  return (
    <View style={[styles.input, { backgroundColor: colors.L20 }, space.marginSideS, space.marginTopS]}>
      <View style={[styles.row, space.paddingS]}>
        <ChaosToken
          iconKey={symbol}
          size="extraTiny"
        />
      </View>
      <View style={styles.text}>
        <CardTextComponent text={text} />
      </View>
      <View style={[styles.row, { borderColor: colors.L10, borderLeftWidth: StyleSheet.hairlineWidth }, space.paddingLeftS]}>
        <PlusMinusButtons
          count={value}
          size={36}
          dialogStyle
          countRender={<Text style={[typography.text, styles.counterText, typography.center]}>{ value }</Text>}
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
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
  },
  counterText: {
    fontSize: 22,
    paddingRight: s,
    minWidth: 32,
  },
});
