import PropTypes from 'prop-types';
import { concat, filter, forEach, keys, map, mapValues, range, groupBy, pullAt, sortBy, sum, uniqBy } from 'lodash';

import L from '../app/i18n';
import { FACTION_CODES, SKILLS } from '../constants';

function filterBy(cardIds, cards, field, value) {
  return cardIds.filter(c => cards[c.id] && cards[c.id][field] === value);
}

function groupAssets(cardIds, cards) {
  const assets = filterBy(cardIds, cards, 'type_code', 'asset');
  const groups = groupBy(assets, c => {
    switch(cards[c.id].slot) {
      case 'Hand': return L('Hand');
      case 'Hand x2': return L('Hand x2');
      case 'Arcane': return L('Arcane');
      case 'Accessory': return L('Accessory');
      case 'Body': return L('Body');
      case 'Body. Hand x2': return L('Body. Hand x2');
      case 'Ally': return L('Ally');
      default: return L('Other');
    }
  });
  return filter(
    map(
      [L('Hand'), L('Hand x2'), L('Body. Hand x2'), L('Arcane'), L('Accessory'), L('Body'), L('Ally'), L('Other')],
      t => {
        return { type: t, data: groups[t] || [] };
      }),
    asset => asset.data.length > 0
  );
}

export function isSpecialCard(card) {
  return card && (
    card.code === '01000' ||
    card.permanent ||
    card.subtype_code === 'weakness' ||
    card.subtype_code === 'basicweakness' ||
    card.spoiler ||
    card.restrictions
  );
}

function splitCards(cardIds, cards) {
  const result = {};

  const groupedAssets = groupAssets(cardIds, cards);
  if (groupedAssets.length > 0) {
    result.Assets = groupedAssets;
  }
  ['Event', 'Skill', 'Treachery', 'Enemy'].forEach(type_code => {
    const typeCards = filterBy(cardIds, cards, 'type_code', type_code.toLowerCase());
    if (typeCards.length > 0) {
      result[type_code] = typeCards;
    }
  });
  return result;
}

function computeXp(card) {
  return (card && card.xp) ? ((card.exceptional ? 2 : 1) * (card.xp)) : 0;
}

function factionCount(cardIds, cards, faction) {
  return sum(cardIds.filter(c => (
    cards[c.id] &&
    !cards[c.id].permanent &&
    !cards[c.id].double_sided &&
    cards[c.id].code !== '02014' &&
    cards[c.id].faction_code === faction
  )).map(c => c.quantity));
}

function costHistogram(cardIds, cards) {
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

function sumSkillIcons(cardIds, cards, skill) {
  return sum(cardIds.map(c =>
    ((cards[c.id] && cards[c.id][`skill_${skill}`]) || 0) * c.quantity));
}

function getChangedCards(deck, slots, previousDeck, exiledCards) {
  if (!deck.previous_deck || !previousDeck) {
    return {};
  }
  const changedCards = {};
  forEach(
    uniqBy(concat(keys(slots), keys(previousDeck.slots))),
    code => {
      const exiledCount = exiledCards[code] || 0;
      const newCount = slots[code] || 0;
      const oldCount = previousDeck.slots[code] || 0;
      const delta = (newCount + exiledCount) - oldCount;
      if (delta !== 0) {
        changedCards[code] = delta;
      }
    });
  return changedCards;
}

function calculateTotalXp(cards, slots) {
  return sum(map(keys(slots), code => {
    const card = cards[code];
    return ((card && computeXp(card)) || 0) * slots[code];
  }));
}

const ARCANE_RESEARCH_CODE = '04109';
const ADAPTABLE_CODE = '02110';
function calculateSpentXp(cards, slots, changedCards, exiledCards) {
  const exiledSlots = [];
  forEach(keys(exiledCards), code => {
    if (exiledCards[code] > 0) {
      const card = cards[code];
      if (card) {
        forEach(range(0, exiledCards[code]), () => exiledSlots.push(card));
      }
    }
  });
  let adaptableUses = (slots[ADAPTABLE_CODE] || 0) * 2;
  let arcaneResearchUses = (slots[ARCANE_RESEARCH_CODE] || 0);

  const addedCards = [];
  const removedCards = [];
  forEach(keys(changedCards), code => {
    const card = cards[code];
    if (card) {
      if (changedCards[code] < 0) {
        for (let i = changedCards[code]; i < 0; i++) {
          removedCards.push(card);
        }
      } else {
        for (let i = 0; i < changedCards[code]; i++) {
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
      card => -card.xp
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
            addedCard.xp > removedCard.xp) {

          pullAt(removedCards, [i]);

          // If you have unspent uses of arcaneResearchUses,
          // and its a spell, you get a 1 XP discount on upgrade of
          // a spell to a spell.
          if (arcaneResearchUses > 0 &&
            removedCard.traits_normalized.indexOf('#spell#') !== -1 &&
            addedCard.traits_normalized.indexOf('#spell#') !== -1) {
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

export function parseDeck(deck, slots, cards, previousDeck) {
  if (!deck) {
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
  const specialCards = cardIds.filter(c => isSpecialCard(cards[c.id]));
  const normalCards = cardIds.filter(c => !isSpecialCard(cards[c.id]));
  const exiledCards = deck.exile_string ? mapValues(
    groupBy(deck.exile_string.split(',')),
    items => items.length) : {};
  const changedCards = getChangedCards(deck, slots, previousDeck, exiledCards);
  const spentXp = calculateSpentXp(cards, slots, changedCards, exiledCards);
  const totalXp = calculateTotalXp(cards, slots);

  const factionCounts = {};
  FACTION_CODES.forEach(faction => {
    factionCounts[faction] = factionCount(cardIds, cards, faction);
  });
  const skillIconCounts = {};
  SKILLS.forEach(skill => {
    skillIconCounts[skill] = sumSkillIcons(cardIds, cards, skill);
  });

  return {
    investigator: cards[deck.investigator_code],
    deck: deck,
    slots: slots,
    normalCardCount: sum(normalCards.map(c => c.quantity)),
    totalCardCount: sum(cardIds.map(c => c.quantity)),
    experience: sum(cardIds.map(c => computeXp(cards[c.id]) * c.quantity)),
    packs: uniqBy(cardIds, c => cards[c.id].pack_code).length,
    factionCounts: factionCounts,
    costHistogram: costHistogram(cardIds, cards),
    skillIconCounts: skillIconCounts,
    normalCards: splitCards(normalCards, cards, slots),
    specialCards: splitCards(specialCards, cards, slots),
    exiledCards,
    changedCards,
    spentXp,
    totalXp,
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
