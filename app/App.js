import { Navigation } from 'react-native-navigation';
import { Linking, YellowBox } from 'react-native';
import DeepLinking from 'react-native-deep-linking';

import { iconsLoaded, iconsMap } from './NavIcons';
import { COLORS } from '../styles/colors';
export default class App {
  constructor() {
    this._handleUrl = this.handleUrl.bind(this);
    iconsLoaded.then(() => {
      this.startApp();
    }).catch(error => console.log(error));
  }

  handleUrl({ url }) {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }

  startApp() {
    YellowBox.ignoreWarnings([
      'Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.' +
      'Consider using `numColumns` with `FlatList` instead.',
      'Warning: Failed prop type: Invalid prop `rules.emMarkdown.order` of type `number` supplied to `MarkdownView`, expected `function`.',
      'Warning: Failed prop type: Invalid prop `rules.uTag.order` of type `number` supplied to `MarkdownView`, expected `function`.',
      'Warning: isMounted(...) is deprecated',
    ]);

    Navigation.startTabBasedApp({
      tabs: [
        {
          label: 'Cards',
          title: 'Player Cards',
          icon: iconsMap.cards,
          screen: 'Browse.Cards',
        }, {
          label: 'Decks',
          title: 'Decks',
          icon: iconsMap.deck,
          screen: 'My.Decks',
        }, {
          label: 'Campaigns',
          title: 'Campaigns',
          icon: iconsMap.book,
          screen: 'My.Campaigns',
        }, {
          label: 'Settings',
          title: 'Settings',
          icon: iconsMap.settings,
          screen: 'Settings',
        },
      ],
      appStyle: {
        navBarBackgroundColor: 'white',
        screenBackgroundColor: 'white',
        tabBarSelectedButtonColor: COLORS.lightBlue,
      },
    });
    Linking.addEventListener('url', this._handleUrl);

    // We handle scrollapp and https (universal) links
    DeepLinking.addScheme('arkhamcards://');

    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleUrl({ url });
      }
    });
  }
}
