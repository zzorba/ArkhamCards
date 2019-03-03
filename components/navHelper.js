import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';

import L from '../app/i18n';
import { FACTION_DARK_GRADIENTS } from '../constants';

export function getDeckOptions(investigator) {
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
        text: investigator.name,
        color: '#FFFFFF',
      },
      subtitle: {
        color: '#FFFFFF',
      },
      background: {
        color: FACTION_DARK_GRADIENTS[investigator.faction_code][0],
      },
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
      animate: true,
    },
  };
}

export function showDeckModal(componentId, deck, investigator, campaignId) {
  if (Platform.OS === 'ios' && Platform.isPad && false) {
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
  } else {
    Navigation.showModal({
      stack: {
        children: [{
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
        }],
      },
    });
  }
}

export function showCard(componentId, code, card, showSpoilers) {
  Navigation.push(componentId, {
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
