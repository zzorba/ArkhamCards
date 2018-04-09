import { Navigation } from 'react-native-navigation';

import DeckView from '../components/deck/DeckView';
import DeckEditView from '../components/deck/DeckEditView';
import CardSearchView from '../components/cards/CardSearchView';
import CardDetailView from '../components/cards/CardDetailView';
import NewDeckView from '../components/deck/NewDeckView';
import FilterView from '../components/cards/FilterView';
import Home from '../components/Home';
import WebViewWrapper from '../components/WebViewWrapper';
import SettingsTab from '../components/settings/SettingsTab';
import PackCardsView from '../components/packs/PackCardsView';
import SpoilersView from '../components/settings/SpoilersView';
import CollectionEditView from '../components/packs/CollectionEditView';
import SortDialog from '../components/cards/CardSearchView/SortDialog';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('Home', () => Home, store, Provider);
  Navigation.registerComponent('Card', () => CardDetailView, store, Provider);
  Navigation.registerComponent('Deck', () => DeckView, store, Provider);
  Navigation.registerComponent('Deck.Edit', () => DeckEditView, store, Provider);
  Navigation.registerComponent('Deck.New', () => NewDeckView, store, Provider);
  Navigation.registerComponent('Search', () => CardSearchView, store, Provider);
  Navigation.registerComponent('Settings', () => SettingsTab, store, Provider);
  Navigation.registerComponent('SearchFilters', () => FilterView, store, Provider);
  Navigation.registerComponent('CollectionEdit', () => CollectionEditView, store, Provider);
  Navigation.registerComponent('Pack', () => PackCardsView, store, Provider);
  Navigation.registerComponent('EditSpoilers', () => SpoilersView, store, Provider);
  Navigation.registerComponent('WebView', () => WebViewWrapper, store, Provider);
  Navigation.registerComponent('Dialog.Sort', () => SortDialog, store, Provider);
}
