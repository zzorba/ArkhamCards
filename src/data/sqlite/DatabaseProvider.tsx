import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Database from './Database';
import DatabaseContext, { PlayerCards } from './DatabaseContext';
import { AppState, getLangChoice } from '@reducers';
import TabooSet from '../types/TabooSet';
import { loadBundledDatabaseIfNeeded } from './bundledDatabase';
import { CARD_SET_SCHEMA_VERSION, CARD_FETCH_SUCCESS, PACKS_AVAILABLE, Pack } from '@actions/types';

interface OwnProps {
  children: React.ReactNode;
}

interface ReduxProps {
  schemaVersion?: number;
  langChoice?: string;
}

interface DispatchProps {
  setSchemaVersion: (schemaVersion: number) => void;
  setCardCache: (cache: any, cardLang: string) => void;
  setPacks: (packs: Pack[], lang: string, lastModified: string | undefined) => void;
}

type Props = OwnProps & ReduxProps & DispatchProps;
let theDatabase: Database | null = null;
let databaseInitializing = false;

interface State {
  playerCardsByTaboo: {
    [tabooSet: string]: PlayerCards;
  };
  tabooSets: TabooSet[];
  initializing: boolean;
}
class DatabaseProvider extends React.Component<Props, State> {
  _mounted = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      playerCardsByTaboo: theDatabase?.playerState?.playerCards || {},
      tabooSets: theDatabase?.playerState?.tabooSets || [],
      initializing: theDatabase === null && !databaseInitializing,
    };
  }

  async componentDidMount() {
    this._mounted = true;

    if (theDatabase === null && !databaseInitializing) {
      databaseInitializing = true;

      // Create database first
      theDatabase = new Database(this.props.schemaVersion);

      // Then try to load bundled database into it
      try {
        const connection = await theDatabase.connectionP;
        const metadata = await loadBundledDatabaseIfNeeded(connection, this.props.langChoice);
        if (metadata) {
          // Database was loaded from bundled assets, set Redux state
          if (metadata.schemaVersion) {
            this.props.setSchemaVersion(metadata.schemaVersion);
          }
          if (metadata.cache) {
            this.props.setCardCache(metadata.cache, metadata.cardLang || 'en');
          }
          if (metadata.packs) {
            this.props.setPacks(metadata.packs, metadata.cardLang || 'en', metadata.packsLastModified);
          }
        }
      } catch (error) {
        console.error('Error loading bundled database:', error);
      }
      setTimeout(() => {
        if (theDatabase) {
          theDatabase.reloadPlayerCards();
        }
      }, Platform.OS === 'android' ? 500 : 25);

      if (this._mounted) {
        this.setState({ initializing: false });
      }
    }

    if (theDatabase) {
      theDatabase.addListener(this._playerCardsChanged);
      if (this._mounted) {
        this.setState({
          playerCardsByTaboo: theDatabase.playerState?.playerCards || {},
          tabooSets: theDatabase.playerState?.tabooSets || [],
        });
      }
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    theDatabase && theDatabase.removeListener(this._playerCardsChanged);
  }

  _playerCardsChanged = () => {
    if (theDatabase) {
      this.setState({
        playerCardsByTaboo: theDatabase.playerState?.playerCards || {},
        tabooSets: theDatabase.playerState?.tabooSets || [],
      });
    }
  };

  render() {
    if (this.state.initializing || theDatabase === null) {
      // Return null or a loading indicator while database is initializing
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
    langChoice: getLangChoice(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    setSchemaVersion: (schemaVersion: number) => {
      dispatch({
        type: CARD_SET_SCHEMA_VERSION,
        schemaVersion,
      });
    },
    setCardCache: (cache: any, cardLang: string) => {
      dispatch({
        type: CARD_FETCH_SUCCESS,
        cache,
        tabooCache: undefined,
        cardLang,
      });
    },
    setPacks: (packs: Pack[], lang: string, lastModified: string | undefined) => {
      dispatch({
        type: PACKS_AVAILABLE,
        packs,
        lang,
        lastModified,
        timestamp: new Date(),
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseProvider);