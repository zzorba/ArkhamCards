import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { BulletType } from '@data/scenario/types';
import { m, s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  code: string;
  name: string;
  description?: string;
  color?: string;
  bulletType?: BulletType;
  value: number;
  limit?: number;
  onInc: (code: string, limit?: number) => void;
  onDec: (code: string) => void;
  editable: boolean;
}

export default function CounterListItemComponent({ code, name, description, color, bulletType, value, limit, onInc, onDec, editable }: Props) {
  const { borderStyle, typography } = useContext(StyleContext);
  const inc = useCallback(() => onInc(code, limit), [onInc, code, limit]);
  const dec = useCallback(() => onDec(code), [onDec, code]);

  const count = useMemo(() => {
    return (
      <View style={styles.count}>
        <Text style={[typography.bigGameFont, typography.center, color ? typography.white : {}]}>
          { value }
        </Text>
      </View>
    );
  }, [color, value, typography]);

  return (
    <View style={[
      styles.promptRow,
      borderStyle,
      color ? { backgroundColor: color } : {},
    ]}>
      <View style={styles.column}>
        <Text style={[typography.mediumGameFont, color ? typography.white : {}]}>
          { name }
        </Text>
        { editable && !!description && (
          <Text style={[typography.text, color ? typography.white : {}]}>
            { description }
          </Text>
        ) }
      </View>
      { editable ? (
        <PlusMinusButtons
          count={value}
          max={limit}
          onIncrement={inc}
          onDecrement={dec}
          countRender={count}
          color={color ? 'light' : 'dark'}
          hideDisabledMinus
        />
      ) : (
        count
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
  count: {
    paddingLeft: xs,
    paddingRight: xs,
    minWidth: 40,
  },
  promptRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: m,
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
});
