import React from 'react';
import { ActionSheetIOS, Platform } from 'react-native';
import { Navigation, OptionsTopBar, Options, OptionsModalPresentationStyle } from 'react-native-navigation';
import AndroidDialogPicker from 'react-native-android-dialog-picker';
import { t } from 'ttag';

import { DeckChartsProps } from '@components/deck/DeckChartsView';
import { DrawSimulatorProps } from '@components/deck/DrawSimulatorView';
import { DeckDetailProps } from '@components/deck/DeckDetailView';
import { CardDetailProps } from '@components/card/CardDetailView';
import { CardDetailSwipeProps } from '@components/card/CardDetailSwipeView';
import { Deck, ParsedDeck, Slots } from '@actions/types';
import Card from '@data/Card';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';

export function getDeckOptions(
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
        color: COLORS.faction[
          (investigator ? investigator.faction_code : null) || 'neutral'
        ].darkBackground,
      },
      rightButtons: topBarOptions.rightButtons,
    },
    layout: {
      backgroundColor: COLORS.L30,
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
          options: getDeckOptions({
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
            color: COLORS.M,
          },
        },
      },
    },
  });
}

export function showCardCharts(
  componentId: string,
  parsedDeck: ParsedDeck
) {
  Navigation.push<DeckChartsProps>(componentId, {
    component: {
      name: 'Deck.Charts',
      passProps: {
        parsedDeck,
      },
      options: getDeckOptions({
        title: t`Charts`,
      }, parsedDeck.investigator),
    },
  });
}

export function showDrawSimulator(
  componentId: string,
  parsedDeck: ParsedDeck
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
      options: getDeckOptions({
        title: t`Draw Simulator`,
      }, investigator),
    },
  });
}

export function showCardSwipe(
  componentId: string,
  cards: Card[],
  index: number,
  showSpoilers?: boolean,
  tabooSetId?: number,
  deckCardCounts?: Slots,
  onDeckCountChange?: (code: string, count: number) => void,
  investigator?: Card,
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => React.ReactNode,
) {
  const options = investigator ?
    getDeckOptions({ title: '' }, investigator) :
    {
      topBar: {
        backButton: {
          title: t`Back`,
          color: COLORS.M,
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

export default {
  showDeckModal,
  getDeckOptions,
  showCard,
  showOptionDialog,
};
