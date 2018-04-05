import { Navigation } from 'react-native-navigation';

import DeckView from '../components/deck/DeckView';
import CardSearchView from '../components/cards/CardSearchView';
import CardDetailView from '../components/cards/CardDetailView';
import Home from '../components/Home';
import SettingsTab from '../components/settings/SettingsTab';
import PackCardsView from '../components/packs/PackCardsView';
import SpoilersView from '../components/settings/SpoilersView';
import CollectionEditView from '../components/packs/CollectionEditView';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('Home', () => Home, store, Provider);
  Navigation.registerComponent('Card', () => CardDetailView, store, Provider);
  Navigation.registerComponent('Deck', () => DeckView, store, Provider);
  Navigation.registerComponent('Search', () => CardSearchView, store, Provider);
  Navigation.registerComponent('Settings', () => SettingsTab, store, Provider);
  Navigation.registerComponent('CollectionEdit', () => CollectionEditView, store, Provider);
  Navigation.registerComponent('Pack', () => PackCardsView, store, Provider);
  Navigation.registerComponent('EditSpoilers', () => SpoilersView, store, Provider);
}
