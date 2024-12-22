import { concat, forEach, pullAt, random, shuffle, take, map, filter, sortBy, sumBy } from 'lodash';
import { SharedValue, withTiming } from 'react-native-reanimated';

import { DeckMeta, INVESTIGATOR_PROBLEM, Slots, TOO_FEW_CARDS } from '@actions/types';
import specialCards, { JOE_DIAMOND_CODE, LOLA_CODE, SUZI_CODE } from '@data/deck/specialCards';
import Card, { CardsMap, InvestigatorChoice } from '@data/types/Card';
import DeckValidation from './DeckValidation';
import { getCards } from './parseDeck';

const VERBOSE = false;
const MINI_VEROBSE = VERBOSE;

function getFactionLimitsCounts(deckCards: Card[], requiredClasses: number): [number, Set<string>] {
  const factionCounts: { [faction: string]: number | undefined } = {};
  forEach(deckCards, card => {
    if (card.faction_code) {
      factionCounts[card.faction_code] = (factionCounts[card.faction_code] ?? 0) + 1;
    }
    if (card.faction2_code) {
      factionCounts[card.faction2_code] = (factionCounts[card.faction2_code] ?? 0) + 1;
    }
    if (card.faction3_code) {
      factionCounts[card.faction3_code] = (factionCounts[card.faction3_code] ?? 0) + 1;
    }
  });
  const allFactions = shuffle(['guardian', 'seeker', 'rogue', 'mystic', 'survivor']);
  const topFactions = filter(
    take(
      sortBy(
        allFactions,
        (faction) => -(factionCounts[faction] ?? 0)
      ), requiredClasses
    ),
    (faction) => (factionCounts[faction] ?? 0) >= 7
  );
  const neededCardCount = sumBy(topFactions, (faction) => {
    return 7 - (factionCounts[faction] ?? 0);
  });

  return [neededCardCount, new Set(topFactions)];
}

function getSpecialInvestigatorPredicate(
  validation: DeckValidation,
  deckCards: Card[]
): undefined | ((card: Card) => boolean) {
  switch (validation.investigator.back.code) {
    case SUZI_CODE:
    case LOLA_CODE: {
      const requiredFactions = (validation.investigator.back.code === LOLA_CODE ? 3 : 5);
      const deckSize = validation.getDeckSize(deckCards);
      const drawDeckSize = sumBy(deckCards, (card) => card.permanent || card.subtype_code || card.restrictions_investigator ? 0 : 1);
      if (drawDeckSize + (requiredFactions * 7) < deckSize) {
        return undefined;
      }
      // We are in the last cards, so we need to start making sure we can make a legal deck.
      const [neededCardCount, allowedFactions] = getFactionLimitsCounts(deckCards, requiredFactions);
      if (drawDeckSize + neededCardCount < deckSize) {
        // No need for extraordinary measures yet.
        return undefined;
      }
      return (card: Card) => {
        return (
          !!card.faction_code && allowedFactions.has(card.faction_code)
        ) || (
          !!card.faction2_code && allowedFactions.has(card.faction2_code)
        ) || (
          !!card.faction3_code && allowedFactions.has(card.faction3_code)
        )
      };
    }
    case JOE_DIAMOND_CODE: {
      const deckSize = validation.getDeckSize(deckCards);
      const drawDeckSize = sumBy(deckCards, (card) => card.permanent || card.subtype_code || card.restrictions_investigator ? 0 : 1);
      if (drawDeckSize + 11 < deckSize) {
        // No need for special logic yet.
        return undefined;
      }
      const isHunchEvent = (c: Card) => c.type_code === 'event' && (!!c.real_traits_normalized && c.real_traits_normalized.indexOf('#insight#') !== -1);
      const hunchEvents = sumBy(deckCards, c => isHunchEvent(c) ? 1 : 0);
      if (hunchEvents >= 11) {
        return undefined;
      }
      const neededHunchEvents = 11 - hunchEvents;
      if (drawDeckSize + neededHunchEvents < deckSize) {
        return undefined;
      }
      return isHunchEvent;
    }

    default:
      return undefined;
  }
}

function randomAllowedCardHelper(
  validation: DeckValidation,
  investigatorClause: undefined | ((card: Card) => boolean),
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
    if ((card && card.xp !== undefined) && (!investigatorClause || investigatorClause(card))) {
      validation.slots[code] = (validation.slots[code] || 0) + 1;
      const problem = validation.getProblem([...deckCards, card], true);

      // Put it back the way it was.
      validation.slots[code] = (validation.slots[code] || 0) - 1;
      if (!validation.slots[card.code]) {
        delete validation.slots[card.code];
      }

      if (
        (!problem || problem.reason === TOO_FEW_CARDS ||
          (problem.reason === INVESTIGATOR_PROBLEM && problem.investigatorReason === 'atleast')
        ) &&
        card.collectionDeckLimit(in_collection, ignore_collection) > (validation.slots[card.code] || 0)
      ) {
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
  investigator: InvestigatorChoice,
  meta: DeckMeta,
  slots: Slots,
  count: number,
  possibleCards: string[],
  cards: CardsMap,
  in_collection: { [pack_code: string]: boolean },
  ignore_collection: boolean,
  listSeperator: string,
  allDeckCards: CardsMap | undefined,
  mode?: 'extra',
): [Card[], string[]] {
  const validation = new DeckValidation(investigator, slots, meta, { extra_deck: mode === 'extra'});
  const draftCards: Card[] = [];
  let possibleCodes: string[] = possibleCards;
  const deckCards: Card[] = getCards({
    ...cards,
    ...allDeckCards,
  }, slots, {}, listSeperator, {});
  const investigatorClause = getSpecialInvestigatorPredicate(validation, deckCards);
  while (draftCards.length < count) {
    const [draftCard, newPossibleCodes] = randomAllowedCardHelper(
      validation,
      investigatorClause,
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
  investigator: InvestigatorChoice,
  meta: DeckMeta,
  possibleCodes: string[],
  cards: CardsMap,
  progress: SharedValue<number>,
  in_collection: { [pack_code: string]: boolean },
  ignore_collection: boolean,
  mode?: 'extra'
): [Slots, boolean] {
  VERBOSE && console.log('\n\n\n\n****RANDOM DECK TIME****');
  const deckCards: Card[] = [];
  let localPossibleCards: string[] = [...possibleCodes];
  const slots: Slots = {};
  const validation = new DeckValidation(investigator, slots, meta, { random_deck: true, extra_deck: mode === 'extra' });
  let deckSize = 0;
  while (deckSize < validation.getDeckSize(deckCards)) {
    const investigatorClause = getSpecialInvestigatorPredicate(validation, deckCards);
    const [card, newPossibleCards] = randomAllowedCardHelper(
      validation,
      investigatorClause,
      localPossibleCards,
      cards,
      deckCards, in_collection, ignore_collection);
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
      progress.value = withTiming(deckSize * 1.0 / validation.getDeckSize(deckCards));
    }
  }
  if (mode !== 'extra') {
    // Handle special cards, like for Lily/Parallel Roland
    const specialFront = specialCards[investigator.front.code]?.front
    const specialBack = specialCards[investigator.back.code]?.back;
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
  }

  MINI_VEROBSE && console.log(slots);
  return [slots, true];
}
