import { useContext, useEffect, useRef, useState } from 'react';

import DatabaseContext from '@data/sqlite/DatabaseContext';
import Database from '@data/sqlite/Database';
import { useCounter } from './hooks';
import { useSelector } from 'react-redux';
import { AppState } from '@reducers';

export default function useDbData<T>(fetch: (db: Database) => Promise<T>): T | undefined {
  const { db } = useContext(DatabaseContext);
  const loading = useSelector((state: AppState) => state.packs.loading || state.cards.loading);

  const [data, setData] = useState<T | undefined>();
  const [refreshCounter, incRefreshCounter] = useCounter(0, {});
  const listener = useRef({
    afterInsert: incRefreshCounter,
    afterUpdate: incRefreshCounter,
  });

  useEffect(() => {
    const theListener = listener.current;
    db.addSubscriber(theListener);
    return function cleanup() {
      db.removeSubscriber(theListener);
    };
  }, [db, listener]);
  useEffect(() => {
    if (!loading) {
      let canceled = false;
      fetch(db).then((data: T) => {
        if (!canceled) {
          setData(data);
        }
      });
      return function cleanup() {
        canceled = true;
      };
    }
  }, [loading, fetch, db, setData, refreshCounter]);
  return data;
}
