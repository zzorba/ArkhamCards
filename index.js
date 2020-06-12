import React from 'react';
import { InteractionManager } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Navigation } from 'react-native-navigation';
import 'reflect-metadata';

import DatabaseProvider from 'data/DatabaseProvider';
import { registerScreens } from 'app/screens';
import configureStore from 'app/store';
import App from 'app/App';

class MyProvider extends React.Component {
  render() {
    const {
      store: { redux, persistor },
      children,
    } = this.props;
    return (
      <Provider store={redux}>
        <PersistGate loading={null} persistor={persistor}>
          <DatabaseProvider>
            { children }
          </DatabaseProvider>
        </PersistGate>
      </Provider>
    );
  }
}

const { store, persistor } = configureStore({});

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  registerScreens(MyProvider, { redux: store, persistor: persistor });
  app = new App(store);
});
