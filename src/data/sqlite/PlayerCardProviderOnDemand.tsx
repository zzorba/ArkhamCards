import React, { useCallback, useContext, useMemo } from 'react';
import { forEach } from 'lodash';

import { CardsMap } from '@data/types/Card';
import DatabaseContext from './DatabaseContext';
import { PlayerCardContext } from './PlayerCardContext';
import { useAllInvestigatorSets } from '@data/hooks';

interface Props {
  children: React.ReactNode;
}

/**
 * PlayerCardProvider that fetches all cards on-demand from the database
 * without storing them in memory. Useful for testing performance.
 */
export function PlayerCardProviderOnDemand({ children }: Props) {
  const { db } = useContext(DatabaseContext);
  const [investigatorSets] = useAllInvestigatorSets();

  const storePlayerCards = useCallback(async() => {
    // No-op: we don't store anything
  }, []);

  const getExistingCards = useCallback((): CardsMap => {
    // Always return empty - no cards are stored
    return {};
  }, []);


  const getPlayerCards = useCallback(async(codes: string[], tabooSetId: number): Promise<CardsMap> => {
    if (!codes.length) {
      return {};
    }
    // Always fetch from database
    const newCards = await db.getCardsByCodes(codes, tabooSetId);

    const cards: CardsMap = {};
    forEach(newCards, card => {
      cards[card.code] = card;
    });

    return cards;
  }, [db]);

  const context = useMemo(() => ({ investigatorSets, getExistingCards, getPlayerCards, storePlayerCards }), [investigatorSets, getExistingCards, getPlayerCards, storePlayerCards]);
  return (
    <PlayerCardContext.Provider value={context}>
      { children }
    </PlayerCardContext.Provider>
  )
}
