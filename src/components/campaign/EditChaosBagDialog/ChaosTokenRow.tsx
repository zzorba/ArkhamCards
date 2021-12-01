import React, { useCallback, useContext, useMemo } from 'react';
import { map, range } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import { ChaosTokenType } from '@app_constants';
import ChaosToken from '@components/campaign/ChaosToken';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import space, { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  id: ChaosTokenType;
  mutateCount: (id: ChaosTokenType, mutate: (count: number) => number) => void;
  originalCount: number;
  count: number;
  limit: number;
}

function renderTokens(id: ChaosTokenType, count: number, status?: 'added' | 'removed', alreadyRendered?: number) {
  const renderCount = (count + (alreadyRendered || 0) > 4) ? Math.min(3, count + (alreadyRendered || 0)) : count;
  return (
    <View style={styles.row}>
      { map(range(0, renderCount), (idx) => (
        <View style={space.paddingRightXs} key={`${status}-${idx}`}>
          <ChaosToken
            size="tiny"
            iconKey={id}
            status={status}
          />
        </View>
      )) }
    </View>
  );
}

export default function ChaosTokenRow({ id, mutateCount, count, limit }: Props) {
  const { borderStyle } = useContext(StyleContext);
  const increment = useCallback(() => {
    mutateCount(id, count => Math.min(count + 1, limit));
  }, [id, mutateCount, limit]);

  const decrement = useCallback(() => {
    mutateCount(id, count => Math.max(count - 1, 0));
  }, [id, mutateCount]);

  const tokens = useMemo(()=> {
    return (
      <View style={styles.row}>
        { count > 4 ? (
          <>
            <View style={space.paddingRightXs}>
              <ChaosToken
                size="tiny"
                key={id}
                iconKey={id}
              />
            </View>
            <ChaosToken
              size="tiny"
              key="more"
              iconKey="more"
              total={count}
            />
          </>
        ) : renderTokens(id, count) }
      </View>
    )
  }, [id, count]);

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
