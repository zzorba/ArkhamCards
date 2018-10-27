import { Navigation } from 'react-native-navigation';

import { FACTION_DARK_GRADIENTS } from '../constants';

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
          },
          options: {
            statusBar: {
              style: 'light',
            },
            topBar: {
              backButton: {
                color: '#FFFFFF',
              },
              title: {
                text: deck.name,
                color: '#FFFFFF',
              },
              subtitle: {
                color: '#FFFFFF',
              },
              background: {
                color: FACTION_DARK_GRADIENTS[investigator.faction_code][0],
              },
            },
          },
        },
      }],
    },
  });
}


export default {
  showDeckModal,
};
