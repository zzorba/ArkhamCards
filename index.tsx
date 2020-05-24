import React from 'react';
import { forEach, groupBy, mapValues } from 'lodash';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import 'reflect-metadata';

import Database from 'data/Database';
import DatabaseContext, { PlayerCards } from 'data/DatabaseContext';
import { CardsMap } from 'data/Card';
import TabooSet from 'data/TabooSet';
import { PLAYER_CARDS_QUERY } from 'data/query';
import { registerScreens } from 'app/screens';
import configureStore from 'app/store';
import App from 'app/App';


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

const { store /* , persistor */ } = configureStore({});
const db = new Database();
db.reloadPlayerCards();
registerScreens(MyProvider, { redux: store, database: db });

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  app = new App(store);
});
