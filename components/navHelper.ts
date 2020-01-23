import React from 'react';
import { Platform } from 'react-native';
import { Navigation, Options, OptionsModalPresentationStyle } from 'react-native-navigation';
import { t } from 'ttag';

import { DeckChartsProps } from './DeckChartsView';
import { DrawSimulatorProps } from './DrawSimulatorView';
import { CardDetailProps } from './CardDetailView';
import { CardDetailSwipeProps } from './CardDetailSwipeView';
import { DeckDetailProps } from './DeckDetailView';
import { Deck, ParsedDeck, Slots } from '../actions/types';
import { FACTION_DARK_GRADIENTS } from '../constants';
import Card from '../data/Card';
import { iconsMap } from '../app/NavIcons';
import { COLORS } from '../styles/colors';

export function getDeckOptions(
  investigator?: Card,
  modal?: boolean,
  title?: string
): Options {
  return {
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
      title: {
        fontWeight: 'bold',
        text: (investigator ? investigator.name : t`Deck`),
        color: '#FFFFFF',
      },
      subtitle: {
        text: title,
        color: '#FFFFFF',
      },
      background: {
        color: FACTION_DARK_GRADIENTS[
          (investigator ? investigator.faction_code : null) || 'neutral'
        ][0],
      },
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
      animate: true,
    },
  };
}

export function showDeckModal(
  componentId: string,
  deck: Deck,
  investigator?: Card,
  campaignId?: number
) {
  /* if (Platform.OS === 'ios' && Platform.isPad && false) {
    Navigation.showModal({
      splitView: {
        id: 'SPLIT_DECK_EDIT',
        master: {
          stack: {
            id: 'MASTER_ID',
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
            id: 'DETAILS_ID',
            children: [
              {
                component: {
                  name: 'Deck',
                  passProps: {
                    id: deck.id,
                    isPrivate: true,
                    modal: true,
                    campaignId,
                    title: investigator.name,
                  },
                  options: getDeckOptions(investigator),
                },
              },
            ],
          },
        },
        options: {
          displayMode: 'visible',
        },
      },
    });
  } else { */
  const passProps: DeckDetailProps = {
    id: deck.id,
    isPrivate: true,
    modal: true,
    campaignId,
    title: investigator ? investigator.name : t`Deck`,
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
      },
      options,
    },
  });
}

export default {
  showDeckModal,
  getDeckOptions,
  showCard,
};
