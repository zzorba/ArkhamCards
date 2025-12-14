import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Database from './Database';
import DatabaseContext, { PlayerCards } from './DatabaseContext';
import { AppState, getLangChoice } from '@reducers';
import TabooSet from '../types/TabooSet';
import { loadBundledDatabaseIfNeeded } from './bundledDatabase';
import { CARD_SET_SCHEMA_VERSION, CARD_FETCH_SUCCESS, PACKS_AVAILABLE } from '@actions/types';

interface Props {
  children: React.ReactNode;
}
let theDatabase: Database | null = null;
let databaseInitializing = false;

function DatabaseProvider({ children }: Props) {
  const schemaVersion = useSelector((state: AppState) => state.cards.schemaVersion);
  const langChoice = useSelector((state: AppState) => getLangChoice(state));
  const dispatch = useDispatch();

  const [playerCardsByTaboo, setPlayerCardsByTaboo] = useState<{ [tabooSet: string]: PlayerCards }>(
    theDatabase?.playerState?.playerCards || {}
  );
  const [tabooSets, setTabooSets] = useState<TabooSet[]>(
    theDatabase?.playerState?.tabooSets || []
  );
  const [initializing, setInitializing] = useState(
    theDatabase === null && !databaseInitializing
  );

  const mountedRef = useRef(true);

  const playerCardsChanged = useCallback(() => {
    if (theDatabase) {
      setPlayerCardsByTaboo(theDatabase.playerState?.playerCards || {});
      setTabooSets(theDatabase.playerState?.tabooSets || []);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const initializeDatabase = async() => {
      if (theDatabase === null && !databaseInitializing) {
        databaseInitializing = true;

        // Create database first
        theDatabase = new Database(schemaVersion);

        // Then try to load bundled database into it
        try {
          const connection = await theDatabase.connectionP;
          const metadata = await loadBundledDatabaseIfNeeded(connection, langChoice);
          if (metadata) {
            // Database was loaded from bundled assets, set Redux state
            if (metadata.schemaVersion) {
              dispatch({
                type: CARD_SET_SCHEMA_VERSION,
                schemaVersion: metadata.schemaVersion,
              });
            }
            if (metadata.cache) {
              dispatch({
                type: CARD_FETCH_SUCCESS,
                cache: metadata.cache,
                tabooCache: undefined,
                cardLang: metadata.cardLang || 'en',
              });
            }
            if (metadata.packs) {
              dispatch({
                type: PACKS_AVAILABLE,
                packs: metadata.packs,
                lang: metadata.cardLang || 'en',
                lastModified: metadata.packsLastModified,
                timestamp: new Date(),
              });
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

        if (mountedRef.current) {
          setInitializing(false);
        }
      }

      if (theDatabase) {
        theDatabase.addListener(playerCardsChanged);
        if (mountedRef.current) {
          setPlayerCardsByTaboo(theDatabase.playerState?.playerCards || {});
          setTabooSets(theDatabase.playerState?.tabooSets || []);
        }
      }
    };

    initializeDatabase();

    return () => {
      mountedRef.current = false;
      theDatabase && theDatabase.removeListener(playerCardsChanged);
    };
  }, [schemaVersion, langChoice, dispatch, playerCardsChanged]);

  if (initializing || theDatabase === null) {
    // Return null or a loading indicator while database is initializing
    return null;
  }

  return (
    <DatabaseContext.Provider value={{
      playerCardsByTaboo,
      tabooSets,
      db: theDatabase,
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export default DatabaseProvider;