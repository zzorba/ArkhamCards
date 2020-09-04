import Crashes from 'appcenter-crashes';
import { forEach } from 'lodash';
import { Navigation, Options } from 'react-native-navigation';
import { TouchableOpacity, Platform, Linking, LogBox, Alert } from 'react-native';
import { Appearance } from 'react-native-appearance';
import DeepLinking from 'react-native-deep-linking';
import { Action, Store } from 'redux';
import { t } from 'ttag';

import { changeLocale } from './i18n';
import { iconsLoaded, iconsMap } from './NavIcons';
import COLORS from '@styles/colors';
import { getLangPreference, AppState } from '@reducers';

const BROWSE_CARDS = 'BROWSE_CARDS';
const BROWSE_DECKS = 'BROWSE_DECKS';
const BROWSE_CAMPAIGNS = 'BROWSE_CAMPAIGNS';
const BROWSE_SETTINGS = 'BROWSE_SETTINGS';

// @ts-ignore ts2339
TouchableOpacity.defaultProps = {
  // @ts-ignore ts2339
  ...(TouchableOpacity.defaultProps || {}),
  delayPressIn: 0,
};

export default class App {
  started: boolean;
  currentLang: string;

  constructor(store: Store<AppState, Action>) {
    this.started = false;
    this.currentLang = 'en';
    store.subscribe(this.onStoreUpdate.bind(this, store));

    this.initialAppStart(store).then(safeMode => {
      if (!safeMode) {
        this.setupAppEventHandlers(true);
      }
    });
  }

  setupAppEventHandlers(initial: boolean) {
    Linking.addEventListener('url', this._handleUrl);

    // We handle arkham cards schema-ref
    DeepLinking.addScheme('arkhamcards://');

    Appearance.addChangeListener(({ colorScheme }) => {
      this.setDefaultOptions(colorScheme, true);
    });

    if (initial) {
      Linking.getInitialURL().then((url) => {
        if (url) {
          this._handleUrl({ url });
        }
      });
    }
  }

  static crashDeltaSeconds(report: Crashes.ErrorReport) {
    if (Platform.OS === 'android') {
      const startTime = parseInt(`${report.appStartTime}`, 10) / 1000;
      const endTime = parseInt(`${report.appErrorTime}`, 10) / 1000;
      return (endTime - startTime) / 60;
    }
    if (typeof report.appErrorTime === 'number' && typeof report.appStartTime === 'number') {
      return (report.appErrorTime - report.appStartTime) / 60;
    }
    return 0;
  }

  async initialAppStart(store: Store<AppState, Action>): Promise<boolean> {
    try {
      const previousCrash = await Crashes.hasCrashedInLastSession();
      if (previousCrash) {
        const report = await Crashes.lastSessionCrashReport();
        const deltaSeconds = App.crashDeltaSeconds(report);
        if (deltaSeconds < 20) {
          this.startSafeMode(store);
          return true;
        }
      }
    } catch (error) {
      // Who crash reports the crash report system.
      console.log(error);
    }
    // Start normally
    this.onStoreUpdate(store, true);
    return false;
  }

