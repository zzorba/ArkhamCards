import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChaosTokenType } from '@app_constants';
import ChaosToken from '../ChaosToken';
import TokenTextLine from './TokenTextLine';

export interface Props {
  symbol: ChaosTokenType;
  value: number;
  text?: string;
  prompt: string;
  min: number;
  max?: number;
  increment: (symbol: string) => void;
  decrement: (symbol: string) => void;
}

export default function VariableTokenInput({
  text,
  prompt,
  value,
  symbol,
  min,
  max,
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
    <>
      { !!text && <TokenTextLine symbol={symbol} text={text} /> }
      <View style={[styles.input, { backgroundColor: colors.L20, minHeight: 36 + s * 2 }, space.marginSideS, space.marginTopS]}>
        <View style={[styles.row, space.paddingS]}>
          { !text ? (
            <ChaosToken
              iconKey={symbol}
              size="extraTiny"
            />
          ) : (
            <View style={{ width: 36 }} />
          ) }
        </View>
        <View style={styles.text}>
          <CardTextComponent text={prompt} />
        </View>
        <View style={[styles.row, { borderColor: colors.L10, borderLeftWidth: StyleSheet.hairlineWidth }, space.paddingSideS]}>
          <PlusMinusButtons
            count={value}
            size={36}
            dialogStyle
            countRender={<Text style={[typography.text, styles.counterText, typography.center]}>{ value }</Text>}
            onIncrement={inc}
            onDecrement={dec}
            min={min}
            max={max}
            color="dark"
          />
        </View>
      </View>
    </>
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
