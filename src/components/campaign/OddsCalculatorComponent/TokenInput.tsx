import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChaosTokenType } from '@app_constants';
import ChaosToken from '../ChaosToken';
import TokenTextLine from './TokenTextLine';
import AppIcon from '@icons/AppIcon';

export interface Props {
  symbol: ChaosTokenType;
  text?: string;
  prompt: string;
  children: React.ReactNode;
}

export default function TokenInput({
  text,
  prompt,
  symbol,
  children,
}: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <>
      { !!text && <TokenTextLine symbol={symbol} text={text} /> }
      <View style={[styles.input, { backgroundColor: colors.L20, minHeight: 36 + s * 2 }, space.marginSideS, !text ? space.marginTopS : undefined]}>
        <View style={[styles.row, space.paddingS]}>
          { !text ? (
            <ChaosToken iconKey={symbol} size="extraTiny" />
          ) : (
            <View style={{ width: 36 }}>
              <AppIcon name="above_arrow" size={32} color={colors.M} />
            </View>
          ) }
        </View>
        <View style={styles.text}>
          <CardTextComponent text={prompt} />
        </View>
        <View style={[styles.row, { borderColor: colors.L10, borderLeftWidth: 1 }, space.paddingSideS]}>
          { children }
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
