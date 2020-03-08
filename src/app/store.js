import { filter } from 'lodash';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import reducers from 'reducers';
// import Reactotron from './ReactotronConfig';

/**
 * How to refresh discarded offline tokens properly.
const discard = async (error, _action, _retries) => {
  if (!status in error) return false;

  if (error.status === 401) {
    const newAccessToken = await refreshAccessToken();
    localStorage.set('accessToken', newAccessToken);
    return newAccessToken == null;
  }

  return 400 <= error.status && error.status < 500;
}
*/

export default function configureStore(initialState) {
  const offline = createOffline({
    ...offlineConfig,
    persist: false,
  });

  const migrations = {
    0: (state) => {
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
    // These three have some transient fields and are handled separately.
    blacklist: ['cards', 'decks', 'packs', 'signedIn', 'filters'],
    migrate: createMigrate(migrations, { debug: false }),
  };

  const reducer = persistReducer(
    persistConfig,
    offline.enhanceReducer(reducers)
  );

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
  const persistor = persistStore(store, { debug: true }, () => {
    console.log('PersistStore loaded.');
  });

  return { store, persistor };
}
