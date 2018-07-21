import listOfDecks from '../listOfDecks';
import deckRowWithDetails from '../deckRowWithDetails';

export default listOfDecks(
  deckRowWithDetails(null, {
    compact: false,
    viewDeckButton: false,
  }), {
    deckLimit: 4,
  },
);
