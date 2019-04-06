import PropTypes from 'prop-types';
import { concat, filter, forEach, keys, map, mapValues, range, groupBy, pullAt, sortBy, sum, uniqBy, union } from 'lodash';

import L from '../app/i18n';
import { Deck, Slots } from '../actions/types';
import Card, { CardKey, CardsMap } from '../data/Card';
import {
  PLAYER_FACTION_CODES,
  SKILLS,
  RANDOM_BASIC_WEAKNESS,
  FactionCodeType,
  SkillCodeType,
} from '../constants';

interface CardId {
  id: string;
  quantity: number;
}

function filterBy(
  cardIds: CardId[],
  cards: CardsMap,
  field: CardKey,
  value: any
): CardId[] {
  return cardIds.filter(c => cards[c.id] && cards[c.id][field] === value);
}

interface AssetGroup {
  type: string;
  data: CardId[];
}

function groupAssets(cardIds: CardId[], cards: CardsMap): AssetGroup[] {
  const assets = filterBy(cardIds, cards, 'type_code', 'asset');
  const groups = groupBy(assets, c => {
    switch (cards[c.id].slot) {
      case 'Hand': return L('Hand');
      case 'Hand. Arcane': return L('Hand. Arcane');
      case 'Hand x2': return L('Hand x2');
      case 'Arcane': return L('Arcane');
      case 'Accessory': return L('Accessory');
      case 'Body': return L('Body');
      case 'Body. Hand x2': return L('Body. Hand x2');
      case 'Ally': return L('Ally');
      case 'Tarot': return L('Tarot');
      default: return L('Other');
    }
  });
  return filter(
    map(
      [
        L('Hand'),
        L('Hand x2'),
        L('Hand. Arcane'),
        L('Body. Hand x2'),
        L('Arcane'),
        L('Accessory'),
        L('Body'),
        L('Ally'),
        L('Tarot'),
        L('Other'),
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


interface SplitCards {
  Assets?: AssetGroup[];
  Event?: CardId[];
  Skill?: CardId[];
  Treachery?: CardId[];
  Enemy?: CardId[];
}
type CardSplitType = keyof SplitCards;

function splitCards(cardIds: CardId[], cards: CardsMap): SplitCards {
  const result: SplitCards = {};

  const groupedAssets = groupAssets(cardIds, cards);
  if (groupedAssets.length > 0) {
    result.Assets = groupedAssets;
  }
  const otherTypes: CardSplitType[] = ['Event', 'Skill', 'Treachery', 'Enemy'];
  otherTypes.forEach(type_code => {
    const typeCards = filterBy(cardIds, cards, 'type_code', type_code.toLowerCase());
    if (typeCards.length > 0) {
      result[type_code] = typeCards;
    }
  });
  return result;
}

function computeXp(card?: Card) {
  return (card && card.xp) ? ((card.exceptional ? 2 : 1) * (card.xp)) : 0;
}

function factionCount(
  cardIds: CardId[],
  cards: CardsMap,
  faction: FactionCodeType
): number {
  return sum(cardIds.filter(c => (
    cards[c.id] &&
    !cards[c.id].permanent &&
    !cards[c.id].double_sided &&
    cards[c.id].code !== '02014' &&
    cards[c.id].faction_code === faction
  )).map(c => c.quantity));
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
      c => cards[c.id] ? cards[c.id].cost : 0),
    cs => sum(cs.map(c => c.quantity))
  );
  return range(0, 6).map(cost => costHisto[cost] || 0);
}

function sumSkillIcons(cardIds: CardId[], cards: CardsMap, skill: SkillCodeType): number {
  return sum(cardIds.map(c =>
    (cards[c.id] ? cards[c.id].skillCount(skill) : 0) * c.quantity));
}

function getChangedCards(
  deck: Deck,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  exiledCards: Slots,
  previousDeck?: Deck
) {
  if (!deck.previous_deck || !previousDeck) {
    return {};
  }
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
  return changedCards;
}

function calculateTotalXp(
  cards: CardsMap,
  slots: Slots,
  ignoreDeckLimitSlots: Slots
): number {
  return sum(map(keys(slots), code => {
    const card = cards[code];
    const xp = (card && computeXp(card)) || 0;
    const count = (slots[code] || 0) - (ignoreDeckLimitSlots[code] || 0);
    return xp * count;
  }));
}

const ARCANE_RESEARCH_CODE = '04109';
const ADAPTABLE_CODE = '02110';
function calculateSpentXp(
  cards: CardsMap,
  slots: Slots,
  changedCards: Slots,
  exiledCards: Slots
) {
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

  return sum(map(
    sortBy(
      // null cards are story assets, so putting them in is free.
      filter(addedCards, card => card.xp !== null),
      card => -(card.xp || 0)
    ),
    addedCard => {
      // We visit cards from high XP to low XP, so if there's 0 XP card,
      if (addedCard.xp === 0) {
        // We've found matches for all the other cards already.
        // Only 0 XP cards are left, so it's safe to apply adaptable changes.
        if (exiledSlots.length > 0) {
          // Every exiled card gives you one free '0' cost insert.
          pullAt(exiledSlots, [0]);
          return 0;
        }
        // You can use adaptable to swap in to level 0s.
        // It is okay even if you just took adaptable this time.
        if (adaptableUses > 0) {
          for (let i = 0; i < removedCards.length; i++) {
            const removedCard = removedCards[i];
            if (removedCard.xp !== null && removedCard.xp === 0) {
              pullAt(removedCards, [i]);
              adaptableUses--;
              return 0;
            }
          }
          // Couldn't find a 0 cost card to remove, it's weird that you
          // chose to take away an XP card?
          return 1;
        }
        // But if there's no slots it costs you a minimum of 1 xp to swap
        // 0 for 0.
        return 1;
      }

      // XP higher than 0.
      // See if there's a lower version card that counts as an upgrade.
      // TODO(daniel): handle card 04106 (Shrewd Analysis)
      for (let i = 0; i < removedCards.length; i++) {
        const removedCard = removedCards[i];
        if (addedCard.name === removedCard.name &&
            addedCard.xp !== null &&
            removedCard.xp !== null &&
            addedCard.xp > removedCard.xp) {

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
      return computeXp(addedCard);
    }
  ));
}

type FactionCounts = {
  [faction in FactionCodeType]?: number;
};

type SkillCounts = {
  [skill in SkillCodeType]?: number;
};

export interface ParsedDeck {
  investigator: Card;
  deck: Deck;
  slots: Slots;
  normalCardCount: number;
  totalCardCount: number;
  experience: number;
  packs: number;
  factionCounts: FactionCounts;
  costHistogram: number[];
  skillIconCounts: SkillCounts;
  normalCards: SplitCards;
  specialCards: SplitCards;
  ignoreDeckLimitSlots: Slots;
  exiledCards: Slots;
  changedCards: Slots;
  spentXp: number;
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
    isSpecialCard(cards[c.id]) || ignoreDeckLimitSlots[c.id] > 0);
  const normalCards = cardIds.filter(c =>
    !isSpecialCard(cards[c.id]) && slots[c.id] > (ignoreDeckLimitSlots[c.id] || 0));
  const exiledCards = deck.exile_string ? mapValues(
    groupBy(deck.exile_string.split(',')),
    items => items.length) : {};
  const changedCards = getChangedCards(deck, slots, ignoreDeckLimitSlots, exiledCards, previousDeck);
  const spentXp = calculateSpentXp(cards, slots, changedCards, exiledCards);
  const totalXp = calculateTotalXp(cards, slots, ignoreDeckLimitSlots);

  const factionCounts: FactionCounts = {};
  PLAYER_FACTION_CODES.forEach(faction => {
    factionCounts[faction] = factionCount(cardIds, cards, faction);
  });
  const skillIconCounts: SkillCounts = {};
  SKILLS.forEach(skill => {
    skillIconCounts[skill] = sumSkillIcons(cardIds, cards, skill);
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
    skillIconCounts: skillIconCounts,
    normalCards: splitCards(normalCards, cards),
    specialCards: splitCards(specialCards, cards),
    ignoreDeckLimitSlots,
    exiledCards,
    changedCards,
    spentXp: spentXp || 0,
  };
}

const DeckFactionShape = {
  guardian: PropTypes.number,
  seeker: PropTypes.number,
  mystic: PropTypes.number,
  rogue: PropTypes.number,
  survivor: PropTypes.number,
  neutral: PropTypes.number,
};
export const OptionalDeckFactionType = PropTypes.shape(DeckFactionShape);
export const DeckFactionType = PropTypes.shape(DeckFactionShape).isRequired;

const DeckSectionShape = {
  Assets: PropTypes.array,
  Events: PropTypes.array,
  Skills: PropTypes.array,
  Treachery: PropTypes.array,
  Enemy: PropTypes.array,
};
export const OptionalDeckSectionType = PropTypes.shape(DeckSectionShape);
export const DeckSectionType = PropTypes.shape(DeckSectionShape).isRequired;

const DeckShape = {
  investigator: PropTypes.object.isRequired,
  deck: PropTypes.object.isRequired,
  normalCardCount: PropTypes.number,
  totalCardCount: PropTypes.number,
  experience: PropTypes.number,
  packs: PropTypes.number,
  factionCounts: DeckFactionType,
  skillIconCounts: PropTypes.object,
  costHistogram: PropTypes.arrayOf(PropTypes.number),
  normalCards: DeckSectionType,
  specialCards: DeckSectionType,
};
export const OptionalDeckType = PropTypes.shape(DeckShape);
export const DeckType = PropTypes.shape(DeckShape).isRequired;
