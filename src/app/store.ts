import { filter } from 'lodash';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import reducers, { AppState } from '@reducers';
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

export default function configureStore(initialState: AppState) {
  const offline = createOffline({
    ...offlineConfig,
    // @ts-ignore
    persist: false,
  });

  const migrations = {
    0: (state: any) => {
      const newState = Object.assign({}, state);
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
    // These three have some transient fields and are handled separately.
    blacklist: ['cards', 'decks', 'packs', 'signedIn', 'filters'],
    migrate: createMigrate(migrations, { debug: false }),
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
