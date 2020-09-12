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

  Navigation.registerComponent('About', providerWrapper(AboutView));
  Navigation.registerComponent('Browse.Cards', providerWrapper(gestureHandlerRootHOC(BrowseCardsView)));
  Navigation.registerComponent('Browse.InvestigatorCards', providerWrapper(InvestigatorCardsView));
  Navigation.registerComponent('Deck', providerWrapper(gestureHandlerRootHOC(DeckDetailView)));
  Navigation.registerComponent('Deck.Charts', providerWrapper(DeckChartsView));
  Navigation.registerComponent('Deck.History', providerWrapper(DeckHistoryView));
  Navigation.registerComponent('Deck.Checklist', providerWrapper(DeckChecklistView));
  Navigation.registerComponent('Deck.DrawSimulator', providerWrapper(DrawSimulatorView));
  Navigation.registerComponent('Deck.Description', providerWrapper(DeckDescriptionView));
  Navigation.registerComponent('Deck.Edit', providerWrapper(DeckEditView));
  Navigation.registerComponent('Deck.EditSpecial', providerWrapper(EditSpecialDeckCardsView));
  Navigation.registerComponent('Deck.Upgrade', providerWrapper(DeckUpgradeDialog));
  Navigation.registerComponent('Deck.New', providerWrapper(NewDeckView));
  Navigation.registerComponent('Deck.NewOptions', providerWrapper(NewDeckOptionsDialog));
  Navigation.registerComponent('Card', providerWrapper(CardDetailView));
  Navigation.registerComponent('Card.Swipe', providerWrapper(CardDetailSwipeView));
  Navigation.registerComponent('Card.Faq', providerWrapper(CardFaqView));
  Navigation.registerComponent('Card.Taboo', providerWrapper(CardTabooView));
  Navigation.registerComponent('Card.Image', providerWrapper(CardImageView));
  Navigation.registerComponent('My.Campaigns', providerWrapper(gestureHandlerRootHOC(MyCampaignsView)));
  Navigation.registerComponent('My.Decks', providerWrapper(gestureHandlerRootHOC(MyDecksView)));
  Navigation.registerComponent('Campaign', providerWrapper(CampaignDetailView));
  Navigation.registerComponent('Campaign.New', providerWrapper(NewCampaignView));
  Navigation.registerComponent('Campaign.AddResult', providerWrapper(AddScenarioResultView));
  Navigation.registerComponent('Guide.Campaign', providerWrapper(gestureHandlerRootHOC(CampaignGuideView)));
  Navigation.registerComponent('Guide.LinkedCampaign', providerWrapper(gestureHandlerRootHOC(LinkedCampaignGuideView)));
  Navigation.registerComponent('Guide.SideScenario', providerWrapper(AddSideScenarioView));
  Navigation.registerComponent('Guide.CardErrata', providerWrapper(EncounterCardErrataView));
  Navigation.registerComponent('Guide.ScenarioFaq', providerWrapper(ScenarioFaqView));
  Navigation.registerComponent('Guide.ChallengeScenario', providerWrapper(ChallengeScenarioView));
  Navigation.registerComponent('Guide.ChaosBag', providerWrapper(GuideChaosBagView));
  Navigation.registerComponent('Guide.OddsCalculator', providerWrapper(GuideOddsCalculatorView));
  Navigation.registerComponent('Guide.Scenario', providerWrapper(ScenarioView));
  Navigation.registerComponent('Guide.Log', providerWrapper(CampaignLogView));
  Navigation.registerComponent('Guide.LocationSetup', providerWrapper(LocationSetupView));
  Navigation.registerComponent('Guide.CardSelector', providerWrapper(CardSelectorView));
  Navigation.registerComponent('Campaign.UpgradeDecks', providerWrapper(UpgradeDecksView));
  Navigation.registerComponent('Campaign.EditResult', providerWrapper(EditScenarioResultView));
  Navigation.registerComponent('Campaign.Scenarios', providerWrapper(CampaignScenarioView));
  Navigation.registerComponent('Campaign.ChaosBag', providerWrapper(CampaignChaosBagView));
  Navigation.registerComponent('OddsCalculator', providerWrapper(OddsCalculatorView));
  Navigation.registerComponent('Settings', providerWrapper(SettingsView));
  Navigation.registerComponent('Settings.Diagnostics', providerWrapper(DiagnosticsView));
  Navigation.registerComponent('Settings.Backup', providerWrapper(BackupView));
  Navigation.registerComponent('Settings.MergeBackup', providerWrapper(MergeBackupView));
  Navigation.registerComponent('Settings.SafeMode', providerWrapper(SafeModeView));
  Navigation.registerComponent('SearchFilters', providerWrapper(CardFilterView));
  Navigation.registerComponent('SearchFilters.Enemy', providerWrapper(CardEnemyFilterView));
  Navigation.registerComponent('SearchFilters.Location', providerWrapper(CardLocationFilterView));
  Navigation.registerComponent('SearchFilters.Packs', providerWrapper(PackFilterView));
  Navigation.registerComponent('SearchFilters.Chooser', providerWrapper(SearchMultiSelectView));
  Navigation.registerComponent('My.Collection', providerWrapper(CollectionEditView));
  Navigation.registerComponent('Pack', providerWrapper(PackCardsView));
  Navigation.registerComponent('My.Spoilers', providerWrapper(SpoilersView));
  Navigation.registerComponent('Dialog.CardUpgrade', providerWrapper(CardUpgradeDialog));
  Navigation.registerComponent('Dialog.DeckSelector', providerWrapper(gestureHandlerRootHOC(MyDecksSelectorDialog)));
  Navigation.registerComponent('Dialog.EditChaosBag', providerWrapper(EditChaosBagDialog));
  Navigation.registerComponent('Dialog.ExileCards', providerWrapper(ExileCardDialog));
  Navigation.registerComponent('Dialog.Campaign', providerWrapper(SelectCampaignDialog));
  Navigation.registerComponent('Dialog.CampaignDrawWeakness', providerWrapper(CampaignDrawWeaknessDialog));
  Navigation.registerComponent('Dialog.CampaignEditWeakness', providerWrapper(CampaignEditWeaknessDialog));
  Navigation.registerComponent('Dialog.SealToken', providerWrapper(SealTokenDialog));
  Navigation.registerComponent('Weakness.Draw', providerWrapper(WeaknessDrawDialog));
  Navigation.registerComponent('SortButton', providerWrapper(SortButton));
  Navigation.registerComponent('TuneButton', providerWrapper(TuneButton));
  Navigation.registerComponent('MythosButton', providerWrapper(MythosButton));
}
