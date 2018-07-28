import { FACTION_DARK_GRADIENTS } from '../constants';

export function showDeckModal(navigator, deck, investigator) {
  navigator.showModal({
    screen: 'Deck',
    title: deck.name,
    passProps: {
      id: deck.id,
      isPrivate: true,
      modal: true,
    },
    navigatorStyle: {
      navBarBackgroundColor: FACTION_DARK_GRADIENTS[investigator.faction_code][0],
      navBarTextColor: '#FFFFFF',
      navBarButtonColor: '#FFFFFF',
    },
  });
}


export default {
  showDeckModal,
};
