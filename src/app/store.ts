import { filter } from 'lodash';
import { createStore, applyMiddleware, compose } from 'redux';
import { Platform } from 'react-native';
import thunk from 'redux-thunk';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import reducers, { AppState } from '@reducers';
import { useDispatch } from 'react-redux';

// import Reactotron from './ReactotronConfig';

/**
 * How to refresh discarded offline tokens properly.
const discard = async(error, _action, _retries) => {
  if (!status in error) return false;

  if (error.status === 401) {
    const newAccessToken = await refreshAccessToken();
    localStorage.set('accessToken', newAccessToken);
    return newAccessToken == null;
  }

  return 400 <= error.status && error.status < 500;
}
*/

function configureStore(initialState: AppState) {
  const offline = createOffline({
    ...offlineConfig,
    // @ts-ignore
    persist: false,
  });

  const migrations = {
    0: (state: any) => {
      const newState = { ...state };
      if (newState.weaknesses) {
        delete newState.weaknesses;
      }
      return newState;
    },
  };

  const persistConfig = {
    key: 'persist',
    version: 0,
    storage: AsyncStorage,
    // Disable timeout since hitting the timeout causes it to reset all data?
    // WHY is that the default behavior?!?!?
    timeout: 0,
    throttle: Platform.OS === 'android' ? 1000 : undefined,
    // These all have some transient fields and are handled separately.
    blacklist: [
      'cards', 'signedIn', 'filters', 'deckEdits', 'packs', 'dissonantVoices',
      // These are replacement fields.
      'guides_2', 'campaigns_2', 'decks_2',
      // These are the legacy fields (campaigns as well, but it didn't have its own persistor)
      'decks', 'guides'],
    migrate: createMigrate(migrations, { debug: true }),
  };

  const reducer = persistReducer(
    persistConfig,
    offline.enhanceReducer(reducers)
  );

  // @ts-ignore
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(
      // Reactotron.createEnhancer(),
      applyMiddleware(
        ...filter([
          thunk,
          offline.middleware,
        ], Boolean)),
      offline.enhanceStore)
  );
  const persistor = persistStore(store, null, () => {
    console.log('PersistStore loaded.');
  });

  return { store, persistor };
}
export const { store, persistor } = configureStore({} as any);
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
