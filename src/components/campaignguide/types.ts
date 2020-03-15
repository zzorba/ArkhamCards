import { Deck } from 'actions/types';
import Card from 'data/Card';

export interface InvestigatorDeck {
  investigator: Card;
  deck: Deck;
}
