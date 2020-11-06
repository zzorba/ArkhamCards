import Card from '@data/Card';
import { useMemo } from 'react';
import useCardList from './useCardList';

export default function useSingleCard(code: string, type: 'player' | 'encounter'): [Card | undefined, boolean] {
  const cardList = useMemo(() => [code], [code]);
  const [cards, loading] = useCardList(cardList, type);
  if (!cards || !cards.length || !cards[0]) {
    return [undefined, loading];
  }
  return [cards[0], loading];
}
