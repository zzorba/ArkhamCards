import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  View,
  Text,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { filter, map, partition, uniq } from 'lodash';
import { msgid, ngettext, t, jt } from 'ttag';

import ThemePicker from './ThemePicker';
import FontSizePicker from './FontSizePicker';
import SocialBlock from './SocialBlock';
import LanguagePicker from './LanguagePicker';
import SettingsTabooPicker from './SettingsTabooPicker';
import { requestFetchCards } from '@components/card/actions';
import { setSingleCardView, setAlphabetizeEncounterSets, setColorblind, setJustifyContent, setSortQuotes } from './actions';
import { prefetch } from '@lib/auth';
import { AppState, getLangChoice, getPacksInCollection, getPackSpoilers, getAllPacks } from '@reducers';
import StyleContext from '@styles/StyleContext';
import { NavigationProps } from '@components/nav/types';
import AccountSection from './AccountSection';
import space, { s } from '@styles/space';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import DeckSectionHeader from '@components/deck/section/DeckSectionHeader';
import DeckPickerStyleButton from '@components/deck/controls/DeckPickerStyleButton';
import DeckButton from '@components/deck/controls/DeckButton';
import DeckCheckboxButton from '@components/deck/controls/DeckCheckboxButton';
import LanguageContext from '@lib/i18n/LanguageContext';
import DissonantVoicesLoginButton from './AccountSection/auth/DissonantVoicesLoginButton';
import { useAlertDialog } from '@components/deck/dialogs';
import { CURRENT_REDUX_VERSION } from '@reducers/settings';

function contactPressed() {
  Linking.openURL('mailto:arkhamcards@gmail.com');
}
function showMythosBusters() {
  Linking.openURL('https://mythosbusters.com/');
}
function showPatreon() {
  Linking.openURL('https://www.patreon.com/arkhamcards');
}

function showDeKofi() {
  Linking.openURL('https://ko-fi.com/simplainer');
}

