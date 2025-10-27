import { NavigationProp } from '@react-navigation/native';

// Deck screens
import { DeckDetailProps } from '@components/deck/DeckDetailView';
import { NewDeckProps } from '@components/deck/NewDeckView';
import { EditDeckProps } from '@components/deck/DeckEditView';
import { DeckChecklistProps } from '@components/deck/DeckChecklistView';
import { EditSpecialCardsProps } from '@components/deck/EditSpecialDeckCardsView';
import { DeckDraftProps } from '@components/deck/DeckDraftView';
import { UpgradeDeckProps } from '@components/deck/DeckUpgradeDialog';
import { DeckHistoryProps } from '@components/deck/DeckHistoryView';
import { CardUpgradeDialogProps } from '@components/deck/CardUpgradeDialog';
import { DeckChartsProps } from '@components/deck/DeckChartsView';
import { DrawSimulatorProps } from '@components/deck/DrawSimulatorView';
import { NewDeckOptionsProps } from '@components/deck/NewDeckOptionsDialog';

// Card screens
import { CardDetailProps } from '@components/card/CardDetailView';
import { CardInvestigatorProps } from '@components/card/CardInvestigatorsView';
import { CardFaqProps } from '@components/card/CardFaqView';
import { CardImageProps } from '@components/card/CardImageView';
import { CardDetailSwipeProps } from '@components/card/DbCardDetailSwipeView';
import { CardTabooProps } from '@components/card/CardTabooView';
import { InvestigatorCardsProps } from '@components/cardlist/InvestigatorCardsView';

// Campaign screens
import { CampaignDetailProps } from '@components/campaign/CampaignDetailView';
import { AddScenarioResultProps } from '@components/campaign/AddScenarioResultView';
import { CampaignDrawWeaknessProps } from '@components/campaign/CampaignDrawWeaknessDialog';
import { CampaignAccessProps } from '@components/campaign/CampaignAccessView';
import { CampaignLogViewProps } from '@components/campaign/CampaignLogView';
import { CampaignScenariosViewProps } from '@components/campaign/CampaignScenariosView';
import { EditScenarioResultProps } from '@components/campaign/EditScenarioResultView';
import { TarotCardReadingProps } from '@components/campaign/TarotCardReadingView';
import { UpgradeDecksProps } from '@components/campaign/UpgradeDecksView';
import { CampaignEditWeaknessProps } from '@components/campaign/CampaignEditWeaknessDialog';
import { SelectCampaignProps } from '@components/campaign/SelectCampaignDialog';
import { MyDecksSelectorProps } from '@components/campaign/MyDecksSelectorDialog';

// Campaign guide screens
import { CampaignLogProps } from '@components/campaignguide/CampaignLogView';
import { AddSideScenarioProps } from '@components/campaignguide/AddSideScenarioView';
import { SelectExileCardsProps } from '@components/campaignguide/SelectExileCardsView';
import { EncounterCardErrataProps } from '@components/campaignguide/EncounterCardErrataView';
import { ScenarioFaqProps } from '@components/campaignguide/ScenarioFaqView';
import { ChallengeScenarioProps } from '@components/campaignguide/ChallengeScenarioView';
import { CampaignAchievementsProps } from '@components/campaignguide/CampaignAchievementsView';
import { CampaignRulesProps } from '@components/campaignguide/CampaignRulesView';
import { LocationSetupProps } from '@components/campaignguide/LocationSetupView';
import { WeaknessSetProps } from '@components/campaignguide/WeaknessSetView';
import { CardSelectorProps } from '@components/campaignguide/CardSelectorView';
import { CampaignGuideProps } from '@components/campaignguide/CampaignGuideView';
import { ScenarioProps } from '@components/campaignguide/ScenarioView';
import { LinkedCampaignGuideProps } from '@components/campaignguide/LinkedCampaignGuideView';
import { StandaloneGuideProps } from '@components/campaignguide/StandaloneGuideView';
import { CampaignMapProps } from '@components/campaignguide/CampaignMapView';

// Chaos bag and odds calculator screens
import { GuideDrawChaosBagProps } from '@components/chaos/GuideDrawChaosBagView';
import { GuideOddsCalculatorProps } from '@components/chaos/GuideOddsCalculatorView';
import { CampaignDrawChaosBagProps } from '@components/chaos/CampaignDrawChaosBagView';
import { EditChaosBagProps } from '@components/chaos/EditChaosBagDialog';
import { OddsCalculatorProps } from '@components/chaos/OddsCalculatorView';

// Filter screens
import { FilterFunctionProps } from '@components/filter/useFilterFunctions';

// Settings screens
import { CollectionEditProps } from '@components/settings/CollectionEditView';
import { RuleViewProps } from '@components/settings/RuleView';
import { BackupProps } from '@components/settings/BackupView';
import { MergeBackupProps } from '@components/settings/MergeBackupView';
import { PackCardsProps } from '@components/settings/PackCardsView';

// Weakness screens
import { DrawWeaknessProps } from '@components/weakness/WeaknessDrawDialog';

// Social screens
import { FriendsViewProps } from '@components/social/FriendsView';
import { SafeModeViewProps } from '@components/settings/SafeModeView';
import { SearchSelectProps } from '@components/cardlist/SearchMultiSelectView';
import { TarotProps } from '@components/core/TarotOverlay';
import { DeckDescriptionProps } from '@components/deck/DeckDescriptionView';

export type ArkhamNavigation = Omit<NavigationProp<RootStackParamList>, 'getState'>;

