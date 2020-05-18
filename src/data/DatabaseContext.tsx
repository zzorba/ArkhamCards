import React from 'react';

import Database from './Database';

export interface DatabaseContextType {
  db: Database;
}

export const DatabaseContext = React.createContext<DatabaseContextType>(
  // @ts-ignore TS2345
  {},
);

export default DatabaseContext;
