import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import ThemePicker from './ThemePicker';
import FontSizePicker from './FontSizePicker';
import LanguagePicker from './LanguagePicker';
import SettingsTabooPicker from './SettingsTabooPicker';
import { fetchCards } from '@components/card/actions';
import { setSingleCardView, setAlphabetizeEncounterSets } from './actions';
import { prefetch } from '@lib/auth';
import Database from '@data/Database';
import DatabaseContext from '@data/DatabaseContext';
import { AppState, getLangPreference, getLangChoice } from '@reducers';
import SettingsItem from './SettingsItem';
import StyleContext from '@styles/StyleContext';
import { NavigationProps } from '@components/nav/types';
import AccountSection from './AccountSection';
import space, { s } from '@styles/space';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import DeckButton from '@components/deck/controls/DeckButton';
import DeckCheckboxButton from '@components/deck/controls/DeckCheckboxButton';

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

  const doSyncCards = useCallback(() => {
    dispatch(fetchCards(db, lang, langChoice));
  }, [dispatch, db, lang, langChoice]);

  const syncCardsText = useMemo(() => {
    if (cardsLoading) {
      return t`Updating cards`;
    }
    return cardsError ?
      t`Error: Check for Cards Again` :
      t`Check ArkhamDB for updates`;
  }, [cardsLoading, cardsError]);

  const swipeBetweenCardsChanged = useCallback((value: boolean) => {
    dispatch(setSingleCardView(!value));
  }, [dispatch]);

  const alphabetizeEncounterSetsChanged = useCallback((value: boolean) => {
    dispatch(setAlphabetizeEncounterSets(value));
  }, [dispatch]);

  const rulesPressed = useCallback(() => {
    navButtonPressed('Rules', t`Rules`);
  }, [navButtonPressed]);

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <ScrollView style={[styles.list, { backgroundColor: colors.L20 }]}>
        <View style={[space.paddingSideS, space.paddingBottomM]}>
          <AccountSection />
        </View>
        <View style={[space.paddingSideS, space.paddingBottomM]}>
          <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Cards`} />}>
            <View style={[space.paddingTopS, space.paddingBottomS]}>
              <LanguagePicker first />
              <DeckPickerStyleButton
                icon="card-outline"
                title={t`Card Collection`}
                valueLabel={t`6 cycles, 34 packs`}
                editable
                onPress={myCollectionPressed}
              />
              <DeckPickerStyleButton
                icon="show"
                title={t`Spoiler Settings`}
                valueLabel={t`6 cycles, 24 packs`}
                onPress={editSpoilersPressed}
                editable
              />
              <SettingsTabooPicker last />
            </View>
            <DeckButton
              icon="arkhamdb"
              onPress={cardsLoading ? undefined : doSyncCards}
              title={syncCardsText}
              loading={cardsLoading}
              thin
              bottomMargin={s}
            />
            <DeckButton
              icon="book"
              onPress={rulesPressed}
              title={t`Rules`}
              thin
            />
          </RoundedFactionBlock>
        </View>
        <View style={[space.paddingSideS, space.paddingBottomM]}>
          <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Preferences`} />}>
            <View style={[space.paddingTopS, space.paddingBottomS]}>
              <ThemePicker />
              <FontSizePicker />
            </View>
            <DeckCheckboxButton
              icon="copy"
              title={t`Swipe between card results`}
              value={!showCardsingleCardView}
              onValueChange={swipeBetweenCardsChanged}
            />
            <DeckCheckboxButton
              icon="sort-by-alpha"
              title={t`Alphabetize guide encounter sets`}
              value={alphabetizeEncounterSets}
              onValueChange={alphabetizeEncounterSetsChanged}
              last
            />
          </RoundedFactionBlock>
        </View>

        <View style={[space.paddingSideS, space.paddingBottomM]}>
          <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Support`} />}>
            <DeckButton
              icon="logo"
              topMargin={s}
              bottomMargin={s}
              onPress={aboutPressed}
              title={t`About Arkham Cards`}
            />
            <DeckButton
              bottomMargin={s}
              icon="book"
              onPress={backupPressed}
              title={t`Backup Data`}
            />
            <DeckButton
              bottomMargin={s}
              icon="settings"
              onPress={diagnosticsPressed}
              title={t`Diagnostics`}
            />
            <DeckButton
              color="red"
              icon="logo"
              onPress={contactPressed}
              title={t`Contact us`}
            />
          </RoundedFactionBlock>
        </View>
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
