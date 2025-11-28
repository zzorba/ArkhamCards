import React, { useRef, useCallback, useEffect, useState } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabScreenProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { t } from 'ttag';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

import AppIcon from '@icons/AppIcon';
import analytics from '@react-native-firebase/analytics';

// Screen Components - Tab root screens
import BrowseCardsView from '@components/cardlist/BrowseCardsView';
import MyDecksView from '@components/decklist/MyDecksView';
import MyCampaignsView from '@components/campaign/MyCampaignsView';
import SettingsView from '@components/settings/SettingsView';

// Deck screens
import DeckDetailView, { DeckDetailViewOptions } from '@components/deck/DeckDetailView';
import NewDeckView from '@components/deck/NewDeckView';
import NewDeckOptionsDialog from '@components/deck/NewDeckOptionsDialog';
import DeckChecklistView from '@components/deck/DeckChecklistView';
import EditSpecialDeckCardsView from '@components/deck/EditSpecialDeckCardsView';
import DeckEditView from '@components/deck/DeckEditView';
import DeckDraftView from '@components/deck/DeckDraftView';
import DeckUpgradeDialog from '@components/deck/DeckUpgradeDialog';
import DeckDescriptionView from '@components/deck/DeckDescriptionView';
import CardUpgradeDialog from '@components/deck/CardUpgradeDialog';
import DeckHistoryView from '@components/deck/DeckHistoryView';
import DeckChartsView from '@components/deck/DeckChartsView';
import DrawSimulatorView from '@components/deck/DrawSimulatorView';

// Card screens
import CardDetailView from '@components/card/CardDetailView';
import DbCardDetailSwipeView from '@components/card/DbCardDetailSwipeView';
import InvestigatorCardsView from '@components/cardlist/InvestigatorCardsView';
import CardInvestigatorsView from '@components/card/CardInvestigatorsView';
import CardFaqView from '@components/card/CardFaqView';
import CardImageView from '@components/card/CardImageView';
import CardTabooView from '@components/card/CardTabooView';

// Filter screens
import CardFilterView from '@components/filter/CardFilterView';
import CardAssetFilterView from '@components/filter/CardAssetFilterView';
import CardEnemyFilterView from '@components/filter/CardEnemyFilterView';
import CardLocationFilterView from '@components/filter/CardLocationFilterView';
import PackFilterView from '@components/filter/PackFilterView';
import SearchMultiSelectView from '@components/cardlist/SearchMultiSelectView';

// Campaign screens
import CampaignDetailView from '@components/campaign/CampaignDetailView';
import NewCampaignView from '@components/campaign/NewCampaignView';
import AddScenarioResultView from '@components/campaign/AddScenarioResultView';
import CampaignAccessView from '@components/campaign/CampaignAccessView';
import CampaignLogView from '@components/campaign/CampaignLogView';
import CampaignScenariosView from '@components/campaign/CampaignScenariosView';
import EditScenarioResultView from '@components/campaign/EditScenarioResultView';
import TarotCardReadingView from '@components/campaign/TarotCardReadingView';
import UpgradeDecksView from '@components/campaign/UpgradeDecksView';
import CampaignDrawWeaknessDialog from '@components/campaign/CampaignDrawWeaknessDialog';
import CampaignEditWeaknessDialog from '@components/campaign/CampaignEditWeaknessDialog';
import SelectCampaignDialog from '@components/campaign/SelectCampaignDialog';
import MyDecksSelectorDialog from '@components/campaign/MyDecksSelectorDialog';

