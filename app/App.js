import { Navigation } from 'react-native-navigation';
import { YellowBox } from 'react-native';

import { iconsLoaded } from './NavIcons';

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
      'Warning: Failed prop type: Invalid prop `rules.emMarkdown.order` of type `number` supplied to `MarkdownView`, expected `function`.',
      'Warning: Failed prop type: Invalid prop `rules.uTag.order` of type `number` supplied to `MarkdownView`, expected `function`.',
      'Warning: isMounted(...) is deprecated',
    ]);

    Navigation.startSingleScreenApp({
      screen: {
        screen: 'Home',
        title: 'Browse',
      },
      drawer: {
        right: {
          screen: 'Settings',
        },
        left: null,
        disableOpenGesture: true,
      },
    });
  }
}
