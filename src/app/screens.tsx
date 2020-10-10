import React from 'react';
import { Navigation } from 'react-native-navigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import SearchMultiSelectView from '@components/cardlist/SearchMultiSelectView';
import EditSpecialDeckCardsView from '@components/deck/EditSpecialDeckCardsView';
import MythosButton from '@components/cardlist/CardSearchComponent/MythosButton';
import TuneButton from '@components/cardlist/CardSearchComponent/TuneButton';
import SortButton from '@components/cardlist/CardSearchComponent/SortButton';
import CardDetailView from '@components/card/CardDetailView';
import CardDetailSwipeView from '@components/card/CardDetailSwipeView';
import CardFaqView from '@components/card/CardFaqView';
import CardTabooView from '@components/card/CardTabooView';
import CardImageView from '@components/card/CardImageView';
import InvestigatorCardsView from '@components/cardlist/InvestigatorCardsView';
import AddScenarioResultView from '@components/campaign/AddScenarioResultView';
import CampaignGuideView from '@components/campaignguide/CampaignGuideView';
import ChallengeScenarioView from '@components/campaignguide/ChallengeScenarioView';
import LinkedCampaignGuideView from '@components/campaignguide/LinkedCampaignGuideView';
import AddSideScenarioView from '@components/campaignguide/AddSideScenarioView';
import LocationSetupView from '@components/campaignguide/LocationSetupView';
import CampaignLogView from '@components/campaignguide/CampaignLogView';
import ScenarioView from '@components/campaignguide/ScenarioView';
import CardSelectorView from '@components/campaignguide/CardSelectorView';
import GuideChaosBagView from '@components/campaignguide/GuideChaosBagView';
import GuideOddsCalculatorView from '@components/campaignguide/GuideOddsCalculatorView';
import UpgradeDecksView from '@components/campaign/UpgradeDecksView';
import EditScenarioResultView from '@components/campaign/EditScenarioResultView';
import CampaignDetailView from '@components/campaign/CampaignDetailView';
import CampaignEditWeaknessDialog from '@components/campaign/CampaignEditWeaknessDialog';
import CampaignDrawWeaknessDialog from '@components/campaign/CampaignDrawWeaknessDialog';
import EncounterCardErrataView from '@components/campaignguide/EncounterCardErrataView';
import EditChaosBagDialog from '@components/campaign/EditChaosBagDialog';
import MyCampaignsView from '@components/campaign/MyCampaignsView';
import BackupView from '@components/settings/BackupView';
import MergeBackupView from '@components/settings/MergeBackupView';
import NewCampaignView from '@components/campaign/NewCampaignView';
import SelectCampaignDialog from '@components/campaign/SelectCampaignDialog';
import MyDecksSelectorDialog from '@components/campaign/MyDecksSelectorDialog';
import CardUpgradeDialog from '@components/deck/CardUpgradeDialog';
import CampaignScenarioView from '@components/campaign/CampaignScenarioView';
import CampaignChaosBagView from '@components/campaign/CampaignChaosBagView';
import OddsCalculatorView from '@components/campaign/OddsCalculatorView';
import MyDecksView from '@components/decklist/MyDecksView';
import NewDeckView from '@components/deck/NewDeckView';
import NewDeckOptionsDialog from '@components/deck/NewDeckOptionsDialog';
import DeckDetailView from '@components/deck/DeckDetailView';
import DeckEditView from '@components/deck/DeckEditView';
import DeckChecklistView from '@components/deck/DeckChecklistView';
import DrawSimulatorView from '@components/deck/DrawSimulatorView';
import DeckChartsView from '@components/deck/DeckChartsView';
import DeckHistoryView from '@components/deck/DeckHistoryView';
import DeckDescriptionView from '@components/deck/DeckDescriptionView';
import DeckUpgradeDialog from '@components/deck/DeckUpgradeDialog';
import CardFilterView from '@components/filter/CardFilterView';
import CardEnemyFilterView from '@components/filter/CardEnemyFilterView';
import CardLocationFilterView from '@components/filter/CardLocationFilterView';
import PackFilterView from '@components/filter/PackFilterView';
import DiagnosticsView from '@components/settings/DiagnosticsView';
import CollectionEditView from '@components/settings/CollectionEditView';
import SafeModeView from '@components/settings/SafeModeView';
import SettingsView from '@components/settings/SettingsView';
import PackCardsView from '@components/settings/PackCardsView';
import SpoilersView from '@components/settings/SpoilersView';
import ExileCardDialog from '@components/campaign/ExileCardDialog';
import AboutView from '@components/settings/AboutView';
import WeaknessDrawDialog from '@components/weakness/WeaknessDrawDialog';
import SealTokenDialog from '@components/campaign/SealTokenDialog';
import ScenarioFaqView from '@components/campaignguide/ScenarioFaqView';
import BrowseCardsView from '@components/cardlist/BrowseCardsView';
import RulesView from '@components/settings/RulesView';
import RuleView from '@components/settings/RuleView';

