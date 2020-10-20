import React from 'react';
import { Alert, InteractionManager, Platform } from 'react-native';
import { connect } from 'react-redux';

import Database from './Database';
import DatabaseContext from './DatabaseContext';
import { AppState } from '@reducers';

interface OwnProps {
  children: React.ReactNode;
}

interface ReduxProps {
  schemaVersion?: number;
}

type Props = OwnProps & ReduxProps;
let theDatabase: Database | null = null;

class DatabaseProvider extends React.Component<Props> {
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
  }

  componentDidMount() {
    theDatabase && theDatabase.addListener(this._playerCardsChanged);
  }

  componentWillUnmount() {
    theDatabase && theDatabase.removeListener(this._playerCardsChanged);
  }

  _playerCardsChanged = () => {
    this.forceUpdate();
  };

  render() {
    if (theDatabase === null) {
      Alert.alert('Database is null for some reason');
      return null;
    }
    return (
      <DatabaseContext.Provider value={{
        db: theDatabase,
        playerCardsByTaboo: theDatabase.playerState?.playerCards,
        investigatorCardsByTaboo: theDatabase.investigatorState,
        tabooSets: theDatabase.playerState?.tabooSets || [],
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