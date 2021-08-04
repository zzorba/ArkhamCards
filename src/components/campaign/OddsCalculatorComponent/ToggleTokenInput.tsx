import React, { useCallback, useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChaosTokenType } from '@app_constants';
import ChaosToken from '../ChaosToken';
import ArkhamSwitch from '@components/core/ArkhamSwitch';

export interface Props {
  symbol: ChaosTokenType;
  value: boolean;
  text: string;
  toggle: (symbol: string) => void;
}

export default function ToggleTokenInput({
  text,
  value,
  symbol,
  toggle,
}: Props) {
  const { colors } = useContext(StyleContext);
  const onToggle = useCallback(() => {
    toggle(symbol);
  }, [toggle, symbol]);

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
        <ArkhamSwitch
          value={value}
          onValueChange={onToggle}
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
});
