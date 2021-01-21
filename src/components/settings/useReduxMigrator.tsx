import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@reducers';
import { migrateRedux } from './actions';
import { CURRENT_REDUX_VERSION } from '@reducers/settings';

export default function useReduxMigrator(): [boolean, boolean, () => void] {
  const [migrating, setMigrating] = useState(false);
  const dispatch = useDispatch();
  const version = useSelector((state: AppState) => state.settings.version || 0);
  const doMigrate = useCallback(() => {
    setMigrating(true);
    dispatch(migrateRedux());
  }, [setMigrating, dispatch]);
  return [version < CURRENT_REDUX_VERSION, migrating, doMigrate];
}
