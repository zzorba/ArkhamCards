import React, { useContext } from 'react';
import { keys, flatMap, map, range, sortBy } from 'lodash';

import { CHAOS_TOKEN_ORDER, ChaosBag, ChaosTokenType, SPECIAL_TOKENS } from '@app_constants';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import LanguageContext from '@lib/i18n/LanguageContext';

const SPECIAL_TOKENS_SET: Set<ChaosTokenType> = new Set(SPECIAL_TOKENS);

interface Props {
  chaosBag: ChaosBag;
}

export default function ChaosBagTextLine({ chaosBag }: Props) {
  const { listSeperator } = useContext(LanguageContext);
  const bagKeys = sortBy(
    keys(chaosBag),
    (token: ChaosTokenType) => CHAOS_TOKEN_ORDER[token]);
  const tokensLine = flatMap(bagKeys, (token: ChaosTokenType) => (
    map(range(0, chaosBag[token] || 0), () => SPECIAL_TOKENS_SET.has(token) ? `[${token}]` : `${token}`)
  )).join(listSeperator);
  if (!tokensLine) {
    return null;
  }
  return (
    <CardFlavorTextComponent
      sizeScale={1.3}
      text={`<game>${tokensLine}</game>`}
    />
  );
}
