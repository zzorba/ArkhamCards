import React from 'react';
import { AppearanceProvider, Appearance } from 'react-native-appearance';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Navigation } from 'react-native-navigation';
import 'reflect-metadata';

import DatabaseProvider from './src/data/DatabaseProvider';
import { registerScreens } from './src/app/screens';
import configureStore from './src/app/store';
import App from './src/app/App';

const theme = {
  Button: {
    raised: true,
    disabledTitleStyle: {
      color: '#444444',
    },
    disabledStyle: {
      backgroundColor: '#dddddd',
    },
  },
};

const darkTheme = {
  Button: {
    raised: true,
    disabledTitleStyle: {
      color: '#bbbbbb',
    },
    disabledStyle: {
      backgroundColor: '#111111',
    },
  },

};

function MyProvider({ store: { redux, persistor }, children}) {
  return (
    <AppearanceProvider>
      <Provider store={redux}>
        <PersistGate loading={null} persistor={persistor}>
          <DatabaseProvider>
            <ThemeProvider theme={Appearance.getColorScheme() === 'dark' ? darkTheme : theme}>
              { children }
            </ThemeProvider>
          </DatabaseProvider>
        </PersistGate>
      </Provider>
    </AppearanceProvider>
  );
}

const { store, persistor } = configureStore({});

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  registerScreens(MyProvider, { redux: store, persistor: persistor });
  app = new App(store);
});
