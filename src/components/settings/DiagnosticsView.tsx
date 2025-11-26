import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { forEach } from 'lodash';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import database from '@react-native-firebase/database';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system/legacy';

import { CARD_SET_SCHEMA_VERSION, DISSONANT_VOICES_LOGIN, SYNC_DISMISS_ONBOARDING } from '@actions/types';
import { clearDecks } from '@actions';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import { getBackupData, getLangChoice, AppState } from '@reducers';
import { requestFetchCards } from '@components/card/actions';
import SettingsItem from './SettingsItem';
import CardSectionHeader from '@components/core/CardSectionHeader';
import StyleContext from '@styles/StyleContext';
import { saveAuthResponse } from '@lib/dissonantVoices';
import LanguageContext from '@lib/i18n/LanguageContext';
import useTextEditDialog from '@components/core/useTextEditDialog';
import { useApolloClient } from '@apollo/client';
import { useSimpleTextDialog } from '@components/deck/dialogs';
import { useSettingFlag } from '@components/core/hooks';
import { useUpdateOnboarding } from '@data/remote/settings';
import { format } from 'date-fns';
import { saveFile } from '@lib/files';


function goOffline() {
  database().goOffline();
}

function goOnline() {
  database().goOnline();
}

function dummyOnPress() {
  // intentionally blank
}

const THE_CODE = '0451';