// Campaign guide screens
import CampaignGuideLogView from '@components/campaignguide/CampaignLogView';
import AddSideScenarioView from '@components/campaignguide/AddSideScenarioView';
import SelectExileCardsView from '@components/campaignguide/SelectExileCardsView';
import EncounterCardErrataView from '@components/campaignguide/EncounterCardErrataView';
import ScenarioFaqView from '@components/campaignguide/ScenarioFaqView';
import ChallengeScenarioView from '@components/campaignguide/ChallengeScenarioView';
import CampaignAchievementsView from '@components/campaignguide/CampaignAchievementsView';
import CampaignRulesView from '@components/campaignguide/CampaignRulesView';
import LocationSetupView from '@components/campaignguide/LocationSetupView';
import WeaknessSetView from '@components/campaignguide/WeaknessSetView';
import CardSelectorView from '@components/campaignguide/CardSelectorView';
import CampaignGuideView from '@components/campaignguide/CampaignGuideView';
import ScenarioView from '@components/campaignguide/ScenarioView';
import LinkedCampaignGuideView from '@components/campaignguide/LinkedCampaignGuideView';
import StandaloneGuideView from '@components/campaignguide/StandaloneGuideView';
import CampaignMapView from '@components/campaignguide/CampaignMapView';

// Chaos bag and odds calculator screens
import GuideDrawChaosBagView from '@components/chaos/GuideDrawChaosBagView';
import GuideOddsCalculatorView from '@components/chaos/GuideOddsCalculatorView';
import CampaignDrawChaosBagView from '@components/chaos/CampaignDrawChaosBagView';
import EditChaosBagDialog from '@components/chaos/EditChaosBagDialog';
import OddsCalculatorView from '@components/chaos/OddsCalculatorView';
import SimpleChaosBagScreen from '@components/chaos/SimpleChaosBagScreen';

// Settings screens
import CollectionEditView from '@components/settings/CollectionEditView';
import RuleView from '@components/settings/RuleView';
import DiagnosticsView from '@components/settings/DiagnosticsView';
import BackupView from '@components/settings/BackupView';
import MergeBackupView from '@components/settings/MergeBackupView';
import AboutView from '@components/settings/AboutView';
import RulesView from '@components/settings/RulesView';
import PackCardsView from '@components/settings/PackCardsView';
import SpoilersView from '@components/settings/SpoilersView';
import ReleaseNotesView from '@components/settings/ReleaseNotesView';
import SafeModeView from '@components/settings/SafeModeView';

// Weakness screens
import WeaknessDrawDialog from '@components/weakness/WeaknessDrawDialog';

// Social screens
import FriendsView from '@components/social/FriendsView';

// Core components
import HeaderTitle from '@components/core/HeaderTitle';

// App-level imports
import MyProvider from '@app/MyProvider';
import crashlytics from '@react-native-firebase/crashlytics';
import { maybeSaveAutomaticBackup } from '@app/autoBackup';
import { useLocalizedString } from '@lib/i18n/useLocalizedString';

import { useDispatch, useSelector } from 'react-redux';
import { AppState, getThemeOverride } from '@reducers';
import { DARK_THEME, LIGHT_THEME, ThemeColors } from '@styles/theme';
import COLORS from '@styles/colors';
import { Appearance } from 'react-native';
import { ApolloClient } from '@apollo/client';
import { Persistor } from 'redux-persist/es/types';
import { CHANGE_TAB, BROWSE_CARDS, BROWSE_DECKS, BROWSE_CAMPAIGNS, BROWSE_SETTINGS } from '@actions/types';
import {
  RootStackParamList,
  CardsStackParamList,
  DecksStackParamList,
  CampaignsStackParamList,
  SettingsStackParamList,
  TabParamList,
  BasicStackParamList,
} from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const CardsStack = createNativeStackNavigator<CardsStackParamList>();
const DecksStack = createNativeStackNavigator<DecksStackParamList>();
const CampaignsStack = createNativeStackNavigator<CampaignsStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function useNavigatorTheme(includeBackTitle = true): {
  colors: ThemeColors;
  screenOptions: NativeStackNavigationOptions;
 } {
  const backTitle = useLocalizedString(() => t`Back`);
  const themeOverride = useSelector((state: AppState) => getThemeOverride(state));
  const darkMode = !themeOverride ? Appearance.getColorScheme() === 'dark' : themeOverride === 'dark';
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;

  return {
    colors,
    screenOptions: {
      headerTitleStyle: {
        fontFamily: 'Alegreya-Medium',
        fontSize: 20,
        fontWeight: '500',
        color: colors.darkText,
      },
      headerStyle: {
        backgroundColor: colors.L30,
      },
      statusBarStyle: darkMode ? 'light' : 'dark',
      ...(includeBackTitle ? { headerBackTitle: backTitle } : {}),
    },
  };
}

