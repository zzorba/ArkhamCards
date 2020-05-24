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

interface State {
  tabooSets: TabooSet[];
  playerCards: {
    [key: string]: PlayerCards;
  };
}

class MyProvider extends React.Component<Props, State> {


  constructor(props: Props) {
    super(props);

    this.state = {
      tabooSets: [],
      playerCards: {},
    };
    this._syncPlayerCards();
  }

  _syncPlayerCards = async () => {
    const {
      store: {
        database,
      },
    } = this.props;
    const tabooSets = await (await database.tabooSets()).createQueryBuilder().getMany();
    const qb = await database.cardsQuery();
    const cards = await qb.where(PLAYER_CARDS_QUERY).getMany();
    const playerCards: {
      [key: string]: PlayerCards
    } = {};
    const cardsByTaboo = mapValues(
      groupBy(cards, card => card.taboo_set_id || 0),
      allCards => {
        const investigators: CardsMap = {};
        const cards: CardsMap = {};
        forEach(allCards, card => {
          cards[card.code] = card;
          if (card.type_code === 'investigator') {
            investigators[card.code] = card;
          }
        });
        return {
          investigators,
          cards,
        };
      }
    );
    forEach(cardsByTaboo, (tabooSet, tabooSetId) => {
      if (tabooSetId === '0') {
        playerCards[tabooSetId] = tabooSet;
      } else {
        const baseTaboos = cardsByTaboo['0'];
        playerCards[tabooSetId] = {
          investigators: {
            ...baseTaboos.investigators,
            ...tabooSet.investigators,
          },
          cards: {
            ...baseTaboos.cards,
            ...tabooSet.cards,
          },
        };
      }
    });
    this.setState({
      playerCards,
      tabooSets,
    });
  };

  render() {
    const {
      store: { database, redux },
      children,
    } = this.props;
    const {
      playerCards,
      tabooSets,
    } = this.state;
    return (
      <DatabaseContext.Provider value={{
        db: database,
        playerCardsByTaboo: playerCards,
        tabooSets,
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
registerScreens(MyProvider, { redux: store, database: db });

/* eslint-disable @typescript-eslint/no-unused-vars */
let app = null;
Navigation.events().registerAppLaunchedListener(() => {
  app = new App(store);
});
