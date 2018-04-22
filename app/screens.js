import { Navigation } from 'react-native-navigation';

import DeckDetailView from '../components/DeckDetailView';
import DeckEditView from '../components/DeckEditView';
import CardSearchView from '../components/CardSearchView';
import CardDetailView from '../components/CardDetailView';
import NewDeckView from '../components/NewDeckView';
import DrawSimulatorView from '../components/DrawSimulatorView';
import DeckChartsView from '../components/DeckChartsView';
import CardFilterView from '../components/CardFilterView';
import CardTraitModal from '../components/CardTraitModal';
import BrowseDecksView from '../components/BrowseDecksView';
import WebViewWrapper from '../components/WebViewWrapper';
import SettingsTab from '../components/SettingsTab';
import PackCardsView from '../components/PackCardsView';
import SpoilersView from '../components/SpoilersView';
import CollectionEditView from '../components/CollectionEditView';
import CardSortDialog from '../components/CardSortDialog';
import HomeView from '../components/HomeView';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('Home', () => HomeView, store, Provider);
  Navigation.registerComponent('Browse.Cards', () => CardSearchView, store, Provider);
  Navigation.registerComponent('Browse.Decks', () => BrowseDecksView, store, Provider);
  Navigation.registerComponent('Deck', () => DeckDetailView, store, Provider);
  Navigation.registerComponent('Deck.Charts', () => DeckChartsView, store, Provider);
  Navigation.registerComponent('Deck.DrawSimulator', () => DrawSimulatorView, store, Provider);
  Navigation.registerComponent('Deck.Edit', () => DeckEditView, store, Provider);
  Navigation.registerComponent('Deck.New', () => NewDeckView, store, Provider);
  Navigation.registerComponent('Card', () => CardDetailView, store, Provider);
  Navigation.registerComponent('Settings', () => SettingsTab, store, Provider);
  Navigation.registerComponent('SearchFilters', () => CardFilterView, store, Provider);
  Navigation.registerComponent('SearchFilters.Trait', () => CardTraitModal, store, Provider);
  Navigation.registerComponent('CollectionEdit', () => CollectionEditView, store, Provider);
  Navigation.registerComponent('Pack', () => PackCardsView, store, Provider);
  Navigation.registerComponent('EditSpoilers', () => SpoilersView, store, Provider);
  Navigation.registerComponent('WebView', () => WebViewWrapper, store, Provider);
  Navigation.registerComponent('Dialog.Sort', () => CardSortDialog, store, Provider);
}