function getDeckScreenOptionsWithBackground(headerBackgroundColor: string | undefined, title?: string, isUpgrade?: boolean) {
  // Use dark color for upgrade mode (gold background), white for normal mode
  const textColor = isUpgrade ? COLORS.D30 : '#FFFFFF';
  return {
    ...(title !== undefined ? { title } : {}),
    ...(headerBackgroundColor ? {
      headerStyle: {
        backgroundColor: headerBackgroundColor,
      },
      headerTintColor: textColor,
      headerTitleStyle: {
        color: textColor,
      },
      statusBarStyle: isUpgrade ? ('dark' as const) : ('light' as const),
    } : {}),
  };
}

function useAppInitialization(navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>) {
  const [safeModeActive, setSafeModeActive] = useState(false);
  const appState = useSelector((state: AppState) => state);

  useEffect(() => {
    let mounted = true;

    async function checkCrashAndInitialize() {
      try {
        const previousCrash = await crashlytics().didCrashOnPreviousExecution();
        if (previousCrash && !__DEV__ && mounted) {
          setSafeModeActive(true);
          // Navigate to safe mode
          navigationRef.current?.navigate('Settings.SafeMode', {});
          return;
        }
      } catch (error) {
        console.log(error);
      }

      if (mounted) {
        // Run automatic backup on app start
        maybeSaveAutomaticBackup(appState);
      }
    }

    checkCrashAndInitialize();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationRef]);

  return { safeModeActive };
}

function useToastConfig(): ToastConfig {
  const themeOverride = useSelector((state: AppState) => getThemeOverride(state));
  const darkMode = !themeOverride ? Appearance.getColorScheme() === 'dark' : themeOverride === 'dark';
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;

  return {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.D30, backgroundColor: colors.D20 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontFamily: 'Alegreya-Medium',
          fontSize: 16,
          fontWeight: '500',
          color: colors.L10,
        }}
        text2Style={{
          fontFamily: 'Alegreya-Regular',
          fontSize: 14,
          color: colors.L20,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: colors.warn, backgroundColor: colors.D20 }}
        text1Style={{
          fontFamily: 'Alegreya-Medium',
          fontSize: 16,
          fontWeight: '500',
          color: colors.L10,
        }}
        text2Style={{
          fontFamily: 'Alegreya-Regular',
          fontSize: 14,
          color: colors.L20,
        }}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: colors.M, backgroundColor: colors.D20 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontFamily: 'Alegreya-Medium',
          fontSize: 16,
          fontWeight: '500',
          color: colors.L10,
        }}
        text2Style={{
          fontFamily: 'Alegreya-Regular',
          fontSize: 14,
          color: colors.L20,
        }}
      />
    ),
  };
}

