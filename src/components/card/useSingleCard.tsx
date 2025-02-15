import { useMemo } from 'react';

import { usePlayerCards } from '@components/core/hooks';
import Card, { InvestigatorChoice } from '@data/types/Card';
import useCardList from './useCardList';
import { DeckMeta } from '@actions/types';
import { uniq } from 'lodash';

const EMPTY_CODES: string[] = [];
export default function useSingleCard(code: undefined | string, type: 'player' | 'encounter', tabooSetOverride?: number): [Card | undefined, boolean] {
  const [playerCodes, encounterCodes] = useMemo(() => {
    if (!code) {
      return [EMPTY_CODES, EMPTY_CODES];
    }
    if (type === 'player') {
      return [[code], EMPTY_CODES];
    }
    return [EMPTY_CODES, [code]];
  }, [code, type]);
  const [playerCards] = usePlayerCards(playerCodes, false, tabooSetOverride);
  const [encounterCards, loading] = useCardList(encounterCodes, 'encounter', false, tabooSetOverride);
  if (!code) {
    return [undefined, false];
  }
  if (type === 'player') {
    if (!playerCards) {
      return [undefined, false];
    }
    if (!playerCards) {
      return [undefined, true];
    }
    return [playerCards[code], false];
  }
  if (!encounterCards || !encounterCards.length || !encounterCards[0]) {
    return [undefined, loading];
  }
  return [encounterCards[0], loading];
}

export function useInvestigatorChoice(code: string | undefined, meta?: DeckMeta, tabooSetOverride?: number): InvestigatorChoice | undefined {
  const alternateFront = meta?.alternate_front;
  const alternateBack = meta?.alternate_back;
  const codes = useMemo(() => {
    if (!code) {
      return EMPTY_CODES;
    }
    return uniq([
      code,
      alternateFront ?? code,
      alternateBack ?? code,
    ]);
  }, [code, alternateFront, alternateBack]);
  const [playerCards] = usePlayerCards(codes, false, tabooSetOverride);
  return useMemo(() => {
    if (!code) {
      return undefined;
    }
    const main = playerCards?.[code];
    const front = playerCards?.[alternateFront ?? code];
    const back = playerCards?.[alternateBack ?? code];
    if (!front || !back || !main) {
      return undefined;
    }
    return { front, back, main };
  }, [code, alternateFront, alternateBack, playerCards]);
}

