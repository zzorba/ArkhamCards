import React, { useCallback, useContext, useMemo, useRef } from 'react';
import { forEach } from 'lodash';

import Card, { CardsMap } from '@data/types/Card';
import DatabaseContext from './DatabaseContext';
import { PlayerCardContext } from './PlayerCardContext';
import { useAllInvestigatorSets } from '@data/hooks';

interface Props {
  children: React.ReactNode;
}

/**
 * PlayerCardProvider that caches cards in memory for the lifetime of the component.
 * Useful for screens like DeckDetailView where cards are frequently accessed.
 */
export function PlayerCardProviderCached({ children }: Props) {
  const { db } = useContext(DatabaseContext);
  const [investigatorSets] = useAllInvestigatorSets();

  // Cache cards by taboo set ID
  const cardCache = useRef<{ [tabooSetId: number]: CardsMap }>({});

  const storePlayerCards = useCallback(async(newCards: Card[]) => {
    forEach(newCards, card => {
      const tabooSetId = card.taboo_set_id ?? 0;
      if (!cardCache.current[tabooSetId]) {
        cardCache.current[tabooSetId] = {};
      }
      cardCache.current[tabooSetId][card.code] = card;

      // If this is a non-taboo card (null/undefined taboo_set_id), also store in other taboo sets
      if (card.taboo_set_id === null || card.taboo_set_id === undefined) {
        forEach(cardCache.current, (cardSet, tsId) => {
          if (cardSet && tsId !== '0') {
            cardSet[card.code] = card;
          }
        });
      }
    });
  }, []);

  const getExistingCards = useCallback((tabooSetId: number): CardsMap => {
    return cardCache.current[tabooSetId] || {};
  }, []);

  const getPlayerCards = useCallback(async(codes: string[], tabooSetId: number): Promise<CardsMap> => {
    if (!codes.length) {
      return {};
    }

    // Initialize cache for this taboo set if needed
    if (!cardCache.current[tabooSetId]) {
      cardCache.current[tabooSetId] = {};
      // Copy over any non-taboo cards from taboo set 0
      if (cardCache.current[0]) {
        forEach(cardCache.current[0], card => {
          if (card && (card.taboo_set_id === null || card.taboo_set_id === undefined)) {
            cardCache.current[tabooSetId][card.code] = card;
          }
        });
      }
    }

    const knownCards = cardCache.current[tabooSetId];
    const missingCodes = codes.filter(code => !knownCards[code]);

    // Fetch missing cards
    if (missingCodes.length > 0) {
      const newCards = await db.getCardsByCodes(missingCodes, tabooSetId);

      forEach(newCards, card => {
        const effectiveTabooSetId = card.taboo_set_id ?? 0;

        // Store in the requested taboo set
        knownCards[card.code] = card;

        // If this is a non-taboo card, also cache it in other taboo sets
        if (card.taboo_set_id === null || card.taboo_set_id === undefined) {
          forEach(cardCache.current, (cardSet) => {
            if (cardSet) {
              cardSet[card.code] = card;
            }
          });
        } else {
          // Store taboo-specific cards in their specific cache
          if (!cardCache.current[effectiveTabooSetId]) {
            cardCache.current[effectiveTabooSetId] = {};
          }
          cardCache.current[effectiveTabooSetId][card.code] = card;
        }
      });
    }

    // Return only requested cards
    const result: CardsMap = {};
    forEach(codes, code => {
      if (knownCards[code]) {
        result[code] = knownCards[code];
      }
    });

    return result;
  }, [db]);

  const context = useMemo(() => ({
    investigatorSets,
    getExistingCards,
    getPlayerCards,
    storePlayerCards
  }), [investigatorSets, getExistingCards, getPlayerCards, storePlayerCards]);

  return (
    <PlayerCardContext.Provider value={context}>
      {children}
    </PlayerCardContext.Provider>
  );
}
