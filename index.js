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

function MyProvider({ store: { redux, persistor, apollo }, children }) {
  return (
    <AppearanceProvider>
      <Provider store={redux}>
        <ArkhamCardsAuthProvider>
          <PersistGate loading={null} persistor={persistor}>
            <ApolloProvider client={apollo}>
              <LanguageProvider>
                <DatabaseProvider>
                  <StyleProvider>
                    { children }
                  </StyleProvider>
                </DatabaseProvider>
              </LanguageProvider>
            </ApolloProvider>
          </PersistGate>
        </ArkhamCardsAuthProvider>
      </Provider>
    </AppearanceProvider>
  );
}

if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
  database().setPersistenceEnabled(true);
}

const { store, persistor } = configureStore({});
const apolloClient = createApolloClient(store);

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
  registerScreens(MyProvider, { redux: store, persistor: persistor, apollo: apolloClient });
  app = new App(store);
});

