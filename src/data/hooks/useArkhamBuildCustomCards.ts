import { useContext, useEffect, useMemo, useState } from 'react';
import { keys } from 'lodash';

import { PlayerCardContext } from '@data/sqlite/PlayerCardContext';
import { Deck } from '@actions/types';
import { registerFanMadeContent } from '@data/fanMadeContent';

const EMPTY_CODES: string[] = [];

/**
 * Makes sure the fan-made cards a deck carries (arkham.build content, local
 * copies of it, other players' campaign decks) are in the card database.
 *
 * Returns the custom card codes once they have been written, or undefined while
 * the write is in flight. Callers should hold off on loading the deck's cards
 * until this resolves, otherwise the lookup can race the insert.
 */
export default function useArkhamBuildCustomCards(deck: Deck | undefined): string[] | undefined {
  const { storePlayerCards } = useContext(PlayerCardContext);
  const fanMadeContent = deck?.fan_made_content;
  const codes = useMemo(
    () => fanMadeContent ? keys(fanMadeContent.cards).sort() : EMPTY_CODES,
    [fanMadeContent]
  );
  const contentKey = codes.join(',');
  const [writtenKey, setWrittenKey] = useState<string>();

  useEffect(() => {
    if (!fanMadeContent || !codes.length) {
      return;
    }
    let canceled = false;
    registerFanMadeContent(fanMadeContent).then(cards => {
      storePlayerCards(cards);
      if (!canceled) {
        setWrittenKey(contentKey);
      }
    });
    return () => {
      canceled = true;
    };
  }, [storePlayerCards, fanMadeContent, codes, contentKey]);

  if (!codes.length) {
    return EMPTY_CODES;
  }
  return writtenKey === contentKey ? codes : undefined;
}