interface ProviderProps<S> {
  store: S;
  children: React.ReactNode;
}


// register all screens of the app (including internal ones)
export function registerScreens<S>(Provider: React.ComponentType<ProviderProps<S>>, store: S) {

  function providerWrapper<Props>(
    ScreenComponenet: React.ComponentType<Props>,
  ) {
    return () => (props: Props) => (
      <Provider store={store}>
        <ScreenComponenet {...props} />
      </Provider>
    );
  }

  Navigation.registerComponent('About', providerWrapper(AboutView), () => AboutView);
  Navigation.registerComponent('Browse.Cards', providerWrapper(gestureHandlerRootHOC(BrowseCardsView)), () => BrowseCardsView);
  Navigation.registerComponent('Browse.InvestigatorCards', providerWrapper(InvestigatorCardsView), () => InvestigatorCardsView);
  Navigation.registerComponent('Deck', providerWrapper(gestureHandlerRootHOC(DeckDetailView)), () => DeckDetailView);
  Navigation.registerComponent('Deck.Charts', providerWrapper(DeckChartsView), () => DeckChartsView);
  Navigation.registerComponent('Deck.History', providerWrapper(DeckHistoryView), () => DeckHistoryView);
  Navigation.registerComponent('Deck.Checklist', providerWrapper(DeckChecklistView), () => DeckChecklistView);
  Navigation.registerComponent('Deck.DrawSimulator', providerWrapper(DrawSimulatorView), () => DrawSimulatorView);
  Navigation.registerComponent('Deck.Description', providerWrapper(DeckDescriptionView), () => DeckDescriptionView);
  Navigation.registerComponent('Deck.Edit', providerWrapper(DeckEditView), () => DeckEditView);
  Navigation.registerComponent('Deck.EditSpecial', providerWrapper(EditSpecialDeckCardsView), () => EditSpecialDeckCardsView);
  Navigation.registerComponent('Deck.Upgrade', providerWrapper(gestureHandlerRootHOC(DeckUpgradeDialog)), () => DeckUpgradeDialog);
  Navigation.registerComponent('Deck.New', providerWrapper(gestureHandlerRootHOC(NewDeckView)), () => NewDeckView);
  Navigation.registerComponent('Deck.NewOptions', providerWrapper(NewDeckOptionsDialog), () => NewDeckOptionsDialog);
  Navigation.registerComponent('Card', providerWrapper(CardDetailView), () => CardDetailView);
  Navigation.registerComponent('Card.Swipe', providerWrapper(CardDetailSwipeView), () => CardDetailSwipeView);
  Navigation.registerComponent('Card.Faq', providerWrapper(CardFaqView), () => CardFaqView);
  Navigation.registerComponent('Card.Taboo', providerWrapper(CardTabooView), () => CardTabooView);
  Navigation.registerComponent('Card.Image', providerWrapper(CardImageView), () => CardImageView);
  Navigation.registerComponent('My.Campaigns', providerWrapper(gestureHandlerRootHOC(MyCampaignsView)), () => MyCampaignsView);
  Navigation.registerComponent('My.Decks', providerWrapper(gestureHandlerRootHOC(MyDecksView)), () => MyDecksView);
  Navigation.registerComponent('Campaign', providerWrapper(CampaignDetailView), () => CampaignDetailView);
  Navigation.registerComponent('Campaign.New', providerWrapper(NewCampaignView), () => NewCampaignView);
  Navigation.registerComponent('Campaign.AddResult', providerWrapper(AddScenarioResultView), () => AddScenarioResultView);
  Navigation.registerComponent('Guide.Campaign', providerWrapper(gestureHandlerRootHOC(CampaignGuideView)), () => CampaignGuideView);
  Navigation.registerComponent('Guide.LinkedCampaign', providerWrapper(gestureHandlerRootHOC(LinkedCampaignGuideView)), () => LinkedCampaignGuideView);
  Navigation.registerComponent('Guide.SideScenario', providerWrapper(AddSideScenarioView), () => AddSideScenarioView);
  Navigation.registerComponent('Guide.CardErrata', providerWrapper(EncounterCardErrataView), () => EncounterCardErrataView);
  Navigation.registerComponent('Guide.ScenarioFaq', providerWrapper(ScenarioFaqView), () => ScenarioFaqView);
  Navigation.registerComponent('Guide.ChallengeScenario', providerWrapper(ChallengeScenarioView), () => ChallengeScenarioView);
  Navigation.registerComponent('Guide.ChaosBag', providerWrapper(GuideChaosBagView), () => GuideChaosBagView);
  Navigation.registerComponent('Guide.OddsCalculator', providerWrapper(GuideOddsCalculatorView), () => GuideOddsCalculatorView);
  Navigation.registerComponent('Guide.Scenario', providerWrapper(ScenarioView), () => ScenarioView);
  Navigation.registerComponent('Guide.Log', providerWrapper(CampaignLogView), () => CampaignLogView);
  Navigation.registerComponent('Guide.LocationSetup', providerWrapper(LocationSetupView), () => LocationSetupView);
  Navigation.registerComponent('Guide.CardSelector', providerWrapper(CardSelectorView), () => CardSelectorView);
  Navigation.registerComponent('Campaign.UpgradeDecks', providerWrapper(UpgradeDecksView), () => UpgradeDecksView);
  Navigation.registerComponent('Campaign.EditResult', providerWrapper(EditScenarioResultView), () => EditScenarioResultView);
  Navigation.registerComponent('Campaign.Scenarios', providerWrapper(CampaignScenarioView), () => CampaignScenarioView);
  Navigation.registerComponent('Campaign.ChaosBag', providerWrapper(CampaignChaosBagView), () => CampaignChaosBagView);
  Navigation.registerComponent('OddsCalculator', providerWrapper(OddsCalculatorView), () => OddsCalculatorView);
  Navigation.registerComponent('Settings', providerWrapper(SettingsView), () => SettingsView);
  Navigation.registerComponent('Settings.Diagnostics', providerWrapper(DiagnosticsView), () => DiagnosticsView);
  Navigation.registerComponent('Settings.Backup', providerWrapper(BackupView), () => BackupView);
  Navigation.registerComponent('Settings.MergeBackup', providerWrapper(MergeBackupView), () => MergeBackupView);
  Navigation.registerComponent('Settings.SafeMode', providerWrapper(SafeModeView), () => SafeModeView);
  Navigation.registerComponent('SearchFilters', providerWrapper(CardFilterView), () => CardFilterView);
  Navigation.registerComponent('SearchFilters.Enemy', providerWrapper(CardEnemyFilterView), () => CardEnemyFilterView);
  Navigation.registerComponent('SearchFilters.Location', providerWrapper(CardLocationFilterView), () => CardLocationFilterView);
  Navigation.registerComponent('SearchFilters.Packs', providerWrapper(PackFilterView), () => PackFilterView);
  Navigation.registerComponent('SearchFilters.Chooser', providerWrapper(SearchMultiSelectView), () => SearchMultiSelectView);
  Navigation.registerComponent('My.Collection', providerWrapper(CollectionEditView), () => CollectionEditView);
  Navigation.registerComponent('Pack', providerWrapper(PackCardsView), () => PackCardsView);
  Navigation.registerComponent('My.Spoilers', providerWrapper(SpoilersView), () => SpoilersView);
  Navigation.registerComponent('Dialog.CardUpgrade', providerWrapper(CardUpgradeDialog), () => CardUpgradeDialog);
  Navigation.registerComponent('Dialog.DeckSelector', providerWrapper(gestureHandlerRootHOC(MyDecksSelectorDialog)), () => MyDecksSelectorDialog);
  Navigation.registerComponent('Dialog.EditChaosBag', providerWrapper(EditChaosBagDialog), () => EditChaosBagDialog);
  Navigation.registerComponent('Dialog.ExileCards', providerWrapper(ExileCardDialog), () => ExileCardDialog);
  Navigation.registerComponent('Dialog.Campaign', providerWrapper(SelectCampaignDialog), () => SelectCampaignDialog);
  Navigation.registerComponent('Dialog.CampaignDrawWeakness', providerWrapper(CampaignDrawWeaknessDialog), () => CampaignDrawWeaknessDialog);
  Navigation.registerComponent('Dialog.CampaignEditWeakness', providerWrapper(CampaignEditWeaknessDialog), () => CampaignEditWeaknessDialog);
  Navigation.registerComponent('Dialog.SealToken', providerWrapper(SealTokenDialog), () => SealTokenDialog);
  Navigation.registerComponent('Weakness.Draw', providerWrapper(WeaknessDrawDialog), () => WeaknessDrawDialog);
  Navigation.registerComponent('SortButton', providerWrapper(SortButton), () => SortButton);
  Navigation.registerComponent('TuneButton', providerWrapper(TuneButton), () => TuneButton);
  Navigation.registerComponent('MythosButton', providerWrapper(MythosButton), () => MythosButton);
  Navigation.registerComponent('Rules', providerWrapper(RulesView), () => RulesView);
  Navigation.registerComponent('Rule', providerWrapper(RuleView), () => RuleView);
}
