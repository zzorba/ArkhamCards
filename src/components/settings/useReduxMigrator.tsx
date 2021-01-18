import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@reducers';
import { migrateRedux } from './actions';

const CURRENT_VERSION = 1;

export default function useReduxMigrator(): [boolean, boolean, () => void] {
  const [migrating, setMigrating] = useState(false);
  const dispatch = useDispatch();
  const version = useSelector((state: AppState) => state.settings.version || 0);
  const doMigrate = useCallback(() => {
    setMigrating(true);
    dispatch(migrateRedux());
  }, [setMigrating, dispatch]);
  return [version < CURRENT_VERSION, migrating, doMigrate];
}