function renderCommonScreens<ParamList extends BasicStackParamList>(
  Stack: ReturnType<typeof createNativeStackNavigator<ParamList>>
) {
  return (
    <>
      {/* Filter screens */}
      <Stack.Screen
        name="SearchFilters"
        component={CardFilterView}
        options={{
          title: t`Filters`,
        }}
      />
      <Stack.Screen
        name="SearchFilters.Asset"
        component={CardAssetFilterView}
        options={{
          title: t`Asset Filters`,
        }}
      />
      <Stack.Screen
        name="SearchFilters.Enemy"
        component={CardEnemyFilterView}
        options={{
          title: t`Enemy Filters`,
        }}
      />
      <Stack.Screen
        name="SearchFilters.Location"
        component={CardLocationFilterView}
        options={{
          title: t`Location Filters`,
        }}
      />
      <Stack.Screen
        name="SearchFilters.Packs"
        component={PackFilterView}
        options={{
          title: t`Pack Filters`,
        }}
      />
      <Stack.Screen
        name="SearchFilters.Chooser"
        component={SearchMultiSelectView}
        options={SearchMultiSelectView.options}
      />

      {/* Card screens */}
      <Stack.Screen
        name="Card"
        component={CardDetailView}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, t`Card`)}
      />
      <Stack.Screen
        name="Card.Swipe"
        component={DbCardDetailSwipeView}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, '')}
      />
      <Stack.Screen
        name="Card.Image"
        component={CardImageView}
        options={CardImageView.options}
      />
      <Stack.Screen
        name="Card.Investigators"
        component={CardInvestigatorsView}
        options={{
          title: t`Investigators`,
        }}
      />
      <Stack.Screen
        name="Card.Faq"
        component={CardFaqView}
        options={CardFaqView.options}
      />
      <Stack.Screen
        name="Campaign"
        component={CampaignDetailView}
        options={{
          title: t`Campaign`,
        }}
      />
      <Stack.Screen
        name="Campaign.New"
        component={NewCampaignView}
        options={{
          title: t`New Campaign`,
          headerBackTitle: t`Cancel`,
        }}
      />
      <Stack.Screen
        name="Campaign.AddResult"
        component={AddScenarioResultView}
      />
      <Stack.Screen
        name="Campaign.Access"
        component={CampaignAccessView}
        options={{
          title: t`Access`,
        }}
      />
      <Stack.Screen
        name="Campaign.Log"
        component={CampaignLogView}
        options={{
          title: t`Campaign Log`,
        }}
      />
      <Stack.Screen
        name="Campaign.Scenarios"
        component={CampaignScenariosView}
        options={{
          title: t`Scenarios`,
        }}
      />
      <Stack.Screen
        name="Campaign.EditResult"
        component={EditScenarioResultView}
        options={{
          title: t`Edit Scenario Result`,
        }}
      />
      <Stack.Screen
        name="Campaign.Tarot"
        component={TarotCardReadingView}
        options={{
          title: t`Tarot Reading`,
        }}
      />
      <Stack.Screen
        name="Campaign.UpgradeDecks"
        component={UpgradeDecksView}
        options={UpgradeDecksView.options}
      />
      <Stack.Screen
        name="Campaign.DrawChaosBag"
        component={CampaignDrawChaosBagView}
        options={{ title: t`Chaos Bag` }}
      />

      {/* Campaign guide screens */}
      <Stack.Screen
        name="Guide.Log"
        component={CampaignGuideLogView}
        options={{ title: t`Campaign Log` }}
      />
      <Stack.Screen
        name="Guide.SideScenario"
        component={AddSideScenarioView}
        options={AddSideScenarioView.options}
      />
      <Stack.Screen
        name="Guide.ExileSelector"
        component={SelectExileCardsView}
        options={{ title: t`Select cards to exile` }}
      />
      <Stack.Screen
        name="Guide.CardErrata"
        component={EncounterCardErrataView}
        options={{ title: t`Encounter Card Errata` }}
      />
      <Stack.Screen
        name="Guide.ScenarioFaq"
        component={ScenarioFaqView}
        options={{ title: t`Scenario FAQ` }}
      />
      <Stack.Screen
        name="Guide.ChallengeScenario"
        component={ChallengeScenarioView}
        options={ChallengeScenarioView.options}
      />
      <Stack.Screen
        name="Guide.Achievements"
        component={CampaignAchievementsView}
        options={{ title: t`Achievements` }}
      />
      <Stack.Screen
        name="Guide.Rules"
        component={CampaignRulesView}
        options={CampaignRulesView.options}
      />
      <Stack.Screen
        name="Guide.LocationSetup"
        component={LocationSetupView}
        options={({ route }) => ({
          headerTitle: () => (
            <HeaderTitle
              title={route.params?.step.text || t`Location Setup`}
              subtitle={route.params?.step.description}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Guide.WeaknessSet"
        component={WeaknessSetView}
        options={{ title: t`Weakness Set` }}
      />
      <Stack.Screen
        name="Guide.CardSelector"
        component={CardSelectorView}
        options={{ title: t`Select Cards` }}
      />
      <Stack.Screen
        name="Guide.Campaign"
        component={CampaignGuideView}
      />
      <Stack.Screen
        name="Guide.LinkedCampaign"
        component={LinkedCampaignGuideView}
      />
      <Stack.Screen
        name="Guide.Scenario"
        component={ScenarioView}
        options={ScenarioView.options}
      />
      <Stack.Screen
        name="Guide.Standalone"
        component={StandaloneGuideView}
      />
      <Stack.Screen
        name="Guide.DrawChaosBag"
        component={GuideDrawChaosBagView}
        options={{ title: t`Chaos Bag` }}
      />
      <Stack.Screen
        name="Guide.OddsCalculator"
        component={GuideOddsCalculatorView}
        options={{ title: t`Odds Calculator` }}
      />

      <Stack.Screen
        name="Browse.InvestigatorCards"
        component={InvestigatorCardsView}
        options={{
          title: t`Allowed Cards`,
        }}
      />
      <Stack.Screen
        name="Rule"
        component={RuleView}
        options={RuleView.options}
      />
      <Stack.Screen
        name="My.Collection"
        component={CollectionEditView}
        options={{ title: t`Edit Collection` }}
      />
      <Stack.Screen
        name="My.Spoilers"
        component={SpoilersView}
        options={{ title: t`Edit Spoilers` }}
      />
      <Stack.Screen
        name="About"
        component={AboutView}
        options={{
          title: t`About Arkham Cards`,
        }}
      />
      <Stack.Screen
        name="Rules"
        component={RulesView}
        options={{
          title: t`Rules`,
        }}
      />
      <Stack.Screen
        name="Card.Taboo"
        component={CardTabooView}
        options={{
          title: t`Taboo List`,
        }}
      />
      <Stack.Screen
        name="Pack"
        component={PackCardsView}
        options={PackCardsView.options}
      />

      {/* Chaos bag and odds calculator screens */}
      <Stack.Screen
        name="Dialog.EditChaosBag"
        component={EditChaosBagDialog}
        options={{ title: t`Chaos Bag`, headerBackTitle: t`Cancel` }}
      />
      <Stack.Screen
        name="OddsCalculator"
        component={OddsCalculatorView}
        options={{ title: t`Odds Calculator` }}
      />
      <Stack.Screen
        name="SimpleChaosBag"
        component={SimpleChaosBagScreen}
        options={{
          title: t`Chaos Bag`,
        }}
      />

      {/* Dialog screens */}
      <Stack.Screen
        name="Dialog.CampaignDrawWeakness"
        component={CampaignDrawWeaknessDialog}
        options={{
          title: t`Draw Weaknesses`,
        }}
      />
      <Stack.Screen
        name="Dialog.CampaignEditWeakness"
        component={CampaignEditWeaknessDialog}
        options={{
          title: t`Available weaknesses`,
        }}
      />

      {/* Settings screens */}
      <Stack.Screen
        name="Settings.Diagnostics"
        component={DiagnosticsView}
        options={{
          title: t`Diagnostics`,
        }}
      />
      <Stack.Screen
        name="Settings.Backup"
        component={BackupView}
        options={{
          title: t`Backup`,
        }}
      />
      <Stack.Screen
        name="Settings.MergeBackup"
        component={MergeBackupView}
        options={{
          title: t`Merge Backup`,
        }}
      />
      <Stack.Screen
        name="Settings.ReleaseNotes"
        component={ReleaseNotesView}
        options={{
          title: t`Recent updates`,
        }}
      />

      {/* Social screens */}
      <Stack.Screen
        name="Friends"
        component={FriendsView}
        options={FriendsView.options}
      />
    </>
  );
}


function CardsStackNavigator() {
  const { screenOptions } = useNavigatorTheme();
  const playerCardsTitle = useLocalizedString(() => t`Player Cards`);

  return (
    <CardsStack.Navigator screenOptions={screenOptions}>
      <CardsStack.Screen
        name="BrowseCards"
        component={BrowseCardsView}
        options={{
          title: playerCardsTitle,
        }}
      />
      {renderCommonScreens(CardsStack)}
    </CardsStack.Navigator>
  );
}

function DecksStackNavigator() {
  const backTitle = useLocalizedString(() => t`Back`);
  const decksTitle = useLocalizedString(() => t`Decks`);
  const themeOverride = useSelector((state: AppState) => getThemeOverride(state));
  const darkMode = !themeOverride ? Appearance.getColorScheme() === 'dark' : themeOverride === 'dark';
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <DecksStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Alegreya-Medium',
          fontSize: 20,
          fontWeight: '500',
          color: colors.darkText,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerBackTitle: backTitle,
        statusBarStyle: darkMode ? 'light' : 'dark',
      }}
    >
      <DecksStack.Screen
        name="MyDecks"
        component={MyDecksView}
        options={{
          title: decksTitle,
        }}
      />
      {renderCommonScreens(DecksStack)}
    </DecksStack.Navigator>
  );
}

