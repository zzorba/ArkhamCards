
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache } from 'apollo-cache-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/client';
import { Navigation } from 'react-native-navigation';
import Crashes from 'appcenter-crashes';
import database from '@react-native-firebase/database';
import 'react-native-sqlite-storage';
import 'react-native-gesture-handler';
import 'reflect-metadata';

import DatabaseProvider from './src/data/sqlite/DatabaseProvider';
import { registerScreens } from './src/app/screens';
import configureStore from './src/app/store';
import StyleProvider from './src/styles/StyleProvider';
import LanguageProvider from './src/lib/i18n/LanguageProvider';
import ArkhamCardsAuthProvider from './src/lib/ArkhamCardsAuthProvider';
import App from './src/app/App';
import { ENABLE_ARKHAM_CARDS_ACCOUNT } from './src/app_constants';
import createApolloClient from './src/data/apollo/createApolloClient';
import ApolloClientContext from './src/data/apollo/ApolloClientContext';

function MyProvider({ store: { redux, persistor, apollo, anonApollo }, children }) {
  return (
    <AppearanceProvider>
      <Provider store={redux}>
        <PersistGate loading={null} persistor={persistor}>
          <ArkhamCardsAuthProvider>
            <ApolloProvider client={apollo}>
              <ApolloClientContext.Provider value={{ client: apollo, anonClient: anonApollo }}>
                <LanguageProvider>
                  <DatabaseProvider>
                    <StyleProvider>
                      { children }
                    </StyleProvider>
                  </DatabaseProvider>
                </LanguageProvider>
              </ApolloClientContext.Provider>
            </ApolloProvider>
          </ArkhamCardsAuthProvider>
        </PersistGate>
      </Provider>
    </AppearanceProvider>
  );
}

if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
  database().setPersistenceEnabled(true);

}

const { store, persistor } = configureStore({});
const [apolloClient, anonClient] = createApolloClient(store);

persistCache({
  cache: apolloClient.cache,
  storage: AsyncStorage,
});

function shouldProcess() {
  return !__DEV__;
}
Crashes.setListener({
  shouldProcess,
});

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  // SQLite.enablePromise(true);
  registerScreens(MyProvider, { redux: store, persistor: persistor, apollo: apolloClient, anonApollo: anonClient });
  app = new App(store);
});

