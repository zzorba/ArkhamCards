import { Deck } from '@actions/types';
import LatestDeckT from './LatestDeckT';

export default interface DeckT extends LatestDeckT {
  nextDeck: () => Deck | undefined;
}
