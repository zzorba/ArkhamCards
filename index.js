import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Navigation } from 'react-native-navigation';
import Crashes from 'appcenter-crashes';
import 'reflect-metadata';

import DatabaseProvider from './src/data/DatabaseProvider';
import { registerScreens } from './src/app/screens';
import configureStore from './src/app/store';
import StyleProvider from './src/styles/StyleProvider';
import ArkhamCardsAuthProvider from './src/lib/ArkhamCardsAuthProvider';
import App from './src/app/App';

function MyProvider({ store: { redux, persistor }, children}) {
  return (
    <ArkhamCardsAuthProvider>
      <AppearanceProvider>
        <Provider store={redux}>
          <PersistGate loading={null} persistor={persistor}>
            <DatabaseProvider>
              <StyleProvider>
                { children }
              </StyleProvider>
            </DatabaseProvider>
          </PersistGate>
        </Provider>
      </AppearanceProvider>
    </ArkhamCardsAuthProvider>
  );
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

