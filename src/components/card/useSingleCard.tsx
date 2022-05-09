import { useMemo } from 'react';

import { usePlayerCards } from '@components/core/hooks';
import Card from '@data/types/Card';
import useCardList from './useCardList';

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
  const [playerCards] = usePlayerCards(playerCodes, tabooSetOverride);
  const [encounterCards, loading] = useCardList(encounterCodes, 'encounter', tabooSetOverride);
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
