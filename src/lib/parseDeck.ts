import {
  flatMap,
  filter,
  find,
  forEach,
  keys,
  map,
  mapValues,
  values,
  range,
  groupBy,
  partition,
  pullAt,
  sortBy,
  sum,
  uniqBy,
  union,
  uniq,
  sumBy,
} from 'lodash';
import { t } from 'ttag';

import {
  AssetGroup,
  CardId,
  CardSplitType,
  CustomizationDecision,
  Customizations,
  Deck,
  DeckChanges,
  DeckMeta,
  FactionCounts,
  getDeckId,
  ParsedDeck,
  SkillCounts,
  SlotCounts,
  Slots,
  SpecialDiscount,
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
import CustomizationOption, { CoreCustomizationChoice, CustomizationChoice } from '@data/types/CustomizationOption';

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
  listSeperator: string,
  customizations: Customizations,
  cards: CardsMap
): AssetGroup[] {
  const assets = filterBy(cardIds, cards, 'type_code', 'asset');
  const groups = groupBy(assets, c => {
    const card = cards[c.id]?.withCustomizations(listSeperator, customizations[c.id]);
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

function splitCards(cardIds: CardId[], listSeperator: string, customizations: Customizations, cards: CardsMap): SplitCards {
  const result: SplitCards = {};

  const groupedAssets = groupAssets(cardIds, listSeperator, customizations, cards);
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

export function getCards(
  cards: CardsMap,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  listSeperator: string,
  customizations: Customizations
): Card[] {
  return flatMap(keys(slots), code => {
    const card = cards[code];
    if (!card) {
      return [];
    }
    const customizedCard = card.withCustomizations(listSeperator, customizations[card.code]);
    return map(
      range(0, slots[code] - (ignoreDeckLimitSlots[code] || 0)),
      () => customizedCard
    );
  });
}

function getDeckChangesHelper(
  cards: CardsMap,
  slots: Slots,
  extraDeckSize: number,
  totalFreeCards: number,
  changedCards: Slots,
  exiledCards: Slots,
  customizedSlots: Slots,
  customizedXp: Slots,
  invalidCards: Card[],
  dtrFirst: boolean
): DeckChanges {
  const totalExiledCards = sum(values(exiledCards));
  const exiledSlots: Card[] = [];
  forEach(exiledCards, (exileCount, code) => {
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
      sortBy(
        addedNormalCards,
        // Put customizable cards AFTER other L0 cards,
        // to maximize chance Adaptable/Exile gives you Free swaps of them
        // since normally you get to check a box if its customizable
        card => card.customization_options ? 1 : 0
      ),
      // null cards are story assets, so putting them in is free.
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

        // Customizable cards are always Level 0, so if you end up paying
        // to customize, you get to put them in for free.
        if ((customizedXp[addedCard.code] || 0) > 0) {
          return downTheRabbitHoleXp;
        }

        // DTRH satisfies the 1 minimum cost;
        if (downTheRabbitHoleXp > 0) {
          return downTheRabbitHoleXp;
        }

        // Alas, you have to pay the 1XP cost for this L0 card, sucker.
        return 1;
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
            if (dtrFirst && (xpCost > 0 && downTheRabitHoleUses > 0)) {
              xpCost--;
              downTheRabitHoleUses--;
            }
            while (xpCost > 0 && arcaneResearchUses > 0) {
              xpCost--;
              arcaneResearchUses--;
            }
            if (!dtrFirst && (xpCost > 0 && downTheRabitHoleUses > 0)) {
              xpCost--;
              downTheRabitHoleUses--;
            }
            return xpCost;
          }
          if (addedCard.permanent && !removedCard.permanent) {
            // If we added in a permanent upgrade, let swaps happen for free.
            extraDeckSize++;
            totalFreeCards++;
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

  const totalCustomizationXp = sumBy(keys(customizedXp), (code) => {
    let xpCost = customizedXp[code] || 0;
    const card = cards[code];
    if (!card) {
      return xpCost;
    }
    if (dtrFirst && (xpCost > 0 && downTheRabitHoleUses > 0)) {
      xpCost--;
      downTheRabitHoleUses--;
    }
    if (arcaneResearchUses > 0 &&
      card.real_traits_normalized &&
      card.real_traits_normalized.indexOf('#spell#') !== -1
    ) {
      while (xpCost > 0 && arcaneResearchUses > 0) {
        xpCost--;
        arcaneResearchUses--;
      }
    }
    if (!dtrFirst && (xpCost > 0 && downTheRabitHoleUses > 0)) {
      xpCost--;
      downTheRabitHoleUses--;
    }
    return xpCost;
  });

  const specialDiscounts: SpecialDiscount[] = [];
  if (slots[ADAPTABLE_CODE]) {
    specialDiscounts.push({
      code: ADAPTABLE_CODE,
      available: slots[ADAPTABLE_CODE] * 2,
      used: slots[ADAPTABLE_CODE] * 2 - adaptableUses,
    });
  }
  if (slots[DEJA_VU_CODE] && totalExiledCards) {
    const maxUses = slots[DEJA_VU_CODE] * Math.min(3, totalExiledCards);
    specialDiscounts.push({
      code: DEJA_VU_CODE,
      available: maxUses,
      used: maxUses - dejaVuUses,
    });
  }
  if (slots[ARCANE_RESEARCH_CODE]) {
    specialDiscounts.push({
      code: ARCANE_RESEARCH_CODE,
      available: slots[ARCANE_RESEARCH_CODE],
      used: slots[ARCANE_RESEARCH_CODE] - arcaneResearchUses,
    });
  }
  if (slots[DOWN_THE_RABBIT_HOLE_CODE]) {
    specialDiscounts.push({
      code: DOWN_THE_RABBIT_HOLE_CODE,
      available: 2,
      used: 2 - downTheRabitHoleUses,
    });
  }

  return {
    added,
    removed,
    upgraded,
    customized: customizedSlots,
    exiled: exiledCards,
    spentXp: totalCustomizationXp + (spentXp || 0),
    specialDiscounts: {
      usedFreeCards: totalFreeCards - (extraDeckSize + exiledSlots.length),
      totalFreeCards,
      cards: specialDiscounts,
    },
  };
}

function getDeckChanges(
  cards: CardsMap,
  validation: DeckValidation,
  deck: Deck,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  listSeperator: string,
  customizations: Customizations,
  previousDeck?: Deck,
  previousCustomizations?: Customizations,
): DeckChanges | undefined {
  const exiledCards = deck.exile_string ? mapValues(
    groupBy(deck.exile_string.split(',')),
    items => items.length) : {};
  const totalExiledCards = sum(values(exiledCards));
  if (!previousDeck) {
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
    previousDeck.ignoreDeckLimitSlots || {},
    listSeperator,
    customizations
  );
  const invalidCards = validation.getInvalidCards(previousDeckCards);
  const newDeckSize = validation.getDeckSize();
  const extraDeckSize = newDeckSize - oldDeckSize;
  const totalFreeCards = extraDeckSize + totalExiledCards;

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
  const customizedXp: Slots = {};
  const customizedSlots: Slots = {};
  forEach(keys(slots), code => {
    const customXp = sumBy(customizations[code], c => c.xp_spent);
    const previousXp = sumBy(previousCustomizations?.[code] || [], c => c.xp_spent);
    if (customXp > previousXp) {
      customizedXp[code] = customXp - previousXp;
      customizedSlots[code] = customXp - previousXp;
    }
  });

  const normalChanges = getDeckChangesHelper(
    cards,
    slots,
    extraDeckSize,
    totalFreeCards,
    changedCards,
    exiledCards,
    customizedSlots,
    customizedXp,
    invalidCards,
    false
  );
  if (slots[DOWN_THE_RABBIT_HOLE_CODE] && slots[ARCANE_RESEARCH_CODE]) {
    const altChanges = getDeckChangesHelper(
      cards,
      slots,
      extraDeckSize,
      totalFreeCards,
      changedCards,
      exiledCards,
      customizedSlots,
      customizedXp,
      invalidCards,
      true
    );
    if (altChanges.spentXp < normalChanges.spentXp) {
      return altChanges;
    }
  }
  return normalChanges;
}

function calculateTotalXp(
  cards: CardsMap,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  customizations: Customizations
): number {
  const myriadBuys: {
    [name: string]: boolean;
  } = {};

  return sum(map(keys(slots), code => {
    const card = cards[code];
    const xp = computeXp(card);
    const customize_xp = sumBy(customizations[code], custom => custom.xp_spent);
    if (card && card.myriad) {
      const myriadKey = `${card.real_name}_${card.xp}`;
      if (!myriadBuys[myriadKey]) {
        // Pay the cost only once for myriad.
        myriadBuys[myriadKey] = true;
        return xp + customize_xp;
      }
      return 0;
    }
    const count = (slots[code] || 0) - (ignoreDeckLimitSlots[code] || 0);
    return xp * count + customize_xp;
  }));
}

export function parseBasicDeck(
  deck: Deck | null,
  cards: CardsMap,
  listSeperator: string,
  previousDeck?: Deck
): ParsedDeck | undefined {
  if (!deck) {
    return undefined;
  }
  return parseDeck(
    deck.investigator_code,
    deck.meta || {},
    deck.slots || {},
    deck.ignoreDeckLimitSlots || {},
    deck.sideSlots || {},
    cards,
    listSeperator,
    previousDeck,
    deck.xp_adjustment,
    deck
  );
}


export function parseCustomizationDecision(value: string | undefined): CustomizationDecision[] {
  if (!value) {
    return [];
  }
  return flatMap(value.split(','), choice => {
    const parts = choice.split('|');
    if (!parts[0] || parts[0] === 'NaN') {
      return [];
    }
    if (parts.length > 1 && (!parts[1] || parts[1] === 'NaN')) {
      return [];
    }
    return {
      index: parseInt(parts[0], 10),
      spent_xp: parts.length > 1 ? parseInt(parts[1], 10) : 0,
      choice: parts.length > 2 ? parts[2] : undefined,
    };
  });
}

export function processAdvancedChoice(basic: CoreCustomizationChoice, choice: string | undefined, option: CustomizationOption, cards: CardsMap | undefined): CustomizationChoice {
  if (!option.choice) {
    return {
      type: undefined,
      ...basic,
    };
  }
  switch (option.choice) {
    case 'remove_slot':
      return {
        type: 'remove_slot',
        ...basic,
        encodedChoice: choice || '0',
        choice: parseInt(choice || '0', 10),
      };
    case 'choose_trait':
      return {
        type: 'choose_trait',
        ...basic,
        encodedChoice: choice || '',
        choice: filter(map(choice?.split('^') || [], x => x.trim()), x => !!x),
      };
    case 'choose_card': {
      const codes = choice?.split('^') || [];
      return {
        type: 'choose_card',
        ...basic,
        choice: codes,
        encodedChoice: choice || '',
        cards: flatMap(codes, code => cards?.[code] || []),
      };
    }
    case 'choose_skill': {
      if (choice === 'willpower' || choice === 'intellect' || choice === 'combat' || choice === 'agility') {
        return {
          type: 'choose_skill',
          ...basic,
          choice,
          encodedChoice: choice,
        };
      }
      return {
        type: 'choose_skill',
        ...basic,
        choice: undefined,
        encodedChoice: '',
      };
    }
    default:
      return {
        type: undefined,
        ...basic,
      };
  }
}

export function parseCustomizations(
  meta: DeckMeta,
  slots: Slots,
  cards: CardsMap,
  previousMeta: DeckMeta | undefined,
  previousSlots: Slots | undefined
): [Customizations, Customizations | undefined] {
  const previousCustomizations: Customizations = {};
  const result: Customizations = {};
  forEach(slots, (count, code) => {
    const card = cards[code];
    if (!card?.customization_options || !count) {
      return;
    }
    const value = meta[`cus_${code}`] || '';
    const previousEntry = (previousSlots?.[code] || 0) > 0 ? previousMeta?.[`cus_${code}`] : undefined;
    const previousDecisions = previousEntry ? parseCustomizationDecision(previousEntry) : [];
    const decisions = parseCustomizationDecision(value);

    const previousSelections: CustomizationChoice[] = flatMap(card.customization_options, option => {
      const previous = find(previousDecisions, pd => pd.index === option.index);
      if (!previous && option.xp) {
        return [];
      }
      const basic: CoreCustomizationChoice = {
        option,
        xp_spent: previous?.spent_xp || 0,
        xp_locked: previous?.spent_xp || 0,
        editable: false,
        unlocked: (previous?.spent_xp || 0) === option.xp,
      };
      return processAdvancedChoice(basic, previous?.choice, option, cards);
    })
    previousCustomizations[code] = previousSelections;
    const selections: CustomizationChoice[] = flatMap(card.customization_options, (option): CustomizationChoice[] | CustomizationChoice => {
      const decision = find(decisions, d => d.index === option.index);
      const previous = find(previousDecisions, pd => pd.index === option.index);
      if (!decision && option.xp) {
        return [];
      }
      const basic: CoreCustomizationChoice = {
        option,
        xp_spent: decision?.spent_xp || 0,
        xp_locked: previous?.spent_xp || 0,
        editable: !previous || (previous.spent_xp < (option.xp || 0)),
        unlocked: (decision?.spent_xp || 0) === option.xp,
      };
      return processAdvancedChoice(basic, decision?.choice, option, cards);
    })
    result[code] = selections;
  });
  return [result, previousCustomizations];
}

export function parseDeck(
  investigator_code: string,
  meta: DeckMeta,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  sideSlots: Slots,
  cards: CardsMap,
  listSeperator: string,
  previousDeck?: Deck,
  xpAdjustment?: number,
  originalDeck?: Deck
): ParsedDeck | undefined {
  const [customizations, previousCustomizations] = parseCustomizations(meta, slots, cards, previousDeck?.meta, previousDeck?.slots);
  const investigator_front_code = meta.alternate_front || investigator_code;
  const investigator_back_code = meta.alternate_back || investigator_code;
  const investigator: Card | undefined = cards[investigator_back_code];
  if (!investigator) {
    return undefined;
  }
  const validation = new DeckValidation(investigator, slots, meta);
  const cardIds = flatMap(
    sortBy(
      sortBy(
        filter(uniq([...keys(slots), ...keys(originalDeck?.slots)]), id => !!cards[id]),
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
      const customizedCard = card.withCustomizations(listSeperator, customizations[card.code]);
      const invalid = !validation.canIncludeCard(customizedCard, false);
      return {
        id,
        quantity: slots[id] || 0,
        invalid: invalid || (customizedCard.deck_limit !== undefined && slots[id] > customizedCard.deck_limit),
        limited: validation.isCardLimited(customizedCard),
        custom: card.custom(),
      };
    });
  const specialCards = map(
    filter(cardIds,
      c => (isSpecialCard(cards[c.id]) && c.quantity >= 0) || ignoreDeckLimitSlots[c.id] > 0
    ), c => {
      if (ignoreDeckLimitSlots[c.id] > 0) {
        return {
          ...c,
          quantity: ignoreDeckLimitSlots[c.id],
          ignoreCount: true,
        };
      }
      return c;
    }
  );
  const normalCards = map(
    filter(cardIds, c =>
      !isSpecialCard(cards[c.id]) && ((
        c.quantity > (ignoreDeckLimitSlots[c.id] || 0)
      ) || (
        (ignoreDeckLimitSlots[c.id] || 0) === 0 && c.quantity >= 0
      ))
    ), c => {
      if (ignoreDeckLimitSlots[c.id] > 0) {
        return {
          ...c,
          quantity: c.quantity - ignoreDeckLimitSlots[c.id],
        };
      }
      return c;
    }
  );
  const sideCards: CardId[] = flatMap(
    sortBy(
      sortBy(
        filter(uniq([...keys(originalDeck?.sideSlots || {}), ...keys(sideSlots)]), id => !!cards[id]),
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

  const deckCards = getCards(cards, slots, ignoreDeckLimitSlots, listSeperator, customizations);
  const problem = validation.getProblem(deckCards) || undefined;

  const changes = originalDeck && getDeckChanges(
    cards,
    validation,
    originalDeck,
    slots,
    ignoreDeckLimitSlots,
    listSeperator,
    customizations,
    previousDeck,
    previousCustomizations
  );
  const totalXp = calculateTotalXp(cards, slots, ignoreDeckLimitSlots, customizations);

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
    id: originalDeck ? getDeckId(originalDeck) : undefined,
    investigator,
    investigatorFront: cards[investigator_front_code] || investigator,
    investigatorBack: cards[investigator_back_code] || investigator,
    deck: originalDeck,
    slots,
    customizations,
    normalCardCount: sumBy(normalCards, c => c.quantity),
    deckSize: validation.getDeckSize(),
    totalCardCount: sum(cardIds.map(c => c.quantity)),
    experience: totalXp,
    availableExperience: (originalDeck?.xp || 0) + (xpAdjustment || 0),
    packs: uniqBy(cardIds, c => {
      const card = cards[c.id];
      return (card && card.pack_code) || '';
    }).length,
    factionCounts,
    costHistogram: costHistogram(cardIds, cards),
    slotCounts,
    skillIconCounts,
    normalCards: splitCards(normalCards, listSeperator, customizations, cards),
    specialCards: splitCards(specialCards, listSeperator, customizations,cards),
    sideCards: splitCards(sideCards, listSeperator, customizations, cards),
    ignoreDeckLimitSlots,
    changes,
    problem,
    limitedSlots: !!find(validation.deckOptions(), option =>
      !!option.limit && !find(option.trait || [], trait => trait === 'Covenant')
    ),
    customContent: !!find(normalCards, c => c.custom) || !!find(specialCards, c => c.custom),
  };
}
