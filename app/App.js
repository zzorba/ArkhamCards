import { Navigation } from 'react-native-navigation';
import { Linking, YellowBox } from 'react-native';
import DeepLinking from 'react-native-deep-linking';

import { iconsLoaded } from './NavIcons';

const LINK_PATHS = [
  '/redirect/auth\\?code=:code&state=:state',
  '/redirect/auth/\\?code=:code&state=:state',
];

export default class App {
  constructor() {
    this._handleAuthResponse = this.handleAuthResponse.bind(this);
    this._handleUrl = this.handleUrl.bind(this);
    iconsLoaded.then(() => {
      this.startApp();
    }).catch(error => console.log(error));
  }

  handleAuthResponse({ code, state }) {

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

    Linking.addEventListener('url', this._handleUrl);

    // We handle scrollapp and https (universal) links
    DeepLinking.addScheme('arkhamcards://');
    DeepLinking.addRoute('/scroll/auth/:code', this._handleAuthResponse);

    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleUrl({ url });
      }
    });
  }
}
