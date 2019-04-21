import { Navigation } from 'react-native-navigation';
import { Linking, YellowBox } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import { t } from 'ttag';

import { changeLocale } from './i18n';
import { iconsLoaded, iconsMap } from './NavIcons';
import { COLORS } from '../styles/colors';

export default class App {
  constructor(store) {
    this.started = false;
    this.currentLang = 'en';
    store.subscribe(this.onStoreUpdate.bind(this, store));
    this._handleUrl = this.handleUrl.bind(this);

    Navigation.setDefaultOptions({
      topBar: {
        buttonColor: COLORS.lightBlue,
        background: {
          color: 'white',
        },
      },
      layout: {
        backgroundColor: 'white',
      },
      bottomTab: {
        textColor: COLORS.darkGray,
        selectedIconColor: COLORS.lightBlue,
        selectedTextColor: COLORS.lightBlue,
      },
    });

    this.onStoreUpdate(store);
  }

  onStoreUpdate(store) {
    const lang = store.getState().cards.lang || 'en';

    // handle a root change
    // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
    if (!this.started || this.currentLang !== lang) {
      this.started = true;
      this.currentLang = lang;
      iconsLoaded.then(() => {
        this.startApp(lang);
      }).catch(error => console.log(error));
    }
  }

  handleUrl({ url }) {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  }

  startApp(lang) {
    changeLocale(lang || 'en');
    YellowBox.ignoreWarnings([
      'Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.' +
      'Consider using `numColumns` with `FlatList` instead.',
      'Warning: Failed prop type: Invalid prop `rules.emMarkdown.order` of type `number` supplied to `MarkdownView`, expected `function`.',
      'Warning: Failed prop type: Invalid prop `rules.uTag.order` of type `number` supplied to `MarkdownView`, expected `function`.',
      'Warning: isMounted(...) is deprecated',
    ]);

    // const isIpad = Platform.OS === 'ios' && Platform.isPad;

    /*
    isIpad ? {
      splitView: {
        id: 'BROWSE_TAB',
        master: {
          stack: {
            id: 'BROWSE_TAB_FILTERS_VIEW',
            children: [
              {
                component: {
                  name: 'Settings',
                },
              },
            ],
          },
        },
        detail: {
          stack: {
            id: 'BROWSE_TAB_CARD_VIEW',
            children: [{
              component: {
                name: 'Browse.Cards',
                options: {
                  topBar: {
                    title: {
                      text: t`Player Cards`,
                    },
                  },
                },
              },
            }],
          },
        },
        options: {
          splitView: {
            displayMode: 'visible',
            primaryEdge: 'trailing',
            minWidth: 100,
          },
          bottomTab: {
            text: t`Cards`,
            icon: iconsMap.cards,
          },
        },
      },
    } :*/
    const browseCards = {
      component: {
        name: 'Browse.Cards',
        options: {
          topBar: {
            title: {
              text: t`Player Cards`,
            },
          },
        },
      },
    };
    const browseDecks = {
      component: {
        name: 'My.Decks',
        options: {
          topBar: {
            title: {
              text: t`Decks`,
            },
            rightButtons: [{
              icon: iconsMap.add,
              id: 'add',
              color: COLORS.navButton,
            }],
          },
        },
      },
    };
    const browseCampaigns = {
      component: {
        name: 'My.Campaigns',
        options: {
          topBar: {
            title: {
              text: t`Campaigns`,
            },
            rightButtons: [{
              icon: iconsMap.add,
              id: 'add',
              color: COLORS.navButton,
            }],
          },
        },
      },
    };
    const settings = {
      component: {
        name: 'Settings',
        options: {
          topBar: {
            title: {
              text: t`Settings`,
            },
          },
        },
      },
    };
    const tabs = [{
      stack: {
        children: [browseCards],
        options: {
          bottomTab: {
            text: t`Cards`,
            icon: iconsMap.cards,
          },
        },
      },
    }, {
      stack: {
        children: [browseDecks],
        options: {
          bottomTab: {
            text: t`Decks`,
            icon: iconsMap.deck,
          },
        },
      },
    }, {
      stack: {
        children: [browseCampaigns],
        options: {
          bottomTab: {
            text: t`Campaigns`,
            icon: iconsMap.book,
          },
        },
      },
    }, {
      stack: {
        children: [settings],
        options: {
          bottomTab: {
            text: t`Settings`,
            icon: iconsMap.settings,
          },
        },
      },
    }];

    Navigation.setRoot({
      root: {
        bottomTabs: {
          children: tabs,
        },
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
