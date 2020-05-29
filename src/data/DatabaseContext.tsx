import React from 'react';

import Database from './Database';
import Card, { CardsMap } from './Card';
import TabooSet from './TabooSet';

export interface PlayerCards {
  investigators: CardsMap;
  cards: CardsMap;
  weaknessCards: Card[];
}

export interface DatabaseContextType {
  db: Database;
  playerCardsByTaboo?: {
    [key: string]: PlayerCards;
  };
  tabooSets: TabooSet[];
}

export const DatabaseContext = React.createContext<DatabaseContextType>(
  // @ts-ignore TS2345
  {},
);

export default DatabaseContext;
