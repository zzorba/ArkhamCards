import React from 'react';
import Card, { CardsMap } from '@data/types/Card';


export interface PlayerCardContext {
  getExistingCards: (tabooSetId: number) => CardsMap;
  getPlayerCards: (codes: string[], tabooSetId: number) => Promise<CardsMap>;
  storePlayerCards: (cards: Card[]) => void;
}

export const PlayerCardContext = React.createContext<PlayerCardContext>(
  // @ts-ignore TS2345
  {}
);
