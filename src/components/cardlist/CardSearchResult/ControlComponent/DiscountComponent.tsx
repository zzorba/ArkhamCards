import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ngettext, msgid } from 'ttag';

import { s, xs } from '@styles/space';
import StyleContext from '@styles/StyleContext';
interface Props {
  available: number;
  used: number;
}

export function DiscountComponent({ available, used }: Props) {
  const { typography } = useContext(StyleContext);
  return (
    <View style={styles.countWrapper}>
      <View style={styles.count}>
        <Text style={typography.text}>
          { ngettext(msgid`${used} / ${available} used`, `${used} / ${available} used`, used) }
        </Text>
      </View>
    </View>
  );
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
