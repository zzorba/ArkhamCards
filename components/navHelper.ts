import { Navigation, Options } from 'react-native-navigation';

import L from '../app/i18n';
import { Deck } from '../actions/types';
import { FACTION_DARK_GRADIENTS } from '../constants';
import Card from '../data/Card';
import { CardDetailProps } from './CardDetailView';
import { DeckDetailProps } from './DeckDetailView';

export function getDeckOptions(investigator?: Card): Options {
  return {
    statusBar: {
      style: 'light',
    },
    topBar: {
      backButton: {
        title: L('Back'),
        color: '#FFFFFF',
      },
      title: {
        text: investigator ? investigator.name : L('Deck'),
        color: '#FFFFFF',
      },
      subtitle: {
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
    title: investigator ? investigator.name : L('Deck'),
  };

  Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: 'Deck',
          passProps,
          options: getDeckOptions(investigator),
        },
      }],
    },
  });
}

export function showCard(
  componentId: string,
  code: string,
  card: Card,
  showSpoilers?: boolean
) {
  Navigation.push<CardDetailProps>(componentId, {
    component: {
      name: 'Card',
      passProps: {
        id: code,
        pack_code: card.pack_code,
        showSpoilers: !!showSpoilers,
      },
      options: {
        topBar: {
          backButton: {
            title: L('Back'),
          },
        },
      },
    },
  });
}


export default {
  showDeckModal,
  getDeckOptions,
  showCard,
};