function CampaignsStackNavigator() {
  const backTitle = useLocalizedString(() => t`Back`);
  const campaignsTitle = useLocalizedString(() => t`Campaigns`);
  const themeOverride = useSelector((state: AppState) => getThemeOverride(state));
  const darkMode = !themeOverride ? Appearance.getColorScheme() === 'dark' : themeOverride === 'dark';
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <CampaignsStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Alegreya-Medium',
          fontSize: 20,
          fontWeight: '500',
          color: colors.darkText,
        },
        headerStyle: {
          backgroundColor: colors.L30,
        },
        headerBackTitle: backTitle,
        statusBarStyle: darkMode ? 'light' : 'dark',
      }}
    >
      <CampaignsStack.Screen
        name="MyCampaigns"
        component={MyCampaignsView}
        options={{
          title: campaignsTitle,
        }}
      />
      {renderCommonScreens(CampaignsStack)}
    </CampaignsStack.Navigator>
  );
}

function SettingsStackNavigator() {
  const settingsTitle = useLocalizedString(() => t`Settings`);
  const themeOverride = useSelector((state: AppState) => getThemeOverride(state));
  const darkMode = !themeOverride ? Appearance.getColorScheme() === 'dark' : themeOverride === 'dark';
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Alegreya-Medium',
          fontSize: 20,
          fontWeight: '500',
          color: colors.darkText,
        },
        headerStyle: {
          backgroundColor: colors.L30,
        },
        statusBarStyle: darkMode ? 'light' : 'dark',
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsView}
        options={{
          title: settingsTitle,
        }}
      />
      {renderCommonScreens(SettingsStack)}
    </SettingsStack.Navigator>
  );
}

