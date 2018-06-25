import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import loggerMiddleware from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import reducers from '../reducers';

export default function configureStore(initialState) {
  const offline = createOffline({
    ...offlineConfig,
    persist: false,
  });

  const persistConfig = {
    key: 'persist',
    storage: FilesystemStorage,
    // decks are handled separately.
    blacklist: ['decks', 'signedIn'],
  };

  const reducer = persistReducer(
    persistConfig,
    offline.enhanceReducer(reducers)
  );

  const store = createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(thunk, offline.middleware, loggerMiddleware),
      offline.enhanceStore)
  );
  const persistor = persistStore(store, { debug: true }, () => {
    console.log('PersistStore loaded.');
  });

  return { store, persistor };
}
