import React, { useCallback, useContext, useRef } from 'react';
import { forEach, flatMap, filter, find, uniq } from 'lodash';

import Card, { CardsMap } from '@data/types/Card';
import DatabaseContext from './DatabaseContext';
import { PlayerCardContext } from './PlayerCardContext';
import { where } from './query';

interface Props {
  children: React.ReactNode;
}

interface PendingCardRequest {
  codes: string[];
  tabooSetId: number;
  cardsP: Promise<Card[]>;
}

export function PlayerCardProvider({ children }: Props) {
  const { db } = useContext(DatabaseContext);
  const locallyFetched = useRef<PendingCardRequest[]>([]);
  const getPlayerCards = useCallback(async(codes: string[], tabooSetId: number): Promise<CardsMap> => {
    if (!db.globalLoadedCards[tabooSetId]) {
      const newCards: CardsMap = {};
      forEach(db.globalLoadedCards[0], card => {
        if (card && card.taboo_set_id === null) {
          // Keep the null ones, which apply to all versions of the card.
          newCards[card.code] = card;
        }
      })
      db.globalLoadedCards[tabooSetId] = newCards;
    }
    const knownCards = db.globalLoadedCards[tabooSetId] || {};
    const pending = new Set(flatMap(locallyFetched.current, c => c.tabooSetId === tabooSetId ? c.codes : []));
    const unknownCodes = filter(codes, code => {
      if (knownCards[code]) {
        return false;
      }
      return true;
    });
    const toWaitFor: Promise<Card[]>[] = [];
    const toFetch: string[] = [];
    for (let i = 0; i < unknownCodes.length; i++) {
      const code = unknownCodes[i];
      if (pending.has(code)) {
        const req = find(locallyFetched.current, c => c.tabooSetId === tabooSetId && !!find(c.codes, card => card === code));
        if (req) {
          toWaitFor.push(req.cardsP);
          continue;
        }
      }
      toFetch.push(code);
    }
    if (toFetch.length) {
      const newCardsP = db.getCards(where(`c.code IN (:...codes)`, { codes: toFetch }), tabooSetId);
      locallyFetched.current.push({ codes: toFetch, tabooSetId, cardsP: newCardsP });

      const newCards = await newCardsP;
      forEach(newCards, card => {
        if (card.taboo_set_id === null) {
          // It's a generic, so every taboo set (we care about) gets this card.
          forEach(db.globalLoadedCards, (cardSet) => {
            if (cardSet) {
              cardSet[card.code] = card;
            }
          })
        } else {
          // It's taboo specific, so just the one.
          knownCards[card.code] = card;
        }
      });
      // tslint:disable-next-line: strict-comparisons
      locallyFetched.current = filter(locallyFetched.current, c => c.cardsP !== newCardsP);
    }
    const uniqWaits = uniq(toWaitFor);
    for (let i = 0; i < uniqWaits.length; i++) {
      await uniqWaits[i];
    }
    const cards: CardsMap = {};
    forEach(codes, code => {
      cards[code] = knownCards[code];
    });
    return cards;
  }, [db, db.globalLoadedCards]);
  return (
    <PlayerCardContext.Provider value={{ getPlayerCards }}>
      { children }
    </PlayerCardContext.Provider>
  )
}