import {
  flatMap,
  filter,
  find,
  forEach,
  keys,
  map,
  mapValues,
  range,
  groupBy,
  partition,
  pullAt,
  sortBy,
  sum,
  uniqBy,
  union,
  uniq,
} from 'lodash';
import { t } from 'ttag';

import {
  AssetGroup,
  CardId,
  CardSplitType,
  Deck,
  DeckChanges,
  DeckMeta,
  FactionCounts,
  getDeckId,
  ParsedDeck,
  SkillCounts,
  SlotCounts,
  Slots,
  SplitCards,
} from '@actions/types';
import Card, { CardKey, CardsMap } from '@data/types/Card';
import {
  ARCANE_RESEARCH_CODE,
  DOWN_THE_RABBIT_HOLE_CODE,
  ADAPTABLE_CODE,
  DEJA_VU_CODE,
  PLAYER_FACTION_CODES,
  SKILLS,
  SLOTS,
  RANDOM_BASIC_WEAKNESS,
  FactionCodeType,
  SlotCodeType,
  SkillCodeType,
  ACE_OF_RODS_CODE,
} from '@app_constants';
import DeckValidation from './DeckValidation';

function filterBy(
  cardIds: CardId[],
  cards: CardsMap,
  field: CardKey,
  value: any
): CardId[] {
  return cardIds.filter(c => {
    const card = cards[c.id];
    // tslint:disable-next-line
    return card && card[field] === value;
  });
}

function groupAssets(
  cardIds: CardId[],
  cards: CardsMap
): AssetGroup[] {
  const assets = filterBy(cardIds, cards, 'type_code', 'asset');
  const groups = groupBy(assets, c => {
    const card = cards[c.id];
    if (!card) {
      return t`Other`;
    }
    switch (card.real_slot) {
      case 'Hand': return t`Hand`;
      case 'Hand. Arcane': return t`Hand. Arcane`;
      case 'Hand x2': return t`Hand x2`;
      case 'Arcane': return t`Arcane`;
      case 'Arcane x2': return t`Arcane x2`;
      case 'Accessory': return t`Accessory`;
      case 'Body': return t`Body`;
      case 'Body. Hand x2': return t`Body. Hand x2`;
      case 'Ally. Arcane': return t`Ally. Arcane`;
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
        t`Arcane`,
        t`Arcane x2`,
        t`Accessory`,
        t`Body`,
        t`Ally`,
        t`Tarot`,
        t`Hand. Arcane`,
        t`Body. Hand x2`,
        t`Ally. Arcane`,
        t`Other`,
      ],
      t => {
        return { type: t, data: groups[t] || [] };
      }),
    asset => asset.data.length > 0
  );
}

export function isSpecialCard(card?: Card): boolean {
  return !!(
    card && (
      card.code === RANDOM_BASIC_WEAKNESS ||
      card.permanent ||
      card.subtype_code === 'weakness' ||
      card.subtype_code === 'basicweakness' ||
      card.mythos_card ||
      card.has_restrictions
    )
  );
}