  onStoreUpdate(store: Store<AppState, Action>, appStart?: boolean) {
    if (this.started || appStart) {
      const lang = getLangPreference(store.getState());
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
  }

  _handleUrl = ({ url }: { url: string }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };

  setDefaultOptions(colorScheme: 'light' | 'dark' | 'no-preference', changeUpdate?:boolean) {
    const darkMode = colorScheme === 'dark';
    const backgroundColor = Platform.select({
      ios: COLORS.background,
      android: darkMode ? '#000000' : '#FFFFFF',
    });
    const darkText = Platform.select({
      ios: COLORS.darkText,
      android: darkMode ? '#FFFFFF' : '#000000',
    });
    const defaultOptions: Options = {
      topBar: {
        leftButtonColor: COLORS.lightBlue,
        rightButtonColor: COLORS.lightBlue,
        rightButtonDisabledColor: COLORS.lightText,
        leftButtonDisabledColor: COLORS.lightText,
        title: {
          color: darkText,
        },
        background: {
          color: Platform.select({
            ios: COLORS.background,
            android: darkMode ? '#000000' : '#FFFFFF',
          }),
          translucent: false,
        },
        barStyle: darkMode ? 'black' : 'default',
      },
      layout: Platform.select({
        android: {
          componentBackgroundColor: backgroundColor,
          // backgroundColor: backgroundColor,
        },
        ios: {
          backgroundColor: COLORS.background,
        },
      }),
      navigationBar: {
        backgroundColor: 'default',
      },
      bottomTabs: {
        barStyle: darkMode ? 'black' : 'default',
        backgroundColor: backgroundColor,
        translucent: true,
      },
      bottomTab: {
        iconColor: darkMode ? '#bbb' : '#444',
        textColor: darkMode ? '#eee' : '#000',
        selectedIconColor: COLORS.lightBlue,
        selectedTextColor: COLORS.lightBlue,
      },
    };
    Navigation.setDefaultOptions(defaultOptions);
    if (changeUpdate) {
      forEach([BROWSE_CARDS, BROWSE_DECKS, BROWSE_CAMPAIGNS, BROWSE_SETTINGS], componentId => {
        Navigation.mergeOptions(componentId, defaultOptions);
      });
    }
  }

  startSafeMode(store: Store<AppState, Action>) {
    const lang = getLangPreference(store.getState());
    changeLocale(lang || 'en');
    this.started = true;
    this.currentLang = lang;
    Navigation.setRoot({
      root: {
        stack: {
          children: [{
            component: {
              name: 'Settings.SafeMode',
              options: {
                topBar: {
                  visible: false,
                },
              },
              passProps: {
                startApp: () => {
                  this.startApp(lang);
                }
              }
            },
          }],
        },
      },
    });
  }

  startApp(lang?: string) {
    changeLocale(lang || 'en');
    if (__DEV__) {
      LogBox.ignoreLogs([
        'Warning: Failed prop type: Invalid prop `titleStyle` of type `array` supplied to `SettingsCategoryHeader`, expected `object`.',
        'Warning: Failed prop type: DialogSwitch: prop type `labelStyle` is invalid;',
        'Warning: `flexWrap: `wrap`` is not supported with the `VirtualizedList` components.' +
        'Consider using `numColumns` with `FlatList` instead.',
        'Require cycle: node_modules/typeorm/browser/index.js',
      ]);
    }

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
              testID: 'NewDeck',
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
              testID: 'NewCampaign',
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
        id: BROWSE_CARDS,
        children: [browseCards],
        options: {
          bottomTab: {
            text: t`Cards`,
            icon: iconsMap.cards,
            testId: 'Bottom_Cards',
          },
        },
      },
    }, {
      stack: {
        id: BROWSE_DECKS,
        children: [browseDecks],
        options: {
          bottomTab: {
            text: t`Decks`,
            icon: iconsMap.deck,
            testId: 'Bottom_Decks',
          },
        },
      },
    }, {
      stack: {
        id: BROWSE_CAMPAIGNS,
        children: [browseCampaigns],
        options: {
          bottomTab: {
            text: t`Campaigns`,
            icon: iconsMap.book,
            testId: 'Bottom_Campaigns',
          },
        },
      },
    }, {
      stack: {
        id: BROWSE_SETTINGS,
        children: [settings],
        options: {
          bottomTab: {
            text: t`Settings`,
            icon: iconsMap.settings,
            testId: 'Bottom_Settings',
          },
        },
      },
    }];

    this.setDefaultOptions(Appearance.getColorScheme());

    Navigation.setRoot({
      root: {
        bottomTabs: {
          children: tabs,
        },
      },
    });
  }
}
