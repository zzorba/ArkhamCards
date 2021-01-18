import React, { useCallback, useContext, useMemo } from 'react';
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

import { Campaign, CampaignGuideState, Deck, DISSONANT_VOICES_LOGIN, Pack } from '@actions/types';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { clearDecks } from '@actions';
import Database from '@data/Database';
import DatabaseContext from '@data/DatabaseContext';
import Card from '@data/Card';
import { getBackupData, getAllPacks, getLangChoice } from '@reducers';
import { fetchCards } from '@components/card/actions';
import SettingsItem from './SettingsItem';
import CardSectionHeader from '@components/core/CardSectionHeader';
import StyleContext from '@styles/StyleContext';
import { saveAuthResponse } from '@lib/dissonantVoices';
import LanguageContext from '@lib/i18n/LanguageContext';

interface ReduxProps {
  backupData: {
    campaigns: Campaign[];
    decks: Deck[];
    guides: {
      [id: string]: CampaignGuideState;
    };
  };
  packs: Pack[];
  lang: string;
  langChoice: string;
}

interface ReduxActionProps {
  fetchCards: (db: Database, cardLang: string, choiceLang: string) => void;
  restoreBackup: (
    campaigns: Campaign[],
    guides: {
      [id: string]: CampaignGuideState;
    },
    decks: Deck[]
  ) => void;
  clearDecks: () => void;
}

type Props = ReduxProps & ReduxActionProps & InjectedDialogProps;


function goOffline() {
  database().goOffline();
}

function goOnline() {
  database().goOnline();
}

function DiagnosticsView({ showTextEditDialog }: Props) {
  const { db } = useContext(DatabaseContext);
  const { colors } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const backupData = useSelector(getBackupData);
  const packs = useSelector(getAllPacks);
  const langChoice = useSelector(getLangChoice);

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
      }],
    );
  }, [backupData]);

  const clearDatabase = useCallback(async() => {
    await (await db.cardsQuery()).delete().execute();
    await (await db.encounterSets()).createQueryBuilder().delete().execute();
    await (await db.faqEntries()).createQueryBuilder().delete().execute();
    await (await db.tabooSets()).createQueryBuilder().delete().execute();
  }, [db]);

  const doSyncCards = useCallback(() => {
    dispatch(fetchCards(db, lang, langChoice));
  }, [dispatch, lang, langChoice, db]);

  const clearCache = useCallback(() => {
    dispatch(clearDecks());
    clearDatabase().then(() => {
      doSyncCards();
    });
  }, [dispatch, clearDatabase, doSyncCards]);

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
    cycleNames[50] = {
      name: t`Return to...`,
    };
    cycleNames[70] = {
      name: t`Investigator Starter Decks`,
    };
    cycleNames[80] = {
      name: t`Side stories`,
    };
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.L20 }]}>
      <ScrollView style={{ backgroundColor: colors.L20 }}>
        <CardSectionHeader section={{ title: t`Backup` }} />
        <SettingsItem
          onPress={exportCampaignData}
          text={t`Export diagnostic data`}
        />
        <CardSectionHeader section={{ title: t`Caches` }} />
        <SettingsItem
          onPress={clearCache}
          text={t`Clear cache`}
        />
        { debugSection }
      </ScrollView>
    </SafeAreaView>
  );
}

export default withDialogs(DiagnosticsView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
