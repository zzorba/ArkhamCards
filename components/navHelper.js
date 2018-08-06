import { FACTION_DARK_GRADIENTS } from '../constants';

export function showDeckModal(navigator, deck, investigator, campaignId) {
  navigator.showModal({
    screen: 'Deck',
    title: deck.name,
    passProps: {
      id: deck.id,
      isPrivate: true,
      modal: true,
      campaignId,
    },
    navigatorStyle: {
      navBarBackgroundColor: FACTION_DARK_GRADIENTS[investigator.faction_code][0],
      navBarTextColor: '#FFFFFF',
      navBarSubtitleColor: '#FFFFFF',
      navBarButtonColor: '#FFFFFF',
      statusBarTextColorScheme: 'light',
    },
  });
}


export default {
  showDeckModal,
};
