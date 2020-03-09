import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { RealmProvider } from 'react-native-realm';
import { Navigation } from 'react-native-navigation';

import { registerScreens } from './src/app/screens';
import configureStore from './src/app/store';
import App from './src/app/App';
import realm from './src/data';

class MyProvider extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <RealmProvider realm={realm}>
        <Provider store={this.props.store}>
          { this.props.children }
        </Provider>
      </RealmProvider>
    );
  }
}

const { store /* , persistor */ } = configureStore({});
registerScreens(MyProvider, store);

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  app = new App(store);
});
