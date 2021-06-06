import React from 'react';
import { Alert, Platform } from 'react-native';
import { connect } from 'react-redux';

import Database from './Database';
import DatabaseContext, { PlayerCards } from './DatabaseContext';
import { AppState } from '@reducers';
import { CardsMap } from '../types/Card';
import TabooSet from '../types/TabooSet';

interface OwnProps {
  children: React.ReactNode;
}

interface ReduxProps {
  schemaVersion?: number;
}

type Props = OwnProps & ReduxProps;
let theDatabase: Database | null = null;

interface State {
  investigatorCardsByTaboo: {
    [tabooSet: string]: CardsMap;
  };
  playerCardsByTaboo: {
    [tabooSet: string]: PlayerCards;
  };
  tabooSets: TabooSet[];
}
class DatabaseProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    if (theDatabase === null) {
      theDatabase = new Database(props.schemaVersion);
      setTimeout(() => {
        if (theDatabase) {
          theDatabase.reloadPlayerCards();
        }
      }, Platform.OS === 'android' ? 500 : 25);
    }
    theDatabase.addListener(this._playerCardsChanged);
    this.state = {
      investigatorCardsByTaboo: theDatabase.investigatorState || {},
      playerCardsByTaboo: theDatabase.playerState?.playerCards || {},
      tabooSets: theDatabase.playerState?.tabooSets || [],
    };
  }

  componentWillUnmount() {
    theDatabase && theDatabase.removeListener(this._playerCardsChanged);
  }

  _playerCardsChanged = () => {
    if (theDatabase) {
      this.setState({
        investigatorCardsByTaboo: theDatabase.investigatorState || {},
        playerCardsByTaboo: theDatabase.playerState?.playerCards || {},
        tabooSets: theDatabase.playerState?.tabooSets || [],
      });
    }
  };

  render() {
    if (theDatabase === null) {
      Alert.alert('Database is null for some reason');
      return null;
    }
    return (
      <DatabaseContext.Provider value={{
        ...this.state,
        db: theDatabase,
      }}>
        { this.props.children }
      </DatabaseContext.Provider>
    );
  }
}


function mapStateToProps(state: AppState): ReduxProps {
  return {
    schemaVersion: state.cards.schemaVersion,
  };
}

export default connect(mapStateToProps)(DatabaseProvider);