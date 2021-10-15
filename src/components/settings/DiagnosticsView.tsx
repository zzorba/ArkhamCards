import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { forEach } from 'lodash';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
} from 'react-native';
import database from '@react-native-firebase/database';
import Crashes from 'appcenter-crashes';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { CARD_SET_SCHEMA_VERSION, DISSONANT_VOICES_LOGIN, Pack } from '@actions/types';
import { clearDecks } from '@actions';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import Card from '@data/types/Card';
import { getBackupData, getAllPacks, getLangChoice, AppState } from '@reducers';
import { requestFetchCards } from '@components/card/actions';
import SettingsItem from './SettingsItem';
import CardSectionHeader from '@components/core/CardSectionHeader';
import StyleContext from '@styles/StyleContext';
import { saveAuthResponse } from '@lib/dissonantVoices';
import LanguageContext from '@lib/i18n/LanguageContext';
import useTextEditDialog from '@components/core/useTextEditDialog';
import { useApolloClient } from '@apollo/client';


function goOffline() {
  database().goOffline();
}

function goOnline() {
  database().goOnline();
}

export default function DiagnosticsView() {
  const [dialog, showTextEditDialog] = useTextEditDialog();
  const { db } = useContext(DatabaseContext);
  const [schemaCleared, setSchemaCleared] = useState(false);
  const [sqliteVersion, setSqliteVesion] = useState(t`Loading`);
  const { colors } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const backupData = useSelector(getBackupData);
  const state = useSelector((state: AppState) => state);
  const packs = useSelector(getAllPacks);
  const langChoice = useSelector(getLangChoice);

  useEffect(() => {
    let canceled = false;
    db.sqliteVersion().then((versioned) => {
      if (!canceled) {
        setSqliteVesion(`${versioned.major}.${versioned.minor}.${versioned.patch}`);
      }
    });
    return () => {
      canceled = true;
    };
  }, [db, setSqliteVesion]);

  const exportCampaignData = useCallback(() => {
    Alert.alert(
      t`Export diagnostic data`,
      t`This feature is intended for advanced diagnostics. Just copy the data presented here and email it to arkhamcards@gmail.com`,
      [{
        text: t`Cancel`,
        style: 'cancel',
      }, {
        text: t`Export Campaign Data`,
        onPress: () => {
          Share.share({
            message: JSON.stringify(backupData),
          });
        },
      }, {
        text: t`Export Diagnostic Data`,
        onPress: () => {
          Share.share({
            message: JSON.stringify({
              legacyDecks: state.legacyDecks,
              legacyCampaigns: state.campaigns,
              legacyGuides: state.legacyGuides,
              decks: state.decks,
              campaigns: state.campaigns_2,
              guides: state.guides,
            }),
          });
        },
      }],
    );
  }, [backupData, state]);

  const clearDatabase = useCallback(async() => {
    await (await db.cardsQuery()).delete().execute();
    await (await db.encounterSets()).createQueryBuilder().delete().execute();
    await (await db.faqEntries()).createQueryBuilder().delete().execute();
    await (await db.tabooSets()).createQueryBuilder().delete().execute();
  }, [db]);
  const apollo = useApolloClient();
  const doSyncCards = useCallback(() => {
    dispatch(requestFetchCards(lang, langChoice));
  }, [dispatch, lang, langChoice]);

  const clearCache = useCallback(async() => {
    dispatch(clearDecks());
    await apollo.cache.reset();
    await apollo.resetStore();
  }, [apollo, dispatch]);

  const clearCardCache = useCallback(() => {
    clearDatabase().then(() => {
      doSyncCards();
    });
  }, [clearDatabase, doSyncCards]);

  const addDebugCardJson = useCallback((json: string) => {
    const packsByCode: { [code: string]: Pack } = {};
    const cycleNames: {
      [cycle_position: number]: {
        name?: string;
        code?: string;
      };
    } = {};
    forEach(packs, pack => {
      packsByCode[pack.code] = pack;
      if (pack.position === 1) {
        cycleNames[pack.cycle_position] = pack;
      }
    });
    cycleNames[8] = { name: t`Edge of the Earth`, code: 'eoe' };
    cycleNames[50] = { name: t`Return to...`, code: 'return' };
    cycleNames[60] = { name: t`Investigator Starter Decks`, code: 'investigator' };
    cycleNames[70] = { name: t`Side stories`, code: 'side_stories' };
    cycleNames[80] = { name: t`Promotional`, code: 'promotional' };
    cycleNames[90] = { name: t`Parallel`, code: 'parallel' };
    db.cards().then(cards => {
      cards.insert(
        Card.fromJson(JSON.parse(json), packsByCode, cycleNames, lang)
      );
    });
  }, [packs, lang, db]);

  const addDebugCard = useCallback(() => {
    showTextEditDialog(
      t`Debug Card Json`,
      '',
      (json: string) => {
        Keyboard.dismiss();
        setTimeout(() => addDebugCardJson(json), 1000);
      },
      false,
      4
    );
  }, [showTextEditDialog, addDebugCardJson]);

  const crash = useCallback(() => {
    Crashes.generateTestCrash();
  }, []);

  const setDissonantVoicesToken = useCallback(() => {
    showTextEditDialog(
      'Dissonant Voices token',
      '',
      (token: string) => {
        Keyboard.dismiss();
        saveAuthResponse(token);
        dispatch({
          type: DISSONANT_VOICES_LOGIN,
        });
      }
    );
  }, [showTextEditDialog, dispatch]);

  const clearCardSchema = useCallback(() => {
    dispatch({
      type: CARD_SET_SCHEMA_VERSION,
      schemaVersion: 1,
    });
    setSchemaCleared(true);
    Alert.alert(t`Database reset`, t`The card database has been reset.\n\nPlease close the app and restart it to trigger a full sync of card data.`);
  }, [dispatch]);

  const debugSection = useMemo(() => {
    if (!__DEV__) {
      return null;
    }
    return (
      <>
        <CardSectionHeader section={{ title: t`Debug` }} />
        <SettingsItem
          onPress={crash}
          text={'Crash'}
        />
        <SettingsItem
          onPress={addDebugCard}
          text={'Add Debug Card'}
        />
        <SettingsItem
          onPress={setDissonantVoicesToken}
          text={'Set Dissonant Voices Token'}
        />
        <CardSectionHeader section={{ title: 'Firebase' }} />
        <SettingsItem
          onPress={goOffline}
          text={'Go offline'}
        />
        <SettingsItem
          onPress={goOnline}
          text={'Go online'}
        />
      </>
    );
  }, [crash, addDebugCard, setDissonantVoicesToken]);
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.L20 }]}>
      <ScrollView style={{ backgroundColor: colors.L20 }}>
        <CardSectionHeader section={{ title: t`Backup` }} />
        <SettingsItem
          onPress={exportCampaignData}
          text={t`Export diagnostic data`}
        />
        <SettingsItem text={t`Sqlite version: ${sqliteVersion}`} />
        <CardSectionHeader section={{ title: t`Caches` }} />
        <SettingsItem
          onPress={clearCache}
          text={t`Clear cache`}
        />
        { !schemaCleared && (
          <SettingsItem
            disabled={cardsLoading}
            onPress={clearCardCache}
            text={cardsLoading ? t`Loading` : t`Clear card cache`}
          />
        ) }
        <SettingsItem
          disabled={schemaCleared}
          onPress={clearCardSchema}
          text={schemaCleared ? t`Please close and restart the app` : t`Reset card database`}
        />
        { debugSection }
      </ScrollView>
      { dialog }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
