import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import 'reflect-metadata';

import DatabaseContext from './src/data/entities/DatabaseContext';
import Database from './src/data/entities/Database';
import { registerScreens } from './src/app/screens';
import configureStore from './src/app/store';
import App from './src/app/App';

class MyProvider extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <DatabaseContext.Provider value={{ db: this.props.store.db }}>
        <Provider store={this.props.store.redux}>
          { this.props.children }
        </Provider>
      </DatabaseContext.Provider>
    );
  }
}

const { store /* , persistor */ } = configureStore({});
const db = new Database();
registerScreens(MyProvider, { redux: store, database: db });

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  app = new App(store);
});
