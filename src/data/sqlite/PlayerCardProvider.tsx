import React, { useCallback, useContext, useRef } from 'react';
import { Platform } from 'react-native';
import { forEach, flatMap, filter, find, uniq, map, chunk } from 'lodash';

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
  const storePlayerCards = useCallback(async(newCards: Card[]) => {
    forEach(newCards, card => {
      const tabooSetId = card.taboo_set_id;
      if (tabooSetId === null || tabooSetId === undefined) {
        // It's a generic, so every taboo set (we care about) gets this card.
        forEach(db.globalLoadedCards, (cardSet) => {
          if (cardSet) {
            cardSet[card.code] = card;
          }
        })
      } else {
        // It's a taboo one
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
        knownCards[card.code] = card;
      }
    });
  }, [db]);
  const getExistingCards = useCallback((tabooSetId: number): CardsMap => {
    return db.globalLoadedCards[tabooSetId] || {};
  }, [db]);
  const getPlayerCards = useCallback(async(codes: string[], tabooSetId: number, store: boolean): Promise<CardsMap> => {
    if (store && !db.globalLoadedCards[tabooSetId]) {
      const newCards: CardsMap = {};
      forEach(db.globalLoadedCards[0], card => {
        if (card && card.taboo_set_id === null) {
          // Keep the null ones, which apply to all versions of the card.
          newCards[card.code] = card;
        }
      })
      db.globalLoadedCards[tabooSetId] = newCards;
    }
    const knownCards = store ? db.globalLoadedCards[tabooSetId] ?? {} :
      {
        ...db.globalLoadedCards[tabooSetId] ?? {},
      };
    const pending = store ? new Set(flatMap(locallyFetched.current, c => c.tabooSetId === tabooSetId ? c.codes : [])) : new Set([]);
    const unknownCodes = filter(codes, code => {
      if (knownCards[code]) {
        return false;
      }
      return true;
    }) ?? [];
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
      const chunks = true || Platform.OS === 'ios' ? [toFetch] : chunk(toFetch, 50)
      const newCardsP = Promise.all(
        map(chunks, codes => db.getCards(where(`c.code IN (:...codes)`, { codes }), tabooSetId))
      ).then(result => flatMap(result, x => x));
      if (store) {
        locallyFetched.current.push({ codes: toFetch, tabooSetId, cardsP: newCardsP });
      }

      const newCards = await newCardsP;
      forEach(newCards, card => {
        if (card.taboo_set_id === null) {
          if (store) {
            // It's a generic, so every taboo set (we care about) gets this card.
            forEach(db.globalLoadedCards, (cardSet) => {
              if (cardSet) {
                cardSet[card.code] = card;
              }
            });
          }
          knownCards[card.code] = card;
        } else {
          // It's taboo specific, so just the one.
          knownCards[card.code] = card;
        }
      });
      if (store) {
        locallyFetched.current = filter(locallyFetched.current, c => c.cardsP !== newCardsP);
      }
    }
    const uniqWaits = uniq(toWaitFor) ?? [];
    for (let i = 0; i < uniqWaits.length; i++) {
      await uniqWaits[i];
    }
    const cards: CardsMap = {};
    forEach(codes, code => {
      cards[code] = knownCards[code];
    });
    return cards;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, db.globalLoadedCards]);
  return (
    <PlayerCardContext.Provider value={{ getExistingCards, getPlayerCards, storePlayerCards }}>
      { children }
    </PlayerCardContext.Provider>
  )
}