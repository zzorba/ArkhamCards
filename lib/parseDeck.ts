import { filter, forEach, keys, map, mapValues, range, groupBy, pullAt, sortBy, sum, uniqBy, union } from 'lodash';

import { t } from 'ttag';
import {
  AssetGroup,
  CardId,
  CardSplitType,
  Deck,
  DeckChanges,
  FactionCounts,
  ParsedDeck,
  SkillCounts,
  SlotCounts,
  Slots,
  SplitCards,
} from '../actions/types';
import Card, { CardKey, CardsMap } from '../data/Card';
import {
  PLAYER_FACTION_CODES,
  SKILLS,
  SLOTS,
  RANDOM_BASIC_WEAKNESS,
  VERSATILE_CODE,
  FactionCodeType,
  SlotCodeType,
  SkillCodeType,
} from '../constants';
import DeckValidation from './DeckValidation';

function filterBy(
  cardIds: CardId[],
  cards: CardsMap,
  field: CardKey,
  value: any
): CardId[] {
  return cardIds.filter(c => cards[c.id] && cards[c.id][field] === value);
}

function groupAssets(
  cardIds: CardId[],
  cards: CardsMap
): AssetGroup[] {
  const assets = filterBy(cardIds, cards, 'type_code', 'asset');
  const groups = groupBy(assets, c => {
    switch (cards[c.id].slot) {
      case 'Hand': return t`Hand`;
      case 'Hand. Arcane': return t`Hand. Arcane`;
      case 'Hand x2': return t`Hand x2`;
      case 'Arcane': return t`Arcane`;
      case 'Accessory': return t`Accessory`;
      case 'Body': return t`Body`;
      case 'Body. Hand x2': return t`Body. Hand x2`;
      case 'Ally': return t`Ally`;
      case 'Tarot': return t`Tarot`;
      default: return t`Other`;
    }
  });
  return filter(
    map(
      [
        t`Hand`,
        t`Hand x2`,
        t`Hand. Arcane`,
        t`Body. Hand x2`,
        t`Arcane`,
        t`Accessory`,
        t`Body`,
        t`Ally`,
        t`Tarot`,
        t`Other`,
      ],
      t => {
        return { type: t, data: groups[t] || [] };
      }),
    asset => asset.data.length > 0
  );
}

export function isSpecialCard(card: Card): boolean {
  return !!(
    card && (
      card.code === RANDOM_BASIC_WEAKNESS ||
      card.permanent ||
      card.subtype_code === 'weakness' ||
      card.subtype_code === 'basicweakness' ||
      card.spoiler ||
      card.restrictions
    )
  );
}

function splitCards(cardIds: CardId[], cards: CardsMap): SplitCards {
  const result: SplitCards = {};

  const groupedAssets = groupAssets(cardIds, cards);
  if (groupedAssets.length > 0) {
    result.Assets = groupedAssets;
  }
  const otherTypes: CardSplitType[] = ['Event', 'Skill', 'Treachery', 'Enemy'];
  otherTypes.forEach(type_code => {
    const typeCards = filterBy(cardIds, cards, 'type_code', type_code.toLowerCase());
    if (type_code !== 'Assets' && typeCards.length > 0) {
      result[type_code] = typeCards;
    }
  });
  return result;
}

function computeXp(card?: Card): number {
  return card ?
    (card.exceptional ? 2 : 1) * ((card.xp || 0) + (card.extra_xp || 0)) :
    0;
}

function slotCount(
  cardIds: CardId[],
  cards: CardsMap,
  slot: SlotCodeType
): number {
  return sum(
    map(
      filter(cardIds, c => {
        if (!cards[c.id] || cards[c.id].type_code !== 'asset') {
          return false;
        }
        const slots = cards[c.id].slots_normalized;
        return !!(slots && slots.indexOf(`#${slot}#`) !== -1);
      }),
      c => c.quantity
    )
  );
}

function factionCount(
  cardIds: CardId[],
  cards: CardsMap,
  faction: FactionCodeType
): [number, number] {
  const nonPermanentCards = cardIds.filter(c => (
    cards[c.id] &&
    !cards[c.id].permanent &&
    !cards[c.id].double_sided &&
    cards[c.id].code !== '02014'
  ));
  return [
    sum(nonPermanentCards.filter(c => (
      cards[c.id].faction2_code !== null &&
      (cards[c.id].faction_code === faction ||
      cards[c.id].faction2_code === faction)
    )).map(c => c.quantity)),
    sum(nonPermanentCards.filter(c => (
      cards[c.id].faction2_code === null &&
      cards[c.id].faction_code === faction
    )).map(c => c.quantity)),
  ];
}

function costHistogram(cardIds: CardId[], cards: CardsMap): number[] {
  const costHisto = mapValues(
    groupBy(
      cardIds.filter(c => {
        const card = cards[c.id];
        return card &&
          !card.permanent &&
          !card.double_sided &&
          card.code !== '02014' && (
          card.type_code === 'asset' || card.type_code === 'event');
      }),
      c => {
        const card = cards[c.id];
        if (!card) {
          return 0;
        }
        if (card.cost === null) {
          return -2;
        }
        return card.cost;
      }),
    cs => sum(cs.map(c => c.quantity))
  );
  return range(-2, 11).map(cost => costHisto[cost] || 0);
}

