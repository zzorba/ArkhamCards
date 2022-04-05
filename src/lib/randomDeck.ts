import { concat, forEach, pullAt, random, shuffle, take, map, filter } from 'lodash';
import { SharedValue, withTiming } from 'react-native-reanimated';

import { DeckMeta, Slots, TOO_FEW_CARDS } from '@actions/types';
import specialCards from '@data/deck/specialCards';
import Card, { CardsMap } from '@data/types/Card';
import DeckValidation from './DeckValidation';
import { getCards } from './parseDeck';

const VERBOSE = false;
const MINI_VEROBSE = VERBOSE;

function randomAllowedCardHelper(
  validation: DeckValidation,
  possibleCodes: string[],
  cards: CardsMap,
  deckCards: Card[],
  in_collection: { [pack_code: string]: boolean },
  ignore_collection: boolean
): [Card | undefined, string[]] {
  const localPossibleCards = [...possibleCodes];
  let index = random(0, localPossibleCards.length - 1);
  let code: string = localPossibleCards[index];
  let card: Card | undefined = cards[code];
  while (true) {
    if (card && card.xp !== undefined) {
      validation.slots[code] = (validation.slots[code] || 0) + 1;
      const invalidCards: Card[] = validation.getInvalidCards([...deckCards, card]);
      const problem = validation.getProblem([...deckCards, card], true);

      // Put it back the way it was.
      validation.slots[code] = (validation.slots[code] || 0) - 1;
      if (!validation.slots[card.code]) {
        delete validation.slots[card.code];
      }

      if (!(
        (problem && problem.reason !== TOO_FEW_CARDS) ||
        card.collectionDeckLimit(in_collection, ignore_collection) < (validation.slots[card.code] || 0) ||
        invalidCards.length)) {
        // Found a good card
        break;
      }
    }

    // Card is no good, so remove it from contention.
    // As of April 5, 2022, there are no L0 cards that grant extra
    // class/card access, unless you count In the Thick of It.
    pullAt(localPossibleCards, index);
    if (localPossibleCards.length === 0) {
      card = undefined;
      break;
    }
    index = random(0, localPossibleCards.length - 1);
    code = localPossibleCards[index];
    card = cards[code];
  }
  return [card, localPossibleCards];
}

export function getDraftCards(
  investigatorBack: Card,
  meta: DeckMeta,
  slots: Slots,
  count: number,
  possibleCards: string[],
  cards: CardsMap,
  in_collection: { [pack_code: string]: boolean },
  ignore_collection: boolean
): [Card[], string[]] {
  const validation = new DeckValidation(investigatorBack, slots, meta);
  const draftCards: Card[] = [];
  let possibleCodes: string[] = possibleCards;
  const deckCards: Card[] = getCards(cards, slots, {});
  while (draftCards.length < count) {
    const [draftCard, newPossibleCodes] = randomAllowedCardHelper(
      validation,
      possibleCodes,
      cards,
      deckCards,
      in_collection,
      ignore_collection
    );
    if (!draftCard) {
      // Out of cards, return what we have
      return [draftCards, concat(newPossibleCodes, map(draftCards, c => c.code))];
    }
    draftCards.push(draftCard);
    possibleCodes = filter(newPossibleCodes, c => c !== draftCard.code);
  }

  return [draftCards, concat(possibleCodes, map(draftCards, c => c.code))];
}

export default function randomDeck(
  investigatorCode: string,
  investigatorBack: Card,
  meta: DeckMeta,
  possibleCodes: string[],
  cards: CardsMap,
  progress: SharedValue<number>,
  in_collection: { [pack_code: string]: boolean },
  ignore_collection: boolean
): [Slots, boolean] {
  VERBOSE && console.log('\n\n\n\n****RANDOM DECK TIME****');
  const deckCards: Card[] = [];
  let localPossibleCards: string[] = [...possibleCodes];
  const slots: Slots = {};
  const validation = new DeckValidation(investigatorBack, slots, meta);
  let deckSize = 0;
  while (deckSize < validation.getDeckSize()) {
    const [card, newPossibleCards] = randomAllowedCardHelper(validation, localPossibleCards, cards, deckCards, in_collection, ignore_collection);
    if (!card) {
      // Couldn't find a card, give up;
      return [slots, false];
    }
    localPossibleCards = newPossibleCards;
    VERBOSE && console.log(`Added: ${card.name}`);
    slots[card.code] = (slots[card.code] || 0) + 1;
    deckCards.push(card);
    if (!card.permanent) {
      deckSize++;
      progress.value = withTiming(deckSize * 1.0 / validation.getDeckSize());
    }
  }
  // Handle special cards, like for Lily/Parallel Roland
  const specialFront = specialCards[meta.alternate_front || investigatorCode]?.front
  const specialBack = specialCards[meta.alternate_back || investigatorCode]?.back;
  if (specialFront) {
    forEach(take(shuffle(specialFront.codes), specialFront.min), code => {
      slots[code] = 1;
      console.log(`SPECIAL[${code}] = 1`)
    })
  }
  if (specialBack) {
    forEach(take(shuffle(specialBack.codes), specialBack.min), code => {
      slots[code] = 1;
      console.log(`SPECIAL[${code}] = 1`)
    })
  }

  MINI_VEROBSE && console.log(slots);
  return [slots, true];
}
