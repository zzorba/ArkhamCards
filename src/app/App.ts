import Crashes from 'appcenter-crashes';
import { forEach } from 'lodash';
import { Navigation, Options } from 'react-native-navigation';
import { TouchableOpacity, Platform, Linking, LogBox } from 'react-native';
import { Appearance } from 'react-native-appearance';
import DeepLinking from 'react-native-deep-linking';
import { Action, Store } from 'redux';
import { addEventListener as addLangEventListener } from 'react-native-localize';
import { t } from 'ttag';

import { changeLocale } from './i18n';
import { iconsLoaded, iconsMap } from './NavIcons';
import COLORS from '@styles/colors';
import { getLangPreference, AppState, getThemeOverride } from '@reducers';
import { DARK_THEME, LIGHT_THEME } from '@styles/theme';

const BROWSE_CARDS = 'BROWSE_CARDS';
const BROWSE_DECKS = 'BROWSE_DECKS';
export const BROWSE_CAMPAIGNS = 'BROWSE_CAMPAIGNS';
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
  currentThemeOverride?: 'light' | 'dark';

  constructor(store: Store<AppState, Action<string>>) {
    this.started = false;
    this.currentLang = 'en';
    this.currentThemeOverride = undefined;

    store.subscribe(this.onStoreUpdate.bind(this, store));
    addLangEventListener('change', () => this.onStoreUpdate(store));
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
    DeepLinking.addScheme('dissonantvoices://');

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

  async initialAppStart(store: Store<AppState, Action<string>>): Promise<boolean> {
    try {
      const previousCrash = await Crashes.hasCrashedInLastSession();
      if (previousCrash && !__DEV__) {
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

  onStoreUpdate(store: Store<AppState, Action<string>>, appStart?: boolean) {
    if (this.started || appStart) {
      const state = store.getState();
      const lang = getLangPreference(state);
      const themeOverride = getThemeOverride(state);
      // handle a root change
      // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
      if (!this.started || this.currentLang !== lang) {
        this.started = true;
        this.currentLang = lang;
        this.currentThemeOverride = themeOverride;
        iconsLoaded.then(() => {
          this.startApp(lang);
        }).catch(error => console.log(error));
        // tslint:disable-next-line
      } else if (this.currentThemeOverride !== themeOverride) {
        this.currentThemeOverride = themeOverride;
        this.setDefaultOptions(Appearance.getColorScheme(), true);
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

  setDefaultOptions(
    colorScheme: 'light' | 'dark' | 'no-preference',
    changeUpdate?: boolean
  ) {
    const system = !this.currentThemeOverride;
    const systemPreference = colorScheme === 'dark';
    const darkMode = system ? colorScheme === 'dark' : this.currentThemeOverride === 'dark';
    const colors = darkMode ? DARK_THEME : LIGHT_THEME;

    const defaultOptions: Options = {
      statusBar: {
        backgroundColor: colors.background,
        style: darkMode ? 'light' : 'dark',
      },
      topBar: {
        leftButtonColor: colors.M,
        rightButtonColor: colors.M,
        rightButtonDisabledColor: colors.lightText,
        leftButtonDisabledColor: colors.lightText,
        title: {
          color: colors.darkText,
          fontFamily: 'Alegreya-Medium',
          fontSize: 20,
        },
        subtitle: {
          color: colors.darkText,
          fontFamily: 'Alegreya-Medium',
          fontSize: 14,
        },
        background: {
          translucent: false,
          color: colors.L30,
          clipToBounds: false,
        },
        backButton: {
          color: colors.M,
        },
        barStyle: darkMode ? 'black' : 'default',
      },
      layout: Platform.select({
        android: {
          componentBackgroundColor: colors.L30,
        },
        ios: {
          backgroundColor: colors.L30,
          componentBackgroundColor: colors.L30,
        },
      }),
      navigationBar: {
        backgroundColor: 'default',
      },
      bottomTabs: {
        backgroundColor: colors.background,
        barStyle: darkMode ? 'black' : 'default',
        // Bug with RNN, translucent always inherits the system setting.
        translucent: systemPreference === darkMode,
      },
      bottomTab: {
        iconColor: colors.M,
        textColor: colors.M,
        selectedIconColor: colors.D30,
        selectedTextColor: colors.D30,
      },
    };
    Navigation.setDefaultOptions(defaultOptions);
    if (changeUpdate) {
      forEach([BROWSE_CARDS, BROWSE_DECKS, BROWSE_CAMPAIGNS, BROWSE_SETTINGS], componentId => {
        Navigation.mergeOptions(componentId, defaultOptions);
      });
    }
  }

  startSafeMode(store: Store<AppState, Action<string>>) {
    const state = store.getState();
    const lang = getLangPreference(state);
    changeLocale(lang || 'en');
    this.started = true;
    this.currentLang = lang;
    this.currentThemeOverride = getThemeOverride(state);
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
                },
              },
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
      LogBox.ignoreAllLogs(true);
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
            rightButtonColor: COLORS.M,
            rightButtons: [{
              icon: iconsMap.add,
              id: 'add',
              color: COLORS.M,
              accessibilityLabel: t`New Deck`,
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
            rightButtonColor: COLORS.M,
            rightButtons: [{
              icon: iconsMap.add,
              id: 'add',
              color: COLORS.M,
              accessibilityLabel: t`New Campaign`,
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

    const appearance = Appearance.getColorScheme();
    const tabs = [{
      stack: {
        id: BROWSE_CARDS,
        children: [browseCards],
        options: {
          bottomTab: {
            text: t`Cards`,
            icon: iconsMap.cards,
            testId: 'Bottom_Cards',
            popToRoot: true,
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
            popToRoot: true,
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
            popToRoot: true,
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
            testId: 'Bottom_Account',
            popToRoot: true,
          },
        },
      },
    }];

    this.setDefaultOptions(appearance);

    Navigation.setRoot({
      root: {
        bottomTabs: {
          children: tabs,
        },
      },
    });
  }
}