function sumSkillIcons(cardIds: CardId[], cards: CardsMap, skill: SkillCodeType): number {
  return sum(cardIds.map(c =>
    (cards[c.id] ? cards[c.id].skillCount(skill) : 0) * c.quantity));
}


const ARCANE_RESEARCH_CODE = '04109';
const ADAPTABLE_CODE = '02110';

function incSlot(slots: Slots, card: Card) {
  if (!slots[card.code]) {
    slots[card.code] = 0;
  }
  slots[card.code]++;
}
function decSlot(slots: Slots, card: Card) {
  if (!slots[card.code]) {
    slots[card.code] = 0;
  }
  slots[card.code]--;
}

function getDeckChanges(
  cards: CardsMap,
  deck: Deck,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  previousDeck?: Deck
): DeckChanges | undefined {
  const exiledCards = deck.exile_string ? mapValues(
    groupBy(deck.exile_string.split(',')),
    items => items.length) : {};
  const investigator = cards[deck.investigator_code];
  if (!deck.previous_deck || !previousDeck || !investigator) {
    return undefined;
  }
  const deckValidation = new DeckValidation(investigator, deck.meta);
  const oldDeckSize = deckValidation.getDeckSize(previousDeck.slots[VERSATILE_CODE] || 0);
  const newDeckSize = deckValidation.getDeckSize(slots[VERSATILE_CODE] || 0);
  let extraDeckSize = newDeckSize - oldDeckSize;

  const previousIgnoreDeckLimitSlots = previousDeck.ignoreDeckLimitSlots || {};
  const changedCards: Slots = {};
  forEach(
    union(keys(slots), keys(previousDeck.slots)),
    code => {
      const ignoreDelta = (ignoreDeckLimitSlots[code] || 0) - (previousIgnoreDeckLimitSlots[code] || 0);
      const exiledCount = exiledCards[code] || 0;
      const newCount = slots[code] || 0;
      const oldCount = previousDeck.slots[code] || 0;
      const delta = (newCount + exiledCount) - oldCount - ignoreDelta;
      if (delta !== 0) {
        changedCards[code] = delta;
      }
    });
  const exiledSlots: Card[] = [];
  forEach(exiledCards, (exileCount, code) => {
    if (exileCount > 0) {
      const card = cards[code];
      if (card) {
        forEach(range(0, exileCount), () => exiledSlots.push(card));
      }
    }
  });
  let adaptableUses = (slots[ADAPTABLE_CODE] || 0) * 2;
  let arcaneResearchUses = (slots[ARCANE_RESEARCH_CODE] || 0);

  const addedCards: Card[] = [];
  const removedCards: Card[] = [];
  forEach(changedCards, (count, code) => {
    const card = cards[code];
    if (card) {
      if (count < 0) {
        for (let i = count; i < 0; i++) {
          removedCards.push(card);
        }
      } else {
        for (let i = 0; i < count; i++) {
          addedCards.push(card);
          if (card.code === ARCANE_RESEARCH_CODE) {
            // Per FAQ, you do not get the arcane research bonus if you just
            // added this card to your deck.
            arcaneResearchUses--;
          }
        }
      }
    }
  });
  const added: Slots = {};
  const removed: Slots = {};
  const upgraded: Slots = {};
  const myriadBuys: {
    [name: string]: boolean;
  } = {};
  const spentXp = sum(map(
    sortBy(
      // null cards are story assets, so putting them in is free.
      filter(addedCards, card => card.xp !== null),
      card => -((card.xp || 0) + (card.extra_xp || 0))
    ),
    addedCard => {
      if (addedCard.myriad) {
        const myriadKey = `${addedCard.real_text}_${addedCard.xp}`;
        if (myriadBuys[myriadKey]) {
          // Already paid for a myriad of this level
          // So this one is free.
          incSlot(added, addedCard);
          if (addedCard.xp === 0) {
            if (extraDeckSize > 0) {
              extraDeckSize--;
            }
          }
          return 0;
        }
        myriadBuys[myriadKey] = true;
      }

      if (addedCard.xp === 0) {
        // We visit cards from high XP to low XP, so if there's 0 XP card,
        // we've found matches for all the other cards already.
        // Only 0 XP cards are left, so it's safe to apply adaptable changes.
        if (exiledSlots.length > 0) {
          // Every exiled card gives you one free '0' cost insert.
          pullAt(exiledSlots, [0]);

          incSlot(added, addedCard);

          // But you still have to pay the TABOO xp.
          return (addedCard.extra_xp || 0);
        }

        // You can use adaptable to swap in to level 0s.
        // It is okay even if you just took adaptable this time.
        if (adaptableUses > 0) {
          for (let i = 0; i < removedCards.length; i++) {
            const removedCard = removedCards[i];
            if (removedCard.xp !== null && removedCard.xp === 0) {
              decSlot(removed, removedCards[i]);
              incSlot(added, addedCard);

              pullAt(removedCards, [i]);

              adaptableUses--;
              return 0;
            }
          }
          // Couldn't find a 0 cost card to remove, it's weird that you
          // chose to take away an XP card -- or maybe you are just adding cards.
        }
        incSlot(added, addedCard);
        const tabooCost = addedCard.extra_xp || 0;
        if (tabooCost > 0) {
          // If a card has taboo, you don't pay 1 for the swap of 0 -> 0.
          // Also doesn't eat a slot in case of versatile, since you are paying
          // full cost for it.
          return tabooCost;
        }
        if (extraDeckSize > 0) {
          // If your deck grew in size you can swap in extra cards for free.
          extraDeckSize--;
          return 0;
        }
        return 1;
      }

      // XP higher than 0.
      // See if there's a lower version card that counts as an upgrade.
      for (let i = 0; i < removedCards.length; i++) {
        const removedCard = removedCards[i];
        if (addedCard.name === removedCard.name &&
            addedCard.xp !== null &&
            removedCard.xp !== null &&
            addedCard.xp > removedCard.xp) {
          decSlot(upgraded, removedCards[i]);
          incSlot(upgraded, addedCard);
          pullAt(removedCards, [i]);

          // If you have unspent uses of arcaneResearchUses,
          // and its a spell, you get a 1 XP discount on upgrade of
          // a spell to a spell.
          if (arcaneResearchUses > 0 &&
            removedCard.real_traits_normalized &&
            addedCard.real_traits_normalized &&
            removedCard.real_traits_normalized.indexOf('#spell#') !== -1 &&
            addedCard.real_traits_normalized.indexOf('#spell#') !== -1) {
            let xpCost = (computeXp(addedCard) - computeXp(removedCard));
            while (xpCost > 0 && arcaneResearchUses > 0) {
              xpCost--;
              arcaneResearchUses--;
            }
            return xpCost;
          }
          // Upgrade of the same name, so you only pay the delta.
          return (computeXp(addedCard) - computeXp(removedCard));
        }
      }

      incSlot(added, addedCard);
      return computeXp(addedCard);
    }
  ));
  forEach(removedCards, removedCard => decSlot(removed, removedCard));

  return {
    added,
    removed,
    upgraded,
    exiled: exiledCards,
    spentXp: spentXp || 0,
  };
}

