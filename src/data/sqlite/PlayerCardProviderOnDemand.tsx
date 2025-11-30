import React, { useCallback, useContext } from 'react';
import { forEach } from 'lodash';

import { CardsMap } from '@data/types/Card';
import DatabaseContext from './DatabaseContext';
import { PlayerCardContext } from './PlayerCardContext';
import { where } from './query';

interface Props {
  children: React.ReactNode;
}

/**
 * PlayerCardProvider that fetches all cards on-demand from the database
 * without storing them in memory. Useful for testing performance.
 */
export function PlayerCardProviderOnDemand({ children }: Props) {
  const { db } = useContext(DatabaseContext);

  const storePlayerCards = useCallback(async() => {
    // No-op: we don't store anything
  }, []);

  const getExistingCards = useCallback((): CardsMap => {
    // Always return empty - no cards are stored
    return {};
  }, []);

  const getPlayerCards = useCallback(async(codes: string[], tabooSetId: number): Promise<CardsMap> => {
    // Always fetch from database
    const newCards = await db.getCards(where(`c.code IN (:...codes)`, { codes }), tabooSetId);

    const cards: CardsMap = {};
    forEach(newCards, card => {
      cards[card.code] = card;
    });

    return cards;
  }, [db]);

  return (
    <PlayerCardContext.Provider value={{ getExistingCards, getPlayerCards, storePlayerCards }}>
      { children }
    </PlayerCardContext.Provider>
  )
}
