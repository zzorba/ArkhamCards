import React, { useCallback } from 'react';
import { Text } from 'react-native';

import { ChaosTokenType } from '@app_constants';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import TokenInput from './TokenInput';

export interface Props {
  symbol: ChaosTokenType;
  value: number;
  text?: string;
  index: number;
  prompt: string;
  toggle: (symbol: string, index: number) => void;
}

export default function ToggleTokenInput({
  text,
  prompt,
  value,
  symbol,
  index,
  toggle,
}: Props) {
  const selected = value === index;
  const onToggle = useCallback(() => {
    if (selected) {
      toggle(symbol, 0);
    } else {
      toggle(symbol, index);
    }
  }, [selected, toggle, symbol]);
  return (
    <TokenInput
      symbol={symbol}
      text={text}
      prompt={prompt}
    >
      <ArkhamSwitch
        value={selected}
        onValueChange={onToggle}
        color="dark"
      />
    </TokenInput>
  );
}
