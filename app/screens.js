import { Navigation } from 'react-native-navigation';

import DeckView from '../components/deck/DeckView';
import CardSearchView from '../components/cards/CardSearchView';
import Home from '../components/Home';
import Settings from '../components/Settings';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('Home', () => Home, store, Provider);
  Navigation.registerComponent('Deck', () => DeckView, store, Provider);
  Navigation.registerComponent('Search', () => CardSearchView, store, Provider);
  Navigation.registerComponent('Settings', () => Settings, store, Provider);
}
