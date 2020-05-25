import Realm from 'realm';
import React from 'react';
import { InteractionManager } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import 'reflect-metadata';

import Database from 'data/Database';
import DatabaseContext from 'data/DatabaseContext';
import { registerScreens } from 'app/screens';
import configureStore from 'app/store';
import App from 'app/App';
import { AppState } from 'reducers';

class MyProvider extends React.Component {
  _playerCardsChanged = () => {
    this.forceUpdate();
  };

  componentDidMount() {
    this.props.store.database.addListener(this._playerCardsChanged)
  }

  componentWillUnmount() {
    this.props.store.database.removeListener(this._playerCardsChanged);
  }

  render() {
    const {
      store: { database, redux },
      children,
    } = this.props;
    return (
      <DatabaseContext.Provider value={{
        db: database,
        playerCardsByTaboo: database.state?.playerCards,
        tabooSets: database.state?.tabooSets,
      }}>
        <Provider store={redux}>
          { children }
        </Provider>
      </DatabaseContext.Provider>
    );
  }
}

const { store /*, persistor */ } = configureStore({});

function cleanupRealm() {
  InteractionManager.runAfterInteractions(() => {
    try {
      const SCHEMA_VERSION = 63;
      const realm = new Realm({
        schema: [],
        schemaVersion: SCHEMA_VERSION,
        migration: (oldRealm, newRealm) => {
          if (oldRealm.schemaVersion < SCHEMA_VERSION) {
          }
        },
      });
      realm.write(() => {
        realm.deleteModel('Card');
        realm.deleteModel('EncounterSet');
        realm.deleteModel('FaqEntry');
        realm.deleteModel('TabooSet');
        realm.deleteAll();
      });
    } catch (e) {
      // DGAF
    }
  });
}

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  const schemaVersion = store.getState()?.cards?.schemaVersion;
  if (!schemaVersion) {
    cleanupRealm();
  }
  const db = new Database(schemaVersion);
  registerScreens(MyProvider, { redux: store, database: db });
  db.reloadPlayerCards();
  app = new App(store);
});
