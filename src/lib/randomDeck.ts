import { DeckMeta, Slots, TOO_FEW_CARDS } from '@actions/types';
import specialCards from '@data/deck/specialCards';
import Card from '@data/types/Card';
import { forEach, pullAt, random, shuffle, take } from 'lodash';
import { SharedValue, withTiming } from 'react-native-reanimated';
import DeckValidation from './DeckValidation';

const VERBOSE = false;
const MINI_VEROBSE = VERBOSE;

export default function randomDeck(
  investigatorCode: string,
  investigatorBack: Card,
  meta: DeckMeta,
  possibleCards: Card[],
  progress: SharedValue<number>,
  in_collection: { [pack_code: string]: boolean },
  ignore_collection: boolean
): [Slots, boolean] {
  VERBOSE && console.log('\n\n\n\n****RANDOM DECK TIME****');
  const deckCards: Card[] = [];
  const localPossibleCards = [...possibleCards];
  const slots: Slots = {};
  const validation = new DeckValidation(investigatorBack, slots, meta);
  let deckSize = 0;
  while (deckSize < validation.getDeckSize()) {
    let index = random(0, localPossibleCards.length - 1);
    let card: Card | undefined = localPossibleCards[index];
    VERBOSE && console.log(`Trying: ${card.name}`);
    slots[card.code] = (slots[card.code] || 0) + 1;
    let invalidCards: Card[] = validation.getInvalidCards([...deckCards, card]);
    let problem = validation.getProblem([...deckCards, card], true);
    while (
      card.xp === undefined ||
      (problem && problem.reason !== TOO_FEW_CARDS) ||
      card.collectionDeckLimit(in_collection, ignore_collection) < (slots[card.code] || 0) ||
      invalidCards.length
    ) {
      VERBOSE && console.log(`\tRejected: ${card.name}`);

      slots[card.code] = (slots[card.code] || 0) - 1;
      if (!slots[card.code]) {
        delete slots[card.code];
      }
      if (problem?.reason !== 'investigator') {
        VERBOSE && console.log(`\t${card?.name} is invalid (${JSON.stringify(problem)}, skipping`);
      }
      pullAt(localPossibleCards, index);
      if (localPossibleCards.length === 0) {
        card = undefined;
        break;
      }

      index = random(0, localPossibleCards.length - 1);
      card = localPossibleCards[index];
      VERBOSE && console.log(`\tTrying: ${card.name}`);
      slots[card.code] = (slots[card.code] || 0) + 1;
      invalidCards = validation.getInvalidCards([...deckCards, card]);
      problem = validation.getProblem([...deckCards, card], true);
    }
    if (!card) {
      // Couldn't find a card, give up;
      return [slots, false];
    }
    VERBOSE && console.log(`Added: ${card.name}`);
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
