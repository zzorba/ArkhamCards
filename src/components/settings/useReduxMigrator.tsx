import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

import { AppState } from '@reducers';
import { migrateReduxV1 } from './actions';
import { CURRENT_REDUX_VERSION } from '@reducers/settings';

export default function useReduxMigrator(): [boolean, boolean, () => void] {
  const [migrating, setMigrating] = useState(false);
  const dispatch: ThunkDispatch<AppState, unknown, Action<string>> = useDispatch();
  const version = useSelector((state: AppState) => state.settings.version || 0);
  const doMigrate = useCallback(async() => {
    setMigrating(true);
    await dispatch(migrateReduxV1());
  }, [setMigrating, dispatch]);
  return [version < CURRENT_REDUX_VERSION, migrating, doMigrate];
}