export default function DiagnosticsView() {
  const [dialog, showTextEditDialog] = useTextEditDialog();
  const { db } = useContext(DatabaseContext);
  const [schemaCleared, setSchemaCleared] = useState(false);
  const [sqliteVersion, setSqliteVesion] = useState(t`Loading`);
  const [hasBetaAccess, setBeta1] = useSettingFlag('beta1');
  const { colors } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const backupData = useSelector(getBackupData);
  const state = useSelector((state: AppState) => state);
  const langChoice = useSelector(getLangChoice);
  const onboarding = useSelector((state: AppState) => state.settings.dismissedOnboarding);
  const updateRemoteOnboarding = useUpdateOnboarding();

  const resetOnboarding = useCallback(() => {
    const updates: { [code: string]: boolean } = {};
    forEach(onboarding, o => {
      updates[o] = false;
    });
    updateRemoteOnboarding(updates);
    dispatch({ type: SYNC_DISMISS_ONBOARDING, updates });
  }, [dispatch, updateRemoteOnboarding, onboarding]);
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

  const submitBetaCode = useCallback(async(code: string) => {
    if (code === THE_CODE) {
      setBeta1(true);
      return undefined;
    }
    return 'That code is not correct. Contact arkhamcards@gmail.com to join the beta testing program.';
  }, [setBeta1]);

  const [betaDialog, showBetaDialog] = useSimpleTextDialog({
    title: `Beta test program`,
    value: '',
    prompt: 'If you are interested in helping to test unreleased features, please contact arkhamcards@gmail.com.\n\nThese features are still in active development, and opting in might result in your campaign data being lost.\n\nBe sure to make a backup in advance and report any bugs you find.',
    onValidate: submitBetaCode,
    placeholder: 'Enter access code here',
  });

  const exportCampaignData = useCallback(() => {
    Alert.alert(
      t`Export diagnostic data`,
      t`This feature is intended for advanced diagnostics. Just copy the data presented here and email it to arkhamcards@gmail.com`,
      [{
        text: t`Cancel`,
        style: 'cancel',
      }, {
        text: t`Export Campaign Data`,
        onPress: async() => {
          const date = format(new Date(), 'yyyy-MM-dd');
          const filename = `CampaignData-${date}`;
          const data = JSON.stringify(backupData);
          try {
            await saveFile(filename, data, 'json', t`Export Campaign Data`);
          } catch (e) {
            console.log(e);
          }
        },
      }, {
        text: t`Export Diagnostic Data`,
        onPress: async() => {
          const date = format(new Date(), 'yyyy-MM-dd');
          const filename = `DiagnosticData-${date}`;
          const data = JSON.stringify({
            legacyDecks: state.legacyDecks,
            legacyCampaigns: state.campaigns,
            legacyGuides: state.legacyGuides,
            decks: state.decks,
            campaigns: state.campaigns_2,
            guides: state.guides,
            deckEdits: state.deckEdits,
            filters: state.filters,
          });
          try {
            await saveFile(filename, data, 'json', t`Export Diagnostic Data`);
          } catch (e) {
            console.log(e);
          }
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
    await apollo.resetStore();
  }, [apollo, dispatch]);

  const [imagesCleared, setImagesCleared] = useState(false);
  const clearImageCache = useCallback(async() => {
    await Image.clearDiskCache();
    setImagesCleared(true);
  }, [setImagesCleared]);

  const clearCardCache = useCallback(() => {
    clearDatabase().then(() => {
      doSyncCards();
    });
  }, [clearDatabase, doSyncCards]);

  const crash = useCallback(() => {
    crashlytics().crash();
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

  const cardsCache = useSelector((state: AppState) => state.cards.cache);
  const cardsSchemaVersion = useSelector((state: AppState) => state.cards.schemaVersion);
  const cardLang = useSelector((state: AppState) => state.cards.card_lang);
  const packs = useSelector((state: AppState) => state.packs.all);
  const packsLastModified = useSelector((state: AppState) => state.packs.lastModified);

  const exportDatabase = useCallback(async() => {
    try {
      // Find the database file - op-sqlite uses Library/default for the default location
      const dbPath = `${FileSystem.documentDirectory}../Library/default/arkham4`;
      const fileInfo = await FileSystem.getInfoAsync(dbPath);

      if (fileInfo.exists) {
        // Create metadata JSON file in Documents directory (Library isn't writable)
        const metadata = {
          schemaVersion: cardsSchemaVersion,
          cache: cardsCache,
          cardLang: cardLang || 'en',
          exportedAt: new Date().toISOString(),
          packs,
          packsLastModified,
        };

        const metadataPath = `${FileSystem.documentDirectory}arkham4.metadata.txt`;
        await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadata, null, 2));

        const sizeMB = (fileInfo.size / (1024 * 1024)).toFixed(2);

        console.log('=====================================');
        console.log('DATABASE EXPORT READY');
        console.log('=====================================');
        console.log('Database path:', dbPath);
        console.log('Metadata path:', metadataPath);
        console.log('Database size:', sizeMB, 'MB');
        console.log('Schema version:', cardsSchemaVersion);
        console.log('Card count:', cardsCache?.cardCount);
        console.log('');
        console.log('Copy and run this command:');
        console.log(`./scripts/copy-bundled-db.sh "${dbPath}"`);
        console.log('=====================================');

        Alert.alert(
          'Export Ready',
          `Database exported! Check console logs for paths to copy.\n\nSize: ${sizeMB} MB`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Database Not Found',
          `No database exists yet at:\n${dbPath}\n\nPlease sync cards first:\n\n1. Go to Settings\n2. Tap "Check for card updates"\n3. Wait for sync to complete\n4. Return here to export`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error exporting database:', error);
      Alert.alert('Error', `Failed to export database: ${error}`);
    }
  }, [cardsCache, cardsSchemaVersion, cardLang, packs, packsLastModified]);

  const debugSection = useMemo(() => {
    if (!__DEV__) {
      return null;
    }
    return (
      <>
        <SettingsItem
          onPress={exportDatabase}
          text={'Export database for bundling'}
        />
        <SettingsItem
          onPress={crash}
          text={'Crash'}
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
  }, [crash, setDissonantVoicesToken, exportDatabase]);
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.L20 }]}>
      <ScrollView style={{ backgroundColor: colors.L20 }}>
        <CardSectionHeader section={{ title: t`Backup` }} />
        <SettingsItem
          onPress={exportCampaignData}
          text={t`Export diagnostic data`}
        />
        { false && (
          <>
            <CardSectionHeader section={{ title: t`Beta testing` }} />
            <SettingsItem
              onPress={!hasBetaAccess ? showBetaDialog : undefined}
              text={hasBetaAccess ? 'Enabled' : 'Enter access code'}
              disabled={hasBetaAccess}
            />
          </>
        ) }
        <CardSectionHeader section={{ title: t`Caches` }} />
        <SettingsItem
          onPress={clearCache}
          text={t`Clear cache`}
        />
        <SettingsItem
          onPress={clearImageCache}
          text={imagesCleared ? t`Image cache cleared` : t`Clear image cache`}
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
        <CardSectionHeader section={{ title: t`Debug` }} />
        <SettingsItem text={t`Reset onboarding`} onPress={resetOnboarding} />
        <SettingsItem text={t`Sqlite version: ${sqliteVersion}`} onPress={dummyOnPress} />
        { debugSection }
      </ScrollView>
      { dialog }
      { betaDialog }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
