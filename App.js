import { Navigation } from 'react-native-navigation';

import ArkhamIcon from './assets/ArkhamIcon';

import { YellowBox } from 'react-native';
export default class App {
  constructor() {
    this.populateIcons()
      .then((iconMap) => this.startApp(iconMap))
      .catch(error => console.log(error));
  }

  populateIcons() {
    return new Promise(function(resolve, reject) {
      Promise.all(
        [
          ArkhamIcon.getImageSource('elder_sign', 30),
          ArkhamIcon.getImageSource('intellect', 26),
          ArkhamIcon.getImageSource('per_investigator', 24),
        ]
      ).then((values) => {
        resolve({
          elderSignIcon: values[0],
          intellectIcon: values[1],
          investigatorIcon: values[2],
        });
      }).catch((error) => {
        console.log(error);
        reject(error);
      }).done();
    });
  }

  startApp(icons) {
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
          icon: icons.elderSignIcon,
        },
        {
          label: 'Search',
          screen: 'Search',
          title: 'Search',
          icon: icons.intellectIcon,
        },
        {
          label: 'My Decks',
          screen: 'Settings',
          title: 'My Decks',
          icon: icons.investigatorIcon,
        },
      ],
    });
  }
}