const SHOW_JUSTIFY = false;
export default function SettingsView({ componentId }: NavigationProps) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const dispatch = useDispatch();
  const reduxMigrationCurrent = useSelector((state: AppState) => state.settings.version === CURRENT_REDUX_VERSION);

  const packsInCollection = useSelector(getPacksInCollection);
  const ignoreCollection = useSelector((state: AppState) => !!state.settings.ignore_collection);
  const spoilerSettings = useSelector(getPackSpoilers);
  const packs = useSelector(getAllPacks);
  const summarizePacks = useCallback((selection: { [pack: string]: boolean | undefined }, ignoreCollection?: boolean) => {
    if (ignoreCollection) {
      return t`All Cycles and Packs`;
    }
    const allPacks = filter(packs, p => !!selection[p.code]);
    const [cyclePacks, standalonePacks] = partition(allPacks, p => p.cycle_position < 50);
    const cycleCount = uniq(map(cyclePacks, p => p.cycle_position)).length;
    const standalonePackCount = filter(standalonePacks, p => p.cycle_position > 50).length;
    const cyclePart = ngettext(msgid`${cycleCount} Cycle`, `${cycleCount} Cycles`, cycleCount);
    const packPart = ngettext(msgid`${standalonePackCount} Pack`, `${standalonePackCount} Packs`, standalonePackCount);
    return `${cyclePart} + ${packPart}`;
  }, [packs]);
  const collectionSummary = useMemo(() => summarizePacks(packsInCollection, ignoreCollection), [summarizePacks, packsInCollection, ignoreCollection]);
  const spoilerSummary = useMemo(() => summarizePacks(spoilerSettings), [summarizePacks, spoilerSettings]);
  const showCardsingleCardView = useSelector((state: AppState) => state.settings.singleCardView || false);
  const alphabetizeEncounterSets = useSelector((state: AppState) => state.settings.alphabetizeEncounterSets || false);
  const colorblind = useSelector((state: AppState) => state.settings.colorblind || false);
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);
  const justifyContent = useSelector((state: AppState) => !!state.settings.justifyContent);
  const sortIgnoreQuotes = useSelector((state: AppState) => !state.settings.sortRespectQuotes);
  const cardsError = useSelector((state: AppState) => state.cards.error || undefined);
  const { lang } = useContext(LanguageContext);
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
    dispatch(requestFetchCards(lang, langChoice));
  }, [dispatch, lang, langChoice]);

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

  const colorblindChanged = useCallback((value: boolean) => {
    dispatch(setColorblind(value));
  }, [dispatch]);

  const sortQuotesChanged = useCallback((value: boolean) => {
    dispatch(setSortQuotes(!value));
  }, [dispatch]);

  const justifyContentChanged = useCallback((value: boolean) => {
    dispatch(setJustifyContent(value));
  }, [dispatch]);

  const rulesPressed = useCallback(() => {
    navButtonPressed('Rules', t`Rules`);
  }, [navButtonPressed]);
  const [alertDialog, showAlert] = useAlertDialog(true);
  const patreonLink = <Text key="patreon" style={[typography.text, typography.underline, { color: colors.D20 }]} onPress={showPatreon}>{'Patreon'}</Text>;
  const mythosBustersLink = <Text key="mb" style={[typography.gameFont, typography.underline, { color: colors.D20 }]} onPress={showMythosBusters}>{t`Mythos Busters`}</Text>;
  return (
    <>
      <SafeAreaView style={[styles.container, backgroundStyle]}>
        <ScrollView style={[styles.list, { backgroundColor: colors.L10 }]} keyboardShouldPersistTaps="always">
          <AccountSection componentId={componentId} showAlert={showAlert} />
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Cards`} />}>
              <View style={[space.paddingTopS, space.paddingBottomS]}>
                <LanguagePicker first showAlert={showAlert} />
                <DeckPickerStyleButton
                  icon="card-outline"
                  title={t`Card Collection`}
                  valueLabel={collectionSummary}
                  editable
                  onPress={myCollectionPressed}
                />
                <DeckPickerStyleButton
                  icon="show"
                  title={t`Encounter Spoilers`}
                  valueLabel={spoilerSummary}
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
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Preferences`} />}>
              <View style={[space.paddingTopS, space.paddingBottomS]}>
                <ThemePicker />
                <FontSizePicker />
              </View>
              <DeckCheckboxButton
                icon="show"
                title={t`Color blind friendly icons`}
                value={colorblind}
                onValueChange={colorblindChanged}
              />
              <DeckCheckboxButton
                icon="sort-by-alpha"
                title={t`Sort ignores punctuation`}
                value={sortIgnoreQuotes}
                onValueChange={sortQuotesChanged}
              />
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
              />
              { SHOW_JUSTIFY && (Platform.OS === 'ios' || (typeof Platform.Version !== 'string' && Platform.Version >= 26)) && (
                <DeckCheckboxButton
                  icon="menu"
                  title={t`Justify text`}
                  value={justifyContent}
                  onValueChange={justifyContentChanged}
                />
              ) }
              { lang === 'de' && (
                <View style={[space.paddingTopS, space.paddingSideS]}>
                  <Text style={typography.text}>
                    { 'Die deutsche Vertonung wird von "SIMPLAINER" produziert und benötigt keinen Dissonant Voices login. Wenn du seine Arbeit unterstützen möchtest, spendiere ihm einen Kaffee auf ' }
                    <Text key="de_kofi" style={[typography.text, typography.underline, { color: colors.D20 }]} onPress={showDeKofi}>www.ko-fi.com/simplainer</Text>.
                  </Text>
                </View>
              ) }
              { lang !== 'ru' && <DissonantVoicesLoginButton showAlert={showAlert} last /> }
            </RoundedFactionBlock>
          </View>
          <SocialBlock />
          <View style={[space.paddingSideS, space.paddingBottomS]}>
            <RoundedFactionBlock faction="neutral" header={<DeckSectionHeader faction="neutral" title={t`Support`} />}>
              <View style={[space.paddingTopS, space.paddingSideS]}>
                <Text style={[typography.text]}>
                  { Platform.OS === 'ios' ?
                    jt`This app is made possible by the continued support of our fans on Patreon and the ${mythosBustersLink} podcast.` :
                    jt`This app is made possible by the continued support of our fans on ${patreonLink} and the ${mythosBustersLink} podcast.` }
                </Text>
              </View>
              <DeckButton
                icon="logo"
                topMargin={s}
                bottomMargin={s}
                onPress={aboutPressed}
                title={t`About Arkham Cards`}
              />
              { reduxMigrationCurrent && (
                <DeckButton
                  bottomMargin={s}
                  icon="book"
                  onPress={backupPressed}
                  title={t`Backup Data`}
                />
              ) }
              <DeckButton
                bottomMargin={s}
                icon="wrench"
                onPress={diagnosticsPressed}
                title={t`Diagnostics`}
              />
              <DeckButton
                color="gold"
                icon="email"
                onPress={contactPressed}
                title={t`Contact us`}
              />
            </RoundedFactionBlock>
          </View>
        </ScrollView>
      </SafeAreaView>
      { alertDialog }
    </>
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
