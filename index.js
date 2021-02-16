import React from 'react';
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

function MyProvider({ store: { redux, persistor }, children}) {
  return (
    <ArkhamCardsAuthProvider>
      <AppearanceProvider>
        <Provider store={redux}>
          <PersistGate loading={null} persistor={persistor}>
            <LanguageProvider>
              <DatabaseProvider>
                <StyleProvider>
                  { children }
                </StyleProvider>
              </DatabaseProvider>
            </LanguageProvider>
          </PersistGate>
        </Provider>
      </AppearanceProvider>
    </ArkhamCardsAuthProvider>
  );
}

if (ENABLE_ARKHAM_CARDS_ACCOUNT) {
  Parse.setAsyncStorage(AsyncStorage);
  Parse.initialize('d3LMO8279uM3e6mTjwXLLWrUxYums3aqrxsNgS39', 'Gw0kvpxOqh2CBBk1vnIWmfmzDPcDmF99BdJc6mvf');
  // Parse.serverURL = 'https://parseapi.back4app.com/';
  Parse.serverURL = 'http://localhost:1337/parse';
  Parse.User.enableUnsafeCurrentUser();
  initParseObjects();
}

const { store, persistor } = configureStore({});

function shouldProcess() {
  return !__DEV__;
}
Crashes.setListener({
  shouldProcess,
});

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  registerScreens(MyProvider, { redux: store, persistor: persistor });
  app = new App(store);
});

