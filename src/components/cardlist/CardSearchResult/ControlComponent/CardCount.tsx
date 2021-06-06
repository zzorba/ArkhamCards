import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
interface Props {
  count: number;
  deltaCountMode?: boolean;
  showZeroCount?: boolean;
}

export function CardCount({ count, deltaCountMode, showZeroCount }: Props) {
  const { typography } = useContext(StyleContext);
  const countText = useMemo(() => {
    if (deltaCountMode) {
      if (count > 0) {
        return `+${count}`;
      }
      return `${count}`;
    }
    return `×${count}`;
  }, [count, deltaCountMode]);

  if (count !== 0 || showZeroCount) {
    return (
      <View style={styles.countWrapper}>
        <View style={styles.count}>
          <Text style={typography.text}>
            { countText }
          </Text>
        </View>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  countWrapper: {
    marginRight: s,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    marginLeft: xs,
    minWidth: 25,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
