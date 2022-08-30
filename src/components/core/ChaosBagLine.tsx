import React, { useMemo } from 'react';
import { chunk, map } from 'lodash';

import { ChaosBag, ChaosTokenType } from '@app_constants';
import { StyleSheet, View } from 'react-native';
import ChaosToken, { TINY_TOKEN_SIZE, EXTRA_TINY_TOKEN_SIZE } from '@components/chaos/ChaosToken';
import space, { xs } from '@styles/space';
import { Chaos_Bag_Tarot_Mode_Enum } from '@generated/graphql/apollo-schema';
import { flattenChaosBag } from '@components/campaign/campaignUtil';

interface Props {
  chaosBag: ChaosBag;
  tarot?: Chaos_Bag_Tarot_Mode_Enum;
  width: number;
  sealed?: boolean;
  extraTiny?: boolean;
}

export default function ChaosBagLine({ chaosBag, width, sealed, extraTiny, tarot }: Props) {
  const tokens: ChaosTokenType[] = useMemo(() => {
    return flattenChaosBag(chaosBag, tarot);
  }, [chaosBag, tarot]);
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
