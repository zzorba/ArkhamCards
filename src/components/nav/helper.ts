import React from 'react';
import { ActionSheetIOS, Platform } from 'react-native';
import { Navigation, Options, OptionsModalPresentationStyle } from 'react-native-navigation';
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
  investigator?: Card,
  modal?: boolean,
  title?: string,
  noTitle?: boolean,
): Options {
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
      ] : [],
      background: {
        color: COLORS.faction[
          (investigator ? investigator.faction_code : null) || 'neutral'
        ].darkBackground,
      },
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
      fontWeight: 'bold',
      text: (investigator ? investigator.name : t`Deck`),
      color: '#FFFFFF',
    };
    options.topBar.subtitle = {
      text: title,
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
          options: getDeckOptions(investigator, true, deck.name),
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
            color: COLORS.navButton,
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
      options: getDeckOptions(parsedDeck.investigator, false, t`Charts`),
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
      options: getDeckOptions(investigator, false, t`Draw Simulator`),
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
    getDeckOptions(investigator, false, '') :
    {
      topBar: {
        backButton: {
          title: t`Back`,
          color: COLORS.navButton,
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