function TabNavigatorInner() {
  const cardsLabel = useLocalizedString(() => t`Cards`);
  const decksLabel = useLocalizedString(() => t`Decks`);
  const campaignsLabel = useLocalizedString(() => t`Campaigns`);
  const settingsLabel = useLocalizedString(() => t`Settings`);
  const dispatch = useDispatch();
  const themeOverride = useSelector((state: AppState) => getThemeOverride(state));
  const system = !themeOverride;
  const darkMode = system ? Appearance.getColorScheme() === 'dark' : themeOverride === 'dark';
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;

  const ALL_TABS = [BROWSE_CARDS, BROWSE_DECKS, BROWSE_CAMPAIGNS, BROWSE_SETTINGS];
  const screenOptions = useCallback(({ route }: { route: BottomTabScreenProps<TabParamList>['route'] }): BottomTabNavigationOptions => ({
    tabBarIcon: ({ color, size }) => {
      let iconName: string;
      if (route.name === 'CardsTab') {
        iconName = 'cards';
      } else if (route.name === 'DecksTab') {
        iconName = 'deck';
      } else if (route.name === 'CampaignsTab') {
        iconName = 'book';
      } else if (route.name === 'SettingsTab') {
        iconName = 'settings';
      } else {
        iconName = 'cards';
      }

      return <AppIcon name={iconName} size={Math.round(size * 1.1)} color={color} />;
    },
    tabBarActiveTintColor: colors.D30,
    tabBarInactiveTintColor: colors.M,
    tabBarStyle: {
      backgroundColor: colors.background,
    },
    tabBarLabelStyle: {
      fontFamily: 'Alegreya-Medium',
      fontSize: 12,
      fontWeight: '500',
    },
    headerShown: false,
  }), [colors]);
  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: (e) => {
          // Get tab index from route name
          const tabIndex = ALL_TABS.findIndex(tab => {
            switch (e.target?.split('-')[0]) {
              case 'CardsTab':
                return tab === BROWSE_CARDS;
              case 'DecksTab':
                return tab === BROWSE_DECKS;
              case 'CampaignsTab':
                return tab === BROWSE_CAMPAIGNS;
              case 'SettingsTab':
                return tab === BROWSE_SETTINGS;
              default:
                return false;
            }
          });
          if (tabIndex !== -1) {
            dispatch({
              type: CHANGE_TAB,
              tab: ALL_TABS[tabIndex],
            });
          }
        },
      }}
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="CardsTab"
        component={CardsStackNavigator}
        options={{ tabBarLabel: cardsLabel }}
      />
      <Tab.Screen
        name="DecksTab"
        component={DecksStackNavigator}
        options={{ tabBarLabel: decksLabel }}
      />
      <Tab.Screen
        name="CampaignsTab"
        component={CampaignsStackNavigator}
        options={{ tabBarLabel: campaignsLabel }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{ tabBarLabel: settingsLabel }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ store }: {
  store: { redux: AppState; persistor: Persistor; apollo: ApolloClient<unknown>; anonApollo: ApolloClient<unknown> };
}) {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  return (
    <MyProvider store={store}>
      <AppNavigatorInner navigationRef={navigationRef} />
    </MyProvider>
  );
}

