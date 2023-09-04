import React, { useCallback, useContext } from 'react';
import { StyleSheet, Text } from 'react-native';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChaosTokenType } from '@app_constants';
import TokenInput from './TokenInput';

export interface Props {
  symbol: ChaosTokenType;
  value: number;
  text?: string;
  prompt: string;
  min: number;
  max?: number;
  increment: (symbol: string) => void;
  decrement: (symbol: string) => void;
  negate?: boolean;
  showPlus?: boolean;
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
  negate,
  showPlus,
}: Props) {
  const { typography } = useContext(StyleContext);
  const inc = useCallback(() => {
    increment(symbol);
  }, [increment, symbol]);

  const dec = useCallback(() => {
    decrement(symbol);
  }, [decrement, symbol]);

  const theValue = value * (negate ? -1 : 1);
  return (
    <TokenInput
      symbol={symbol}
      text={text}
      prompt={prompt}
    >
      <PlusMinusButtons
        count={value * (negate ? -1 : 1)}
        size={36}
        dialogStyle
        onIncrement={negate ? dec : inc}
        onDecrement={negate ? inc : dec}
        min={min}
        max={max}
        color="dark"
      >
        <Text style={[typography.text, styles.counterText, typography.center]}>{ showPlus && theValue >= 0 ? `+${theValue}` : theValue }</Text>
      </PlusMinusButtons>
    </TokenInput>
  );
}


const styles = StyleSheet.create({
  counterText: {
    fontSize: 22,
    paddingRight: s,
    minWidth: 32,
  },
});
