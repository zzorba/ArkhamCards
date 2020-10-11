import React from 'react';
import { ActionSheetIOS, Platform, Linking } from 'react-native';
import { Navigation, OptionsTopBar, Options, OptionsModalPresentationStyle } from 'react-native-navigation';
import AndroidDialogPicker from 'react-native-android-dialog-picker';
import { InAppBrowser } from '@matt-block/react-native-in-app-browser';
import { t } from 'ttag';

import { DeckChartsProps } from '@components/deck/DeckChartsView';
import { DrawSimulatorProps } from '@components/deck/DrawSimulatorView';
import { DeckDetailProps } from '@components/deck/DeckDetailView';
import { CardDetailProps } from '@components/card/CardDetailView';
import { CardDetailSwipeProps } from '@components/card/CardDetailSwipeView';
import { Deck, ParsedDeck, Slots } from '@actions/types';
import Card from '@data/Card';
import { iconsMap } from '@app/NavIcons';
import { CardImageProps } from '@components/card/CardImageView';
import { ThemeColors } from '@styles/theme';
import { StyleContextType } from '@styles/StyleContext';
import Database from '@data/Database';
import { where } from '@data/query';
import { startsWith } from 'lodash';

export function getDeckOptions(
  colors: ThemeColors,
  {
    inputOptions = {},
    modal,
    title,
    noTitle,
  }: {
    inputOptions?: Options;
    modal?: boolean;
    title?: string;
    noTitle?: boolean;
  } = {},
  investigator?: Card,
): Options {
  const topBarOptions: OptionsTopBar = inputOptions.topBar || {};
  const options: Options = {
    statusBar: {
      style: 'light',
    },
    modalPresentationStyle: Platform.OS === 'ios' ?
      OptionsModalPresentationStyle.overFullScreen :
      OptionsModalPresentationStyle.overCurrentContext,
    topBar: {
      backButton: {
        title: t`Back`,
        color: '#FFFFFF',
        ...topBarOptions.backButton,
      },
      leftButtons: modal ? [
        Platform.OS === 'ios' ? {
          text: t`Done`,
          id: 'back',
          color: 'white',
        } : {
          icon: iconsMap['arrow-left'],
          id: 'androidBack',
          color: 'white',
        },
      ] : topBarOptions.leftButtons || [],
      background: {
        color: colors.faction[
          (investigator ? investigator.faction_code : null) || 'neutral'
        ].darkBackground,
      },
      rightButtons: topBarOptions.rightButtons,
    },
    layout: {
      backgroundColor: colors.L30,
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
      animate: true,
    },
  };
  if (!noTitle && options.topBar) {
    options.topBar.title = {
      fontFamily: 'Alegreya-Medium',
      fontSize: 20,
      text: (investigator ? investigator.name : t`Deck`),
      color: '#FFFFFF',
    };
    options.topBar.subtitle = {
      text: title,
      fontFamily: 'Alegreya-Medium',
      fontSize: 14,
      color: '#FFFFFF',
    };
  }
  return options;
}

export function showDeckModal(
  componentId: string,
  deck: Deck,
  colors: ThemeColors,
  investigator?: Card,
  campaignId?: number,
  hideCampaign?: boolean,
) {
  const passProps: DeckDetailProps = {
    id: deck.id,
    isPrivate: true,
    modal: true,
    campaignId,
    title: investigator ? investigator.name : t`Deck`,
    subtitle: deck.name,
    hideCampaign,
  };

  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: 'Deck',
          passProps,
          options: getDeckOptions(colors, {
            modal: true,
            title: deck.name,
          }, investigator),
        },
      }],
    },
  });
}

export function showCard(
  componentId: string,
  code: string,
  card: Card,
  colors: ThemeColors,
  showSpoilers?: boolean,
  tabooSetId?: number
) {
  Navigation.push<CardDetailProps>(componentId, {
    component: {
      name: 'Card',
      passProps: {
        id: code,
        pack_code: card.pack_code,
        showSpoilers: !!showSpoilers,
        tabooSetId,
      },
      options: {
        topBar: {
          backButton: {
            title: t`Back`,
            color: colors.M,
          },
        },
      },
    },
  });
}

