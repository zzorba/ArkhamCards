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


export default {
  showDeckModal,
  getDeckOptions,
};
