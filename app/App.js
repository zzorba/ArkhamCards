import { Navigation } from 'react-native-navigation';
import { YellowBox } from 'react-native';

import { iconsMap, iconsLoaded } from './NavIcons';

export default class App {
  constructor() {
    iconsLoaded.then(() => {
      this.startApp();
    }).catch(error => console.log(error));
  }

  startApp() {
    YellowBox.ignoreWarnings([
      'Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.' +
      'Consider using `numColumns` with `FlatList` instead.',
      'Warning: Failed prop type: Invalid prop `rules.arkhamIconSpan.order` of type `number` supplied to `MarkdownView`, expected `function`.',
    ]);

    Navigation.startTabBasedApp({
      tabs: [
        {
          label: 'Browse',
          screen: 'Home', // this is a registered name for a screen
          title: 'Browse',
          icon: iconsMap.elder_sign,
        },
        {
          label: 'Search',
          screen: 'Search',
          title: 'Search',
          icon: iconsMap.intellect,
        },
        {
          label: 'My Decks',
          screen: 'Settings',
          title: 'My Decks',
          icon: iconsMap.per_investigator,
        },
      ],
    });
  }
}