function RootStackNavigator() {
  const backTitle = useLocalizedString(() => t`Back`);
  const newDeckTitle = useLocalizedString(() => t`New Deck`);
  const themeOverride = useSelector((state: AppState) => getThemeOverride(state));
  const darkMode = !themeOverride ? Appearance.getColorScheme() === 'dark' : themeOverride === 'dark';
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <RootStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'Alegreya-Medium',
          fontSize: 20,
          fontWeight: '500',
          color: colors.darkText,
        },
        headerStyle: {
          backgroundColor: colors.L30,
        },
        headerBackTitle: backTitle,
        statusBarStyle: darkMode ? 'light' : 'dark',
      }}
    >
      <RootStack.Screen
        name="Tabs"
        component={TabNavigatorInner}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Deck"
        component={DeckDetailView}
        options={DeckDetailViewOptions}
      />
      <RootStack.Screen
        name="Deck.New"
        component={NewDeckView}
        options={{
          title: newDeckTitle,
        }}
      />
      <RootStack.Screen
        name="Deck.NewOptions"
        component={NewDeckOptionsDialog}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params.headerBackgroundColor, t`New Deck`)}
      />
      {renderCommonScreens(RootStack)}
      <RootStack.Screen
        name="Deck.Checklist"
        component={DeckChecklistView}
        options={{
          title: t`Checklist`,
        }}
      />
      <RootStack.Screen
        name="Deck.EditSpecial"
        component={EditSpecialDeckCardsView}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, t`Edit Special Cards`)}
      />
      <RootStack.Screen
        name="Deck.EditAddCards"
        component={DeckEditView}
        options={DeckEditView.options}
      />
      <RootStack.Screen
        name="Deck.DraftCards"
        component={DeckDraftView}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, t`Draft Cards`)}
      />
      <RootStack.Screen
        name="Deck.Upgrade"
        component={DeckUpgradeDialog}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, t`Upgrade Deck`, true)}
      />
      <RootStack.Screen
        name="Deck.Description"
        component={DeckDescriptionView}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, t`Notes`)}
      />
      <RootStack.Screen
        name="Dialog.CardUpgrade"
        component={CardUpgradeDialog}
        options={CardUpgradeDialog.options}
      />
      <RootStack.Screen
        name="Deck.History"
        component={DeckHistoryView}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, t`Upgrade History`)}
      />
      <RootStack.Screen
        name="Deck.Charts"
        component={DeckChartsView}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, t`Charts`)}
      />
      <RootStack.Screen
        name="Deck.DrawSimulator"
        component={DrawSimulatorView}
        options={({ route }) => getDeckScreenOptionsWithBackground(route.params?.headerBackgroundColor, t`Draw Simulator`)}
      />
      <RootStack.Screen
        name="Weakness.Draw"
        component={WeaknessDrawDialog}
        options={{
          title: t`Draw Weaknesses`,
          presentation: 'fullScreenModal',
        }}
      />
      <RootStack.Screen
        name="Dialog.DeckSelector"
        component={MyDecksSelectorDialog}
        options={MyDecksSelectorDialog.options}
      />
      <RootStack.Screen
        name="Dialog.Campaign"
        component={SelectCampaignDialog}
        options={{
          title: t`Select Campaign`,
        }}
      />
      <RootStack.Screen
        name="Campaign.Map"
        component={CampaignMapView}
      />
      <RootStack.Screen
        name="Settings.SafeMode"
        component={SafeModeView}
        options={{
          title: t`Safe Mode`,
        }}
      />

    </RootStack.Navigator>
  );
}

