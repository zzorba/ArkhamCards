import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Navigation } from 'react-native-navigation';
import Crashes, { ErrorReport } from 'appcenter-crashes';
import 'reflect-metadata';

import DatabaseProvider from './src/data/DatabaseProvider';
import { registerScreens } from './src/app/screens';
import { registerNarrationPlayer } from './src/app/narrationPlayer';
import configureStore from './src/app/store';
import App, { SHOW_DISSONANT_VOICES } from './src/app/App';
import StyleProvider from './src/styles/StyleProvider';


function MyProvider({ store: { redux, persistor }, children}) {
  return (
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
  if (SHOW_DISSONANT_VOICES) {
    registerNarrationPlayer();
  }
  app = new App(store);
});
