import React, { useCallback, useContext, useMemo } from 'react';
import { map, range } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import { ChaosTokenType } from '@app_constants';
import ChaosToken from '@components/campaign/ChaosToken';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  id: ChaosTokenType;
  mutateCount: (id: ChaosTokenType, mutate: (count: number) => number) => void;
  originalCount: number;
  count: number;
  limit: number;
}

function renderTokens(id: ChaosTokenType, count: number, status?: 'added' | 'removed') {
  return (
    <View style={styles.row}>
      { map(range(0, count), (idx) => (
        <ChaosToken
          size="tiny"
          key={`${status}-${idx}`}
          iconKey={id}
          status={status}
        />
      )) }
    </View>
  );
}

export default function ChaosTokenRow({ id, mutateCount, originalCount, count, limit }: Props) {
  const { borderStyle } = useContext(StyleContext);
  const increment = useCallback(() => {
    mutateCount(id, count => Math.min(count + 1, limit));
  }, [id, mutateCount, limit]);

  const decrement = useCallback(() => {
    mutateCount(id, count => Math.max(count - 1, 0));
  }, [id, mutateCount]);

  const tokens = useMemo(()=> {
    if (count > originalCount) {
      return (
        <View style={styles.row}>
          { (originalCount > 0) && renderTokens(id, originalCount) }
          { renderTokens(id, (count - originalCount), 'added') }
        </View>
      );
    }
    if (count < originalCount) {
      return (
        <View style={styles.row}>
          { count > 0 && renderTokens(id, count) }
          { renderTokens(id, (originalCount - count), 'removed') }
        </View>
      );
    }
    return renderTokens(id, count);
  }, [id, count, originalCount]);

  return (
    <View style={[styles.mainRow, borderStyle]}>
      <View style={styles.row}>
        <ChaosToken iconKey={id} size="tiny" />
        <PlusMinusButtons
          count={count}
          onIncrement={increment}
          onDecrement={decrement}
          size={36}
          max={limit}
        />
      </View>
      { tokens }
    </View>
  );
}


const styles = StyleSheet.create({
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: s,
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