export function splitCards(cardIds: CardId[], cards: CardsMap): SplitCards {
  const result: SplitCards = {};

  const groupedAssets = groupAssets(cardIds, cards);
  if (groupedAssets.length > 0) {
    result.Assets = groupedAssets;
  }
  const otherTypes: CardSplitType[] = ['Event', 'Skill', 'Treachery', 'Enemy'];
  otherTypes.forEach(type_code => {
    const typeCards = filterBy(cardIds, cards, 'type_code', type_code.toLowerCase());
    const combinedCards = type_code === 'Treachery' ? [
      ...typeCards,
      ...filterBy(cardIds, cards, 'type_code', 'investigator'),
    ] : typeCards;
    if (type_code !== 'Assets' && combinedCards.length > 0) {
      result[type_code] = combinedCards;
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
        const card = cards[c.id];
        if (!card || card.type_code !== 'asset') {
          return false;
        }
        const slots = card.real_slots_normalized;
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
  const nonPermanentCards = cardIds.filter(c => {
    const card = cards[c.id];
    return !!card && (
      !card.permanent &&
      !card.double_sided &&
      card.code !== '02014'
    );
  });
  return [
    sum(nonPermanentCards.filter(c => {
      const card = cards[c.id];
      return !!card && (
        card.faction2_code !== null &&
        (card.faction_code === faction || card.faction2_code === faction || card.faction3_code === faction)
      );
    }).map(c => c.quantity)),
    sum(nonPermanentCards.filter(c => {
      const card = cards[c.id];
      return (
        card &&
        card.faction2_code === null &&
        card.faction_code === faction
      );
    }).map(c => c.quantity)),
  ];
}

function costHistogram(
  cardIds: CardId[],
  cards: CardsMap
): number[] {
  const costHisto = mapValues(
    groupBy(
      cardIds.filter(c => {
        const card = cards[c.id];
        return card && card.realCost() !== null;
      }),
      c => {
        const card = cards[c.id];
        if (!card) {
          return 0;
        }
        const realCost = card.realCost();
        if (realCost === 'X') {
          return -2;
        }
        if (realCost === '-') {
          return -1;
        }
        return realCost;
      }),
    cs => sum(cs.map(c => c.quantity))
  );
  return range(-2, 11).map(cost => costHisto[cost] || 0);
}

function sumSkillIcons(cardIds: CardId[], cards: CardsMap, skill: SkillCodeType): number {
  return sum(cardIds.map(c => {
    const card = cards[c.id];
    return (card ? card.skillCount(skill) : 0) * c.quantity;
  }));
}

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

function getCards(
  cards: CardsMap,
  slots: Slots,
  ignoreDeckLimitSlots: Slots
): Card[] {
  return flatMap(keys(slots), code => {
    const card = cards[code];
    if (!card) {
      return [];
    }
    return map(
      range(0, slots[code] - (ignoreDeckLimitSlots[code] || 0)),
      () => card
    );
  });
}

function getDeckChanges(
  cards: CardsMap,
  validation: DeckValidation,
  deck: Deck,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  previousDeck?: Deck
): DeckChanges | undefined {
  const exiledCards = deck.exile_string ? mapValues(
    groupBy(deck.exile_string.split(',')),
    items => items.length) : {};
  if (!deck.previousDeckId || !previousDeck) {
    return undefined;
  }
  const previous_investigator_code = (previousDeck.meta || {}).alternate_back ||
    previousDeck.investigator_code;
  const previousInvestigator = cards[previous_investigator_code];
  if (!previousInvestigator) {
    return undefined;
  }
  const oldDeckSize = new DeckValidation(
    previousInvestigator,
    previousDeck.slots || {},
    previousDeck.meta
  ).getDeckSize();
  const previousDeckCards: Card[] = getCards(cards,
    previousDeck.slots || {},
    previousDeck.ignoreDeckLimitSlots || {}
  );
  const invalidCards = validation.getInvalidCards(previousDeckCards);
  const newDeckSize = validation.getDeckSize();
  let extraDeckSize = newDeckSize - oldDeckSize;

  const previousIgnoreDeckLimitSlots = previousDeck.ignoreDeckLimitSlots || {};
  const changedCards: Slots = {};
  forEach(
    uniq(union(keys(slots), keys(previousDeck.slots))),
    code => {
      const ignoreDelta = (ignoreDeckLimitSlots[code] || 0) - (previousIgnoreDeckLimitSlots[code] || 0);
      const exiledCount = exiledCards[code] || 0;
      const newCount = slots[code] || 0;
      const oldCount = previousDeck.slots?.[code] || 0;
      const delta = (newCount + exiledCount) - oldCount - (code === ACE_OF_RODS_CODE ? ignoreDelta : 0);
      if (delta !== 0) {
        changedCards[code] = delta;
      }
    });
  const exiledSlots: Card[] = [];
  forEach(exiledCards,
    (exileCount, code) => {
      if (exileCount > 0) {
        const card = cards[code];
        if (card) {
          forEach(range(0, exileCount), () => exiledSlots.push(card));
        }
      }
    });
  forEach(invalidCards, invalidCard => {
    exiledSlots.push(invalidCard);
  });
  const dejaVuCardUses = {
    ...exiledCards,
  };
  const dejaVuMaxDiscount = (slots[DEJA_VU_CODE] || 0);
  let dejaVuUses = dejaVuMaxDiscount * 3;
  let adaptableUses = (slots[ADAPTABLE_CODE] || 0) * 2;
  let arcaneResearchUses = (slots[ARCANE_RESEARCH_CODE] || 0);
  const downTheRabbitHoleXp = (slots[DOWN_THE_RABBIT_HOLE_CODE] || 0) > 0 ? 1 : 0;
  let downTheRabitHoleUses = downTheRabbitHoleXp * 2;

  const addedCards: Card[] = [];
  const removedCards: Card[] = [];
  forEach(changedCards, (count, code) => {
    const card = cards[code];
    if (!card) {
      return;
    }
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
  });
  const added: Slots = {};
  const removed: Slots = {};
  const upgraded: Slots = {};
  const myriadBuys: {
    [name: string]: boolean;
  } = {};
  const [addedStoryCards, addedNormalCards] = partition(addedCards, card => card.xp === null);
  forEach(addedStoryCards, addedCard => incSlot(added, addedCard));

  const spentXp = sum(map(
    sortBy(
      // null cards are story assets, so putting them in is free.
      addedNormalCards,
      card => -((card.xp || 0) + (card.extra_xp || 0))
    ),
    addedCard => {
      if (addedCard.myriad) {
        const myriadKey = `${addedCard.real_name}_${addedCard.xp}`;
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
          if (extraDeckSize > 0 && downTheRabbitHoleXp) {
            extraDeckSize--;
            // Swap ins don't get the Down the Rabbit Hole XP bonus.
            return tabooCost;
          }
          return tabooCost + downTheRabbitHoleXp;
        }
        if (extraDeckSize > 0) {
          // If your deck grew in size you can swap in extra cards for free.
          extraDeckSize--;
          return 0;
        }
        return 1 + downTheRabbitHoleXp;
      }

      // Check if this is a deja-vu eligible exile card.
      if ((dejaVuCardUses[addedCard.code] || 0) > 0 && dejaVuUses > 0) {
        const discount = Math.min(
          addedCard.xp || 0,
          Math.min(dejaVuUses, dejaVuMaxDiscount)
        );
        if (discount > 0) {
          dejaVuCardUses[addedCard.code]--;
          dejaVuUses -= discount;
          incSlot(added, addedCard);
          return computeXp(addedCard) - discount + downTheRabbitHoleXp;
        }
      }

      // XP higher than 0.
      // See if there's a lower version card that counts as an upgrade.
      for (let i = 0; i < removedCards.length; i++) {
        const removedCard = removedCards[i];
        if (
          addedCard.real_name === removedCard.real_name &&
          addedCard.xp !== undefined &&
          removedCard.xp !== undefined &&
          addedCard.xp > removedCard.xp
        ) {
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
            if (xpCost > 0 && downTheRabitHoleUses > 0) {
              xpCost--;
              downTheRabitHoleUses--;
            }
            return xpCost;
          }
          if (addedCard.permanent && !removedCard.permanent) {
            // If we added in a permanent upgrade, let swaps happen for free.
            extraDeckSize++;
          }
          // Upgrade of the same name, so you only pay the delta.
          let xpCost = (computeXp(addedCard) - computeXp(removedCard));
          if (xpCost > 0 && downTheRabitHoleUses > 0) {
            xpCost--;
            downTheRabitHoleUses--;
          }
          return xpCost;
        }
      }

      incSlot(added, addedCard);
      return computeXp(addedCard) + downTheRabbitHoleXp;
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
  const myriadBuys: {
    [name: string]: boolean;
  } = {};

  return sum(map(keys(slots), code => {
    const card = cards[code];
    const xp = computeXp(card);
    if (card && card.myriad) {
      const myriadKey = `${card.real_name}_${card.xp}`;
      if (!myriadBuys[myriadKey]) {
        // Pay the cost only once for myriad.
        myriadBuys[myriadKey] = true;
        return xp;
      }
      return 0;
    }
    const count = (slots[code] || 0) - (ignoreDeckLimitSlots[code] || 0);
    return xp * count;
  }));
}

export function parseBasicDeck(
  deck: Deck | null,
  cards: CardsMap,
  previousDeck?: Deck
): ParsedDeck | undefined {
  if (!deck) {
    return undefined;
  }
  return parseDeck(
    deck,
    deck.meta || {},
    deck.slots || {},
    deck.ignoreDeckLimitSlots || {},
    deck.sideSlots || {},
    cards,
    previousDeck,
    deck.xp_adjustment
  );
}

export function parseDeck(
  deck: Deck | null,
  meta: DeckMeta,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  sideSlots: Slots,
  cards: CardsMap,
  previousDeck?: Deck,
  xpAdjustment?: number
): ParsedDeck | undefined {
  if (!deck) {
    return undefined;
  }
  const investigator_code = meta.alternate_back || deck.investigator_code;
  const investigator: Card | undefined = cards[investigator_code];
  if (!investigator) {
    return undefined;
  }
  const validation = new DeckValidation(investigator, slots, meta);
  const cardIds = flatMap(
    sortBy(
      sortBy(
        filter(uniq([...keys(slots), ...keys(deck.slots)]), id => !!cards[id]),
        id => {
          const card = cards[id];
          return (card && card.xp) || 0;
        }
      ),
      id => {
        const card = cards[id];
        return (card && card.name) || '???';
      }
    ),
    id => {
      const card = cards[id];
      if (!card) {
        return [];
      }
      return {
        id,
        quantity: slots[id] || 0,
        invalid: !validation.canIncludeCard(card, false) || (card.deck_limit !== undefined && slots[id] > card.deck_limit),
        limited: validation.isCardLimited(card),
      };
    });
  const specialCards = cardIds.filter(c =>
    (isSpecialCard(cards[c.id]) && c.quantity >= 0) || ignoreDeckLimitSlots[c.id] > 0);
  const normalCards = cardIds.filter(c =>
    !isSpecialCard(cards[c.id]) && ((
      c.quantity > (ignoreDeckLimitSlots[c.id] || 0)
    ) || (
      (ignoreDeckLimitSlots[c.id] || 0) === 0 && c.quantity >= 0
    )));
  const sideCards: CardId[] = flatMap(
    sortBy(
      sortBy(
        filter(uniq([...keys(deck.sideSlots || {}), ...keys(sideSlots)]), id => !!cards[id]),
        id => {
          const card = cards[id];
          return (card && card.xp) || 0;
        }
      ),
      id => {
        const card = cards[id];
        return (card && card.name) || '???';
      }
    ),
    id => {
      const card = cards[id];
      if (!card || !sideSlots) {
        return [];
      }
      return {
        id,
        quantity: sideSlots[id] || 0,
        invalid: false,
        limited: false,
      };
    }
  );

  const deckCards = getCards(cards, slots, ignoreDeckLimitSlots);
  const problem = validation.getProblem(deckCards) || undefined;

  const changes = getDeckChanges(
    cards,
    validation,
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
    id: getDeckId(deck),
    investigator,
    deck,
    slots,
    normalCardCount: sum(normalCards.map(c =>
      c.quantity - (ignoreDeckLimitSlots[c.id] || 0))),
    deckSize: validation.getDeckSize(),
    totalCardCount: sum(cardIds.map(c => c.quantity)),
    experience: totalXp,
    availableExperience: (deck.xp || 0) + (xpAdjustment || 0),
    packs: uniqBy(cardIds, c => {
      const card = cards[c.id];
      return (card && card.pack_code) || '';
    }).length,
    factionCounts,
    costHistogram: costHistogram(cardIds, cards),
    slotCounts,
    skillIconCounts,
    normalCards: splitCards(normalCards, cards),
    specialCards: splitCards(specialCards, cards),
    sideCards: splitCards(sideCards, cards),
    ignoreDeckLimitSlots,
    changes,
    problem,
    limitedSlots: !!find(validation.deckOptions(), option =>
      !!option.limit && !find(option.trait || [], trait => trait === 'Covenant')
    ),
  };
}
