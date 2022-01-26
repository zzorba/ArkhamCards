import React from 'react';

import Database from './Database';
import { CardsMap } from '../types/Card';
import TabooSet from '../types/TabooSet';

export interface PlayerCards {
  weaknessCards: CardsMap;
}

export interface DatabaseContextType {
  db: Database;
  playerCardsByTaboo?: {
    [key: string]: PlayerCards;
  };
  investigatorCardsByTaboo?: {
    [key: string]: CardsMap;
  };
  tabooSets: TabooSet[];
}

export const DatabaseContext = React.createContext<DatabaseContextType>(
  // @ts-ignore TS2345
  {},
);

export default DatabaseContext;