export type BasicStackParamList = {
  // Card screens
  SearchFilters: FilterFunctionProps;
  'SearchFilters.Asset': FilterFunctionProps;
  'SearchFilters.Enemy': FilterFunctionProps;
  'SearchFilters.Location': FilterFunctionProps;
  'SearchFilters.Packs': FilterFunctionProps;
  'SearchFilters.Chooser': SearchSelectProps;
  Card: CardDetailProps;
  'Card.Investigators': CardInvestigatorProps;
  'Card.Faq': CardFaqProps;
  'Card.Image': CardImageProps;
  'Card.Swipe': CardDetailSwipeProps;
  'Card.Taboo': CardTabooProps;
  'Browse.InvestigatorCards': InvestigatorCardsProps;

  // Campaign screens
  Campaign: CampaignDetailProps;
  'Campaign.New': undefined;
  'Campaign.AddResult': AddScenarioResultProps;
  'Campaign.Access': CampaignAccessProps;
  'Campaign.Log': CampaignLogViewProps;
  'Campaign.Scenarios': CampaignScenariosViewProps;
  'Campaign.EditResult': EditScenarioResultProps;
  'Campaign.Tarot': TarotCardReadingProps;
  'Campaign.UpgradeDecks': UpgradeDecksProps;

  // Campaign guide screens
  'Guide.Log': CampaignLogProps;
  'Guide.SideScenario': AddSideScenarioProps;
  'Guide.ExileSelector': SelectExileCardsProps;
  'Guide.CardErrata': EncounterCardErrataProps;
  'Guide.ScenarioFaq': ScenarioFaqProps;
  'Guide.ChallengeScenario': ChallengeScenarioProps;
  'Guide.Achievements': CampaignAchievementsProps;
  'Guide.Rules': CampaignRulesProps;
  'Guide.LocationSetup': LocationSetupProps;
  'Guide.WeaknessSet': WeaknessSetProps;
  'Guide.CardSelector': CardSelectorProps;

  // Chaos bag and odds calculator screens
  'Guide.DrawChaosBag': GuideDrawChaosBagProps;
  'Guide.OddsCalculator': GuideOddsCalculatorProps;
  'Campaign.DrawChaosBag': CampaignDrawChaosBagProps;
  'Dialog.EditChaosBag': EditChaosBagProps;
  'OddsCalculator': OddsCalculatorProps;
  'SimpleChaosBag': undefined;

  // Dialog screens
  'Dialog.CampaignDrawWeakness': CampaignDrawWeaknessProps;
  'Dialog.CampaignEditWeakness': CampaignEditWeaknessProps;

  // Settings screens
  'My.Collection': CollectionEditProps;
  'My.Spoilers': undefined;
  'Settings.Diagnostics': undefined;
  'Settings.Backup': BackupProps;
  'Settings.MergeBackup': MergeBackupProps;
  'Settings.ReleaseNotes': undefined;
  'About': undefined;
  'Rules': undefined;
  'Rule': RuleViewProps;
  'Pack': PackCardsProps;
  'Tarot': TarotProps;

  // Campaign guide screens (root level)
  'Guide.Campaign': CampaignGuideProps;
  'Guide.Scenario': ScenarioProps;
  'Guide.LinkedCampaign': LinkedCampaignGuideProps;
  'Guide.Standalone': StandaloneGuideProps;

  // Dialog screens (root level)
  'Dialog.Campaign': SelectCampaignProps;

  // Social screens
  Friends: FriendsViewProps;
}

// Cards Stack Navigator types (within Cards tab)
export type CardsStackParamList = BasicStackParamList & {
  BrowseCards: undefined;
};

// Root Stack Navigator types (screens that cover entire app)
export type RootStackParamList = BasicStackParamList & {
  Tabs: undefined;

  // Deck screens (root level)
  Deck: DeckDetailProps;
  'Deck.New': NewDeckProps;
  'Deck.NewOptions': NewDeckOptionsProps;
  'Deck.Edit': EditDeckProps;
  'Deck.Checklist': DeckChecklistProps;
  'Deck.EditSpecial': EditSpecialCardsProps;
  'Deck.EditAddCards': EditDeckProps;
  'Deck.DraftCards': DeckDraftProps;
  'Deck.Upgrade': UpgradeDeckProps;
  'Deck.Description': DeckDescriptionProps;
  'Dialog.CardUpgrade': CardUpgradeDialogProps;
  'Deck.History': DeckHistoryProps;
  'Deck.Charts': DeckChartsProps;
  'Deck.DrawSimulator': DrawSimulatorProps;
  'Settings.SafeMode': SafeModeViewProps;

  // Weakness screens (root level)
  'Weakness.Draw': DrawWeaknessProps;

  // Dialog screens (root level)
  'Dialog.DeckSelector': MyDecksSelectorProps;
  'Campaign.Map': CampaignMapProps;
};


// Decks Stack Navigator types (within Decks tab)
export type DecksStackParamList = BasicStackParamList & {
  MyDecks: undefined;
};

// Campaigns Stack Navigator types (within Campaigns tab)
export type CampaignsStackParamList = BasicStackParamList & {
  MyCampaigns: undefined;
};

// Settings Stack Navigator types (within Settings tab)
export type SettingsStackParamList = BasicStackParamList & {
  Settings: undefined;
};

// Tab Navigator types
export type TabParamList = {
  CardsTab: undefined;
  DecksTab: undefined;
  CampaignsTab: undefined;
  SettingsTab: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}