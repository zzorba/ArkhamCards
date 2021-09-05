import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';

import CardTextComponent from '@components/card/CardTextComponent';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { ChaosTokenType } from '@app_constants';
import ChaosToken from '../ChaosToken';

export interface Props {
  symbol: ChaosTokenType;
  text: string;
}

export default function TokenTextLine({
  text,
  symbol,
}: Props) {
  const { colors } = useContext(StyleContext);
  return (
    <View style={[styles.input, { backgroundColor: colors.L30 }, space.marginSideS, space.marginTopS]}>
      <View style={[styles.row, space.paddingS]}>
        <ChaosToken
          iconKey={symbol}
          size="extraTiny"
        />
      </View>
      <View style={styles.text}>
        <CardTextComponent text={text} noBullet />
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
