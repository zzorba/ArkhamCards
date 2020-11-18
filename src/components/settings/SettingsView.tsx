import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import ThemePicker from './ThemePicker';
import FontSizePicker from './FontSizePicker';
import LanguagePicker from './LanguagePicker';
import SettingsTabooPicker from './SettingsTabooPicker';
import SettingsSwitch from '@components/core/SettingsSwitch';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { fetchCards } from '@components/card/actions';
import { setSingleCardView, setAlphabetizeEncounterSets } from './actions';
import { prefetch } from '@lib/auth';
import Database from '@data/Database';
import DatabaseContext from '@data/DatabaseContext';
import { AppState, getLangPreference, getLangChoice } from '@reducers';
import SettingsItem from './SettingsItem';
import LoginButton from './LoginButton';
import StyleContext from '@styles/StyleContext';
import { NavigationProps } from '@components/nav/types';

const NATIVE_RULES = true;
interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  showCardsingleCardView: boolean;
  alphabetizeEncounterSets: boolean;
  lang: string;
  langChoice: string;
  cardsLoading?: boolean;
  cardsError?: string;
  deckCount: number;
}

interface ReduxActionProps {
  fetchCards: (db: Database, cardLang: string, choiceLang: string) => void;
  clearDecks: () => void;
  setSingleCardView: (value: boolean) => void;
  setAlphabetizeEncounterSets: (value: boolean) => void;
}

type Props = OwnProps & ReduxProps & ReduxActionProps;

function contactPressed() {
  Linking.openURL('mailto:arkhamcards@gmail.com');
}

export default function SettingsView({ componentId }: NavigationProps) {
  const { db } = useContext(DatabaseContext);
  const { backgroundStyle, colors } = useContext(StyleContext);
  const dispatch = useDispatch();

  const showCardsingleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const alphabetizeEncounterSets = useSelector((state: AppState) => state.settings.alphabetizeEncounterSets || false);
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);
  const cardsError = useSelector((state: AppState) => state.cards.error || undefined);
  const lang = useSelector(getLangPreference);
  const langChoice = useSelector(getLangChoice);

  const navButtonPressed = useCallback((screen: string, title: string) => {
    Navigation.push(componentId, {
      component: {
        name: screen,
        options: {
          topBar: {
            title: {
              text: title,
            },
            backButton: {
              title: t`Done`,
            },
          },
        },
      },
    });
  }, [componentId]);

  useEffect(() => {
    prefetch();
  }, []);

  const myCollectionPressed = useCallback(() => {
    navButtonPressed('My.Collection', t`Edit Collection`);
  }, [navButtonPressed]);

  const editSpoilersPressed = useCallback(() => {
    navButtonPressed('My.Spoilers', t`Edit Spoilers`);
  }, [navButtonPressed]);

  const diagnosticsPressed = useCallback(() => {
    navButtonPressed('Settings.Diagnostics', t`Diagnostics`);
  }, [navButtonPressed]);

  const aboutPressed = useCallback(() => {
    navButtonPressed('About', t`About Arkham Cards`);
  }, [navButtonPressed]);

  const backupPressed = useCallback(() => {
    navButtonPressed('Settings.Backup', t`Backup`);
  }, [navButtonPressed]);

  const rulesPressed = useCallback(() => {
    if (NATIVE_RULES) {
      navButtonPressed('Rules', t`Rules`);
    } else {
      Linking.openURL('https://arkhamdb.com/rules');
    }
  }, [navButtonPressed]);

  const doSyncCards = useCallback(() => {
    dispatch(fetchCards(db, lang, langChoice));
  }, [dispatch, db, lang, langChoice]);

  const syncCardsText = useMemo(() => {
    if (cardsLoading) {
      return t`Updating cards`;
    }
    return cardsError ?
      t`Error: Check for Cards Again` :
      t`Check for New Cards on ArkhamDB`;
  }, [cardsLoading, cardsError]);

  const swipeBetweenCardsChanged = useCallback((value: boolean) => {
    dispatch(setSingleCardView(!value));
  }, [dispatch]);

  const alphabetizeEncounterSetsChanged = useCallback((value: boolean) => {
    dispatch(setAlphabetizeEncounterSets(value));
  }, [dispatch]);


  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <ScrollView style={[styles.list, { backgroundColor: colors.L20 }]}>
        <CardSectionHeader section={{ title: t`Account` }} />
        <LoginButton settings />
        <SettingsItem
          navigation
          onPress={backupPressed}
          text={t`Backup Data`}
        />
        <CardSectionHeader section={{ title: t`Card Settings` }} />
        <SettingsItem
          navigation
          onPress={myCollectionPressed}
          text={t`Card Collection`}
        />
        <SettingsItem
          navigation
          onPress={editSpoilersPressed}
          text={t`Spoiler Settings`}
        />
        <SettingsTabooPicker />
        <CardSectionHeader section={{ title: t`Card Data` }} />
        <SettingsItem
          navigation
          onPress={rulesPressed}
          text={t`Rules`}
        />
        <SettingsItem
          onPress={cardsLoading ? undefined : doSyncCards}
          text={syncCardsText}
        />
        <LanguagePicker />
        <CardSectionHeader section={{ title: t`Preferences` }} />
        <ThemePicker />
        <FontSizePicker />
        <SettingsSwitch
          title={t`Swipe between card results`}
          value={!showCardsingleCardView}
          onValueChange={swipeBetweenCardsChanged}
          settingsStyle
        />
        <SettingsSwitch
          title={t`Alphabetize guide encounter sets`}
          value={alphabetizeEncounterSets}
          onValueChange={alphabetizeEncounterSetsChanged}
          settingsStyle
        />
        <SettingsItem
          navigation
          onPress={diagnosticsPressed}
          text={t`Diagnostics`}
        />
        <CardSectionHeader section={{ title: t`About Arkham Cards` }} />
        <SettingsItem
          navigation
          onPress={aboutPressed}
          text={t`About Arkham Cards`}
        />
        <SettingsItem
          navigation
          onPress={contactPressed}
          text={t`Contact us`}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});
