import React from 'react';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import 'reflect-metadata';

import Database from 'data/Database';
import DatabaseContext from 'data/DatabaseContext';
import { registerScreens } from 'app/screens';
import configureStore from 'app/store';
import App from 'app/App';
import { AppState } from 'reducers';


interface Props {
  store: {
    database: Database;
    redux: any;
  };
}

class MyProvider extends React.Component<Props> {
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

const { store /*, persistor */ } = configureStore({} as AppState);

/* eslint-disable @typescript-eslint/no-unused-vars */
let app: App | null = null;
Navigation.events().registerAppLaunchedListener(() => {
  const db = new Database(store.getState().cards.schemaVersion);
  registerScreens(MyProvider, { redux: store, database: db });
  db.reloadPlayerCards();
  app = new App(store);
});
