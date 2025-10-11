import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';

import { useDispatch } from 'react-redux';
import { t } from 'ttag';

import { clearDecks } from '@actions';
import BasicButton from '@components/core/BasicButton';
import DatabaseContext from '@data/sqlite/DatabaseContext';
import SettingsItem from './SettingsItem';
import StyleContext from '@styles/StyleContext';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/types';

export interface SafeModeViewProps {
  startApp?: () => void;
}

export default function SafeModeView() {
  const route = useRoute<RouteProp<RootStackParamList, 'Settings.SafeMode'>>();
  const navigation = useNavigation();
  const { startApp } = route.params || {};
  const { db } = useContext(DatabaseContext);
  const { backgroundStyle } = useContext(StyleContext);
  const dispatch = useDispatch();
  const [safeMode, setSafeMode] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const launchApp = useCallback(() => {
    if (startApp) {
      startApp();
    } else {
      navigation.goBack();
    }
  }, [startApp, navigation]);

  const enableSafeMode = useCallback(() => {
    navigation.setOptions({
      title: t`Safe mode`,
    });
    setSafeMode(true);
  }, [navigation, setSafeMode]);

  useEffect(() => {
    Alert.alert(
      t`The app drew an Auto-Fail`,
      t`Sorry about that. If the app is crashing on launch, you can enter 'Safe mode' to backup your data.`,
      [
        { text: t`Start normally`, style: 'cancel', onPress: launchApp },
        { text: t`Safe mode`, onPress: enableSafeMode },
      ],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backupPressed = useCallback(() => {
    navigation.navigate('Settings.Backup', { safeMode: true });
  }, [navigation]);

  const clearDatabase = useCallback(async() => {
    await (await db.cardsQuery()).delete().execute();
    await (await db.encounterSets()).createQueryBuilder().delete().execute();
    await (await db.faqEntries()).createQueryBuilder().delete().execute();
    await (await db.tabooSets()).createQueryBuilder().delete().execute();
  }, [db]);

  const clearCache = useCallback(async() => {
    dispatch(clearDecks());
    await clearDatabase();
    setCacheCleared(true);
  }, [dispatch, clearDatabase, setCacheCleared]);

  if (!safeMode) {
    return <View style={styles.background} />;
  }

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <ScrollView style={[styles.container, backgroundStyle]} contentContainerStyle={backgroundStyle}>
        <SettingsItem
          navigation
          onPress={backupPressed}
          text={t`Backup Data`}
        />
        { cacheCleared ? (
          <SettingsItem
            navigation
            text={t`Cache cleared`}
          />
        ) : (
          <SettingsItem
            navigation
            onPress={clearCache}
            text={t`Clear cache`}
          />
        ) }
        <BasicButton
          onPress={launchApp}
          title={t`Done`}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#24303C',
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

