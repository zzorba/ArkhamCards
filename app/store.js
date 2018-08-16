import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import loggerMiddleware from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from '../reducers';

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

  const persistConfig = {
    key: 'persist',
    storage,
    // These three have some transient fields and are handled separately.
    blacklist: ['cards', 'decks', 'packs', 'signedIn'],
  };

  const reducer = persistReducer(
    persistConfig,
    offline.enhanceReducer(reducers)
  );

  const store = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(thunk, offline.middleware, (__DEV__ && loggerMiddleware)),
      offline.enhanceStore)
  );
  const persistor = persistStore(store, { debug: true }, () => {
    console.log('PersistStore loaded.');
  });

  return { store, persistor };
}
