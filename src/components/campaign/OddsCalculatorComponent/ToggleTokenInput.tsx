import React, { useCallback } from 'react';

import { ChaosTokenType } from '@app_constants';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import TokenInput from './TokenInput';

export interface Props {
  symbol: ChaosTokenType;
  value: boolean;
  text?: string;
  prompt: string;
  toggle: (symbol: string) => void;
}

export default function ToggleTokenInput({
  text,
  prompt,
  value,
  symbol,
  toggle,
}: Props) {
  const onToggle = useCallback(() => {
    toggle(symbol);
  }, [toggle, symbol]);

  return (
    <TokenInput
      symbol={symbol}
      text={text}
      prompt={prompt}
    >
      <ArkhamSwitch
        value={value}
        onValueChange={onToggle}
        color="dark"
      />
    </TokenInput>
  );
}
