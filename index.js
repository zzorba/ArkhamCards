import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { AppearanceProvider } from 'react-native-appearance';
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Navigation } from 'react-native-navigation';
import Crashes from 'appcenter-crashes';
import 'reflect-metadata';

import DatabaseProvider from './src/data/DatabaseProvider';
import { registerScreens } from './src/app/screens';
import configureStore from './src/app/store';
import StyleProvider from './src/styles/StyleProvider';
import LanguageProvider from './src/lib/i18n/LanguageProvider';
import ArkhamCardsAuthProvider from './src/lib/ArkhamCardsAuthProvider';
import App from './src/app/App';
import { ENABLE_ARKHAM_CARDS_ACCOUNT } from '@app_constants';
import { initParseObjects } from '@data/parse/types';
import createApolloClient, { PARSE_BASE_SERVER, PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY } from '@data/createApolloClient';

function MyProvider({ store: { redux, persistor, apollo }, children}) {
  return (
    <ArkhamCardsAuthProvider>
      <AppearanceProvider>
        <Provider store={redux}>
          <ApolloProvider client={apollo}>
            <PersistGate loading={null} persistor={persistor}>
              <LanguageProvider>
                <DatabaseProvider>
                  <StyleProvider>
                    { children }
                  </StyleProvider>
                </DatabaseProvider>
              </LanguageProvider>
            </PersistGate>
          </ApolloProvider>
        </Provider>
      </AppearanceProvider>
    </ArkhamCardsAuthProvider>
  );
}

if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
  Parse.setAsyncStorage(AsyncStorage);
  Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
  // Parse.serverURL = 'https://parseapi.back4app.com/';
  Parse.serverURL = `${PARSE_BASE_SERVER}/parse`;
  Parse.User.enableUnsafeCurrentUser();
  initParseObjects();
}

const { store, persistor } = configureStore({});
const apolloClient = createApolloClient(store);

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