function AppNavigatorInner({ navigationRef }: {
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>;
}) {
  const themeOverride = useSelector((state: AppState) => getThemeOverride(state));
  const system = !themeOverride;
  const darkMode = system ? Appearance.getColorScheme() === 'dark' : themeOverride === 'dark';
  const colors = darkMode ? DARK_THEME : LIGHT_THEME;
  const toastConfig = useToastConfig();
  useAppInitialization(navigationRef);
  const routeNameRef = useRef<string | undefined>();

  const linking = {
    prefixes: ['arkhamcards://', 'dissonantvoices://'],
    config: {
      screens: {
        Tabs: {
          screens: {
            Cards: 'cards',
            Decks: 'decks',
            Campaigns: 'campaigns',
            SettingsTab: 'settings',
          },
        },
        Deck: 'deck/:id',
        Campaign: 'campaign/:id',
      },
    },
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            const currentRoute = navigationRef.current?.getCurrentRoute();
            if (currentRoute?.name) {
              routeNameRef.current = currentRoute.name;
            }
          }}
          onStateChange={async (state) => {
            if (state) {
              const previousRouteName = routeNameRef.current;
              const currentRoute = navigationRef.current?.getCurrentRoute();
              const currentRouteName = currentRoute?.name;

              if (currentRouteName) {
                // Log to Crashlytics
                crashlytics().log(`Navigation: ${currentRouteName}`);
                crashlytics().setAttribute('current_screen', currentRouteName);

                // Log to Firebase Analytics
                if (previousRouteName !== currentRouteName) {
                  await analytics().logScreenView({
                    screen_name: currentRouteName,
                    screen_class: currentRouteName,
                  });
                }

                // Save the current route name for next comparison
                routeNameRef.current = currentRouteName;
              }
            }
          }}
          linking={linking}
          theme={{
            dark: darkMode,
            colors: {
              primary: colors.D30,
              background: colors.background,
              card: colors.L30,
              text: colors.darkText,
              border: colors.divider,
              notification: colors.D30,
            },
            fonts: {
              regular: {
                fontFamily: 'Alegreya-Regular',
                fontWeight: 'normal',
              },
              medium: {
                fontFamily: 'Alegreya-Medium',
                fontWeight: 'normal',
              },
              bold: {
                fontFamily: 'Alegreya-Medium',
                fontWeight: 'normal',
              },
              heavy: {
                fontFamily: 'Alegreya-Medium',
                fontWeight: 'normal',
              },
            },
          }}
        >
          <RootStackNavigator />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}