export function showCardCharts(
  componentId: string,
  parsedDeck: ParsedDeck,
  colors: ThemeColors
) {
  Navigation.push<DeckChartsProps>(componentId, {
    component: {
      name: 'Deck.Charts',
      passProps: {
        parsedDeck,
      },
      options: getDeckOptions(colors, {
        title: t`Charts`,
      }, parsedDeck.investigator),
    },
  });
}

export function showDrawSimulator(
  componentId: string,
  parsedDeck: ParsedDeck,
  colors: ThemeColors
) {
  const {
    slots,
    investigator,
  } = parsedDeck;
  Navigation.push<DrawSimulatorProps>(componentId, {
    component: {
      name: 'Deck.DrawSimulator',
      passProps: {
        slots,
      },
      options: getDeckOptions(
        colors,
        {
          title: t`Draw Simulator`,
        },
        investigator),
    },
  });
}

export function showCardSwipe(
  componentId: string,
  cards: Card[],
  index: number,
  colors: ThemeColors,
  showSpoilers?: boolean,
  tabooSetId?: number,
  deckCardCounts?: Slots,
  onDeckCountChange?: (code: string, count: number) => void,
  investigator?: Card,
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => React.ReactNode,
) {
  const options = investigator ?
    getDeckOptions(colors, { title: '' }, investigator) :
    {
      topBar: {
        backButton: {
          title: t`Back`,
          color: colors.M,
        },
      },
    };
  Navigation.push<CardDetailSwipeProps>(componentId, {
    component: {
      name: 'Card.Swipe',
      passProps: {
        cards,
        initialIndex: index,
        showSpoilers: !!showSpoilers,
        tabooSetId,
        deckCardCounts,
        onDeckCountChange,
        renderFooter,
        whiteNav: !!investigator,
      },
      options,
    },
  });
}

export function showOptionDialog(
  title: string,
  options: string[],
  onSelect: (index: number) => void,
) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: title,
        options: [...options, t`Cancel`],
        cancelButtonIndex: options.length,
      },
      idx => {
        if (idx !== options.length) {
          onSelect(idx);
        }
        return 0;
      }
    );
  } else {
    AndroidDialogPicker.show(
      {
        title,
        items: options,
        cancelText: t`Cancel`,
      },
      onSelect
    );
  }
}

export function showCardImage(componentId: string, card: Card, colors: ThemeColors) {
  const faction = card.factionCode();
  Navigation.push<CardImageProps>(componentId, {
    component: {
      name: 'Card.Image',
      passProps: {
        id: card.code,
      },
      options: {
        topBar: {
          backButton: {
            title: t`Back`,
            color: '#FFFFFF',
          },
          background: {
            color: faction ? colors.faction[faction].background : colors.background,
          },
          title: {
            text: card.name,
            color: faction ? '#FFFFFF' : colors.darkText,
          },
        },
        bottomTabs: {
          visible: false,
          drawBehind: true,
          animate: true,
        },
      },
    },
  });
}

export async function openUrl(
  url: string,
  context: StyleContextType,
  db: Database,
  componentId: string,
  tabooSetId?: number,
) {
  const card_regex = /\/card\/(\d+)/;
  const card_match = url.match(card_regex);

  if (card_match) {
    const code = card_match[1];
    const card = await db.getCard(
      where('c.code = :code', { code }),
      tabooSetId
    );
    if (card) {
      showCard(componentId, code, card, context.colors);
      return;
    }
  }

  const rule_regex = /^((https:\/\/arkhamdb.com)?\/rules)?#(.+)$/;
  const rule_match = url.match(rule_regex);
  if (rule_match) {
    const rule_id = rule_match[3];
    const rules = await db.getRules(0, 1, where('r.id = :rule_id', { rule_id }));
    if (rules.length) {
      Navigation.push(componentId, {
        component: {
          name: 'Rule',
          passProps: {
            rule: rules[0],
          },
          options: {
            topBar: {
              backButton: {
                title: t`Back`,
              },
              title: {
                text: rules[0].title,
              },
            },
          },
        },
      });
      return;
    }
  }

  if (startsWith(url, '/')) {
    url = `https://arkhamdb.com${url}`;
  }

  if (url.indexOf('arkhamdb.com') !== -1) {
    InAppBrowser.open(url).catch(() => {
      Linking.openURL(url);
    });
  }
}

export default {
  showDeckModal,
  getDeckOptions,
  showCard,
  showOptionDialog,
  openUrl,
};
