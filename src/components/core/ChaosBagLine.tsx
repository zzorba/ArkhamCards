import React, { useMemo } from 'react';
import { keys, flatMap, map, range, sortBy } from 'lodash';

import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '@app_constants';
import { StyleSheet, View } from 'react-native';
import ChaosToken, { TINY_TOKEN_SIZE } from '@components/campaign/ChaosToken';
import space, { xs } from '@styles/space';

interface Props {
  chaosBag: ChaosBag;
  width: number;
  sealed?: boolean;
}

export default function ChaosBagLine({ chaosBag, width, sealed }: Props) {
  const tokens: ChaosTokenType[] = useMemo(() => {
    const bagKeys: ChaosTokenType[] = sortBy(
      keys(chaosBag) as ChaosTokenType[],
      (token: ChaosTokenType) => CHAOS_TOKEN_ORDER[token]);
    return flatMap(bagKeys, (token: ChaosTokenType) => map(range(0, chaosBag[token] || 0), () => token));
  }, [chaosBag]);
  const tokenWidth = TINY_TOKEN_SIZE + xs * 2;
  const wrapWidth = Math.floor(width / tokenWidth) * tokenWidth;
  if (!tokens.length) {
    return null;
  }
  return (
    <View style={styles.tokenWrapper}>
      <View style={[styles.tokenRow, { flexBasis: wrapWidth }]}>
        { map(tokens, (token, idx) => (
          <View style={space.paddingXs} key={idx}>
            <ChaosToken iconKey={token} tiny sealed={sealed} />
          </View>
        )) }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tokenWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});
