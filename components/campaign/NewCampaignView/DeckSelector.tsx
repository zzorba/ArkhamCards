import listOfDecks from '../listOfDecks';
import deckRowWithDetails from '../deckRowWithDetails';

interface Props {}

const ComposedDeck = deckRowWithDetails<Props>({
  compact: false,
  viewDeckButton: false,
});

// @ts-ignore
export default listOfDecks<Props>(ComposedDeck);
