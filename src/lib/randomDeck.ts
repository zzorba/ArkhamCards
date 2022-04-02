import { DeckMeta, Slots, TOO_FEW_CARDS } from '@actions/types';
import { RANDOM_BASIC_WEAKNESS } from '@app_constants';
import specialCards from '@data/deck/specialCards';
import specialMetaSlots from '@data/deck/specialMetaSlots';
import Card, { CardsMap } from '@data/types/Card';
import { forEach, pullAt, random, shuffle, take } from 'lodash';
import { useMemo } from 'react';
import { SharedValue, withTiming } from 'react-native-reanimated';
import DeckValidation from './DeckValidation';

const VERBOSE = false;
export default function randomDeck(
  investigatorCode: string,
  investigatorBack: Card,
  meta: DeckMeta,
  possibleCards: Card[],
  cards: CardsMap,
  progress: SharedValue<number>
) {
  VERBOSE && console.log('\n\n\n\n****RANDOM DECK TIME****');
  const deckCards: Card[] = [];
  const localPossibleCards = [...possibleCards];
  const slots: Slots = {};
  forEach(investigatorBack.deck_requirements?.card || [], req => {
    if (req.code) {
      const card = cards[req.code];
      if (card) {
        slots[req.code] = card.deck_limit || 1;
        deckCards.push(card);
        VERBOSE && console.log(`Adding required card: ${card.name}`);
      }
    }
  });
  forEach(investigatorBack.deck_requirements?.random || [], req => {
    if (req.target == 'subtype' && req.value === 'basicweakness') {
      slots[RANDOM_BASIC_WEAKNESS] = 1;
    }
  });

  forEach(meta, (value, key) => {
    const specialSlots = specialMetaSlots(investigatorCode, { key: key as keyof DeckMeta, value });
    if (specialSlots) {
      forEach(specialSlots, (count, code) => {
        slots[code] = count;
      });
    }
  });
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
      return slots;
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
    })
  }
  if (specialBack) {
    forEach(take(shuffle(specialBack.codes), specialBack.min), code => {
      slots[code] = 1;
    })
  }

  VERBOSE && console.log(slots);
  return slots;
}
