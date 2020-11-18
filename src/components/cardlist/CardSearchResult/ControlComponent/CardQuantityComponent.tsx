import React, { useCallback, useContext, useReducer } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { rowHeight, toggleButtonMode } from '../constants';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { EditSlotsActions, useCounter, useEffectUpdate } from '@components/core/hooks';
import RoundButton from '@components/core/RoundButton';

interface Props {
  code: string;
  count: number;
  countChanged: EditSlotsActions;
  limit: number;
  showZeroCount?: boolean;
  forceBig?: boolean;
}

function TinyCardQuantityComponent({ code, count: propsCount, countChanged: { setSlot }, limit }: Props) {
  const { fontScale, typography } = useContext(StyleContext);
  const [count, updateCount] = useReducer((count: number, action: 'cycle' | 'sync') => {
    if (action === 'cycle') {
      const newCount = (count + 1) % (limit + 1);
      setTimeout(() => setSlot(code, newCount), 100);
      return newCount;
    }
    return propsCount;
  }, propsCount);

  useEffectUpdate(() => {
    updateCount('sync');
  }, [propsCount]);

  const onPress = useCallback(() => {
    updateCount('cycle');
  }, [updateCount]);

  return (
    <View style={[styles.row, { height: rowHeight(fontScale) }]}>
      <RoundButton onPress={onPress}>
        <View style={styles.centerText}>
          <Text style={[typography.text, styles.count, typography.center]}>
            { count }
          </Text>
        </View>
      </RoundButton>
    </View>
  );
}

function NormalCardQuantityComponent({ code, count: propsCount, countChanged: { incSlot, decSlot }, limit, showZeroCount, forceBig }: Props) {
  const { fontScale, typography } = useContext(StyleContext);
  const [count, incCount, decCount, setCount] = useCounter(propsCount, { min: 0, max: limit });
  useEffectUpdate(() => {
    setCount(propsCount);
  }, [propsCount]);

  const inc = useCallback(() => {
    incCount();
    setTimeout(() => incSlot(code), 100);
  }, [incCount, incSlot, code]);
  const dec = useCallback(() => {
    decCount();
    setTimeout(() => decSlot(code), 100);
  }, [decCount, decSlot, code]);

  return (
    <View style={[styles.row, { height: rowHeight(fontScale) }]}>
      <PlusMinusButtons
        count={count}
        size={36}
        onIncrement={inc}
        onDecrement={dec}
        max={limit}
        color={forceBig ? 'white' : undefined}
        hideDisabledMinus
        countRender={
          <Text style={[typography.text, styles.count, forceBig ? { color: 'white', fontSize: 22 } : {}]}>
            { (showZeroCount || count !== 0) ? count : ' ' }
          </Text>
        }
      />
    </View>
  );
}

/**
 * Simple sliding card count.
 */
export default function CardQuantityComponent(props: Props) {
  const { fontScale } = useContext(StyleContext);

  if (toggleButtonMode(fontScale) && !props.forceBig) {
    return <TinyCardQuantityComponent {...props} />;
  }
  return <NormalCardQuantityComponent {...props} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: xs,
  },
  count: {
    marginLeft: xs,
    width: 16,
    textAlign: 'center',
    marginRight: s,
    fontWeight: '600',
  },
  centerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
  },
});
