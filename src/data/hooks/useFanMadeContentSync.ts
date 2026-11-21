import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { forEach } from 'lodash';

import { AppState } from '@reducers';
import { addFanMadeContent, flushFanMadeContent, resetFanMadeContent } from '@data/fanMadeContent';

/**
 * Keeps the fan-made cards used by any of our decks in the card database, and
 * writes them again after a card sync replaces the card table.
 */
export default function useFanMadeContentSync() {
  const decks = useSelector((state: AppState) => state.decks.all);
  const cardCache = useSelector((state: AppState) => state.cards.cache);
  const lastCardCache = useRef(cardCache);

  useEffect(() => {
    forEach(decks, deck => addFanMadeContent(deck?.fan_made_content));
    if (lastCardCache.current !== cardCache) {
      lastCardCache.current = cardCache;
      resetFanMadeContent();
    } else {
      flushFanMadeContent();
    }
  }, [decks, cardCache]);
}