function calculateTotalXp(
  cards: CardsMap,
  slots: Slots,
  ignoreDeckLimitSlots: Slots
): number {
  return sum(map(keys(slots), code => {
    const card = cards[code];
    const xp = computeXp(card);
    const count = (slots[code] || 0) - (ignoreDeckLimitSlots[code] || 0);
    return xp * count;
  }));
}


export function parseDeck(
  deck: Deck | null,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  cards: CardsMap,
  previousDeck?: Deck,
): ParsedDeck {
  if (!deck) {
    // @ts-ignore
    return {};
  }
  const cardIds = map(
    sortBy(
      sortBy(
        filter(keys(slots), id => !!cards[id]),
        id => cards[id].xp || 0
      ),
      id => cards[id].name
    ),
    id => {
      return {
        id,
        quantity: slots[id],
      };
    });
  const specialCards = cardIds.filter(c =>
    (isSpecialCard(cards[c.id]) && slots[c.id] > 0) || ignoreDeckLimitSlots[c.id] > 0);
  const normalCards = cardIds.filter(c =>
    !isSpecialCard(cards[c.id]) && slots[c.id] > (ignoreDeckLimitSlots[c.id] || 0));
  const changes = getDeckChanges(
    cards,
    deck,
    slots,
    ignoreDeckLimitSlots,
    previousDeck);
  const totalXp = calculateTotalXp(cards, slots, ignoreDeckLimitSlots);

  const factionCounts: FactionCounts = {};
  forEach(PLAYER_FACTION_CODES, faction => {
    factionCounts[faction] = factionCount(cardIds, cards, faction);
  });
  const skillIconCounts: SkillCounts = {};
  forEach(SKILLS, skill => {
    skillIconCounts[skill] = sumSkillIcons(cardIds, cards, skill);
  });
  const slotCounts: SlotCounts = {};
  forEach(SLOTS, slot => {
    slotCounts[slot] = slotCount(cardIds, cards, slot);
  });
  return {
    investigator: cards[deck.investigator_code],
    deck: deck,
    slots: slots,
    normalCardCount: sum(normalCards.map(c =>
      c.quantity - (ignoreDeckLimitSlots[c.id] || 0))),
    totalCardCount: sum(cardIds.map(c => c.quantity)),
    experience: totalXp,
    packs: uniqBy(cardIds, c => cards[c.id].pack_code).length,
    factionCounts: factionCounts,
    costHistogram: costHistogram(cardIds, cards),
    slotCounts: slotCounts,
    skillIconCounts: skillIconCounts,
    normalCards: splitCards(normalCards, cards),
    specialCards: splitCards(specialCards, cards),
    ignoreDeckLimitSlots,
    changes,
  };
}
