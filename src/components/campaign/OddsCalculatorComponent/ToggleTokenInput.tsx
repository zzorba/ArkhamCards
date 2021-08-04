import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChaosTokenType } from '@app_constants';
import ChaosToken from '../ChaosToken';
import ArkhamSwitch from '@components/core/ArkhamSwitch';
import TokenTextLine from './TokenTextLine';

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
  const { colors } = useContext(StyleContext);
  const onToggle = useCallback(() => {
    toggle(symbol);
  }, [toggle, symbol]);

  return (
    <>
      { !!text && <TokenTextLine symbol={symbol} text={text} /> }
      <View style={[styles.input, { backgroundColor: colors.L20, minHeight: 36 + s * 2 }, space.marginSideS, !text ? space.marginTopS : undefined]}>
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
          <ArkhamSwitch
            value={value}
            onValueChange={onToggle}
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
});
