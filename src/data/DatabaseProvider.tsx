import React from 'react';
import { Alert } from 'react-native';
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
      theDatabase.reloadPlayerCards();
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
        playerCardsByTaboo: theDatabase.state?.playerCards,
        tabooSets: theDatabase.state?.tabooSets || [],
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