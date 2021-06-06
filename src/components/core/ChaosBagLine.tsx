import React, { useMemo } from 'react';
import { chunk, keys, flatMap, map, range, sortBy } from 'lodash';

import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType } from '@app_constants';
import { StyleSheet, View } from 'react-native';
import ChaosToken, { TINY_TOKEN_SIZE, EXTRA_TINY_TOKEN_SIZE } from '@components/campaign/ChaosToken';
import space, { xs } from '@styles/space';

interface Props {
  chaosBag: ChaosBag;
  width: number;
  sealed?: boolean;
  extraTiny?: boolean;
}

export default function ChaosBagLine({ chaosBag, width, sealed, extraTiny }: Props) {
  const tokens: ChaosTokenType[] = useMemo(() => {
    const bagKeys: ChaosTokenType[] = sortBy(
      keys(chaosBag) as ChaosTokenType[],
      (token: ChaosTokenType) => CHAOS_TOKEN_ORDER[token]);
    return flatMap(bagKeys, (token: ChaosTokenType) => map(range(0, chaosBag[token] || 0), () => token));
  }, [chaosBag]);
  const tokenWidth = (extraTiny ? (EXTRA_TINY_TOKEN_SIZE + 2) : (TINY_TOKEN_SIZE + xs * 2));
  const wrapTokens = Math.floor(width / tokenWidth);
  const wrapWidth = wrapTokens * tokenWidth;
  const chunks = useMemo(() => {
    return chunk(tokens || [], wrapTokens);
  }, [tokens, wrapTokens])

  if (!tokens.length) {
    return null;
  }
  return (
    <View style={styles.tokenWrapper}>
      { map(chunks, (chunk, row) => (
        <View style={[styles.tokenRow, { flexBasis: wrapWidth }]} key={row}>
          { map(chunk, (token, idx) => (
            <View style={extraTiny ? { padding: 1 } : space.paddingXs} key={idx}>
              <ChaosToken iconKey={token} size={extraTiny ? 'extraTiny' : 'tiny'} sealed={sealed} />
            </View>
          )) }
          { (chunk.length < wrapTokens) && (chunk.length - wrapTokens) % 2 === 1 && (
            <View style={{ width: tokenWidth }} />
          )}
        </View>
      )) }
    </View>
  );
}

const styles = StyleSheet.create({
  tokenWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
