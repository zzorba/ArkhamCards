import React from 'react';
import Card, { CardsMap } from '@data/types/Card';


export interface PlayerCardContext {
  getPlayerCards: (codes: string[], tabooSetId: number) => Promise<CardsMap>;
}

export const PlayerCardContext = React.createContext<PlayerCardContext>(
  // @ts-ignore TS2345
  {}
);
