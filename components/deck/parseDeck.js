import PropTypes from 'prop-types';
import { mapValues, range, groupBy, sum, uniqBy } from 'lodash';

import { CardType } from '../cards/types';
import { FACTION_CODES, SKILLS } from '../../constants';

function filterBy(cardIds, cards, field, value) {
  return cardIds.filter(c => cards[c.id][field] === value);
}

function groupAssets(cardIds, cards) {
  const assets = filterBy(cardIds, cards, 'type_code', 'asset');
  return [
    { type: 'Hand', data: filterBy(assets, cards, 'slot', 'Hand') },
    { type: 'Hand x2', data: filterBy(assets, cards, 'slot', 'Hand x2') },
    { type: 'Arcane', data: filterBy(assets, cards, 'slot', 'Arcane') },
    { type: 'Accessory', data: filterBy(assets, cards, 'slot', 'Accessory') },
    { type: 'Body', data: filterBy(assets, cards, 'slot', 'Body') },
    { type: 'Ally', data: filterBy(assets, cards, 'slot', 'Ally') },
    { type: 'Other', data: filterBy(assets, cards, 'slot', undefined) },
  ].filter(asset => asset.data.length > 0);
}

function isSpecialCard(card) {
  return card.code === '01000' ||
    card.subtype_code === 'weakeness' ||
    card.spoiler ||
    card.restrictions;
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
  return card.xp ? ((card.exceptional ? 2 : 1) * (card.xp)) : 0;
}

function factionCount(cardIds, cards, faction) {
  return sum(cardIds.filter(c =>
    !cards[c.id].permanent && cards[c.id].faction_code === faction
  ).map(c => c.quantity));
}

function costHistogram(cardIds, cards) {
  const costHisto = mapValues(
    groupBy(
      cardIds.filter(c => {
        const card = cards[c.id];
        return !card.permanent && (
          card.type_code === 'asset' || card.type_code === 'event');
      }),
      c => cards[c.id].cost),
    cs => sum(cs.map(c => c.quantity))
  );
  return range(0, 6).map(cost => costHisto[cost] || 0);
}

function sumSkillIcons(cardIds, cards, skill) {
  return sum(cardIds.map(c =>
    (cards[c.id][`skill_${skill}`] || 0) * c.quantity));
}

export function parseDeck(deck, slots, cards) {
  if (!deck) {
    return {};
  }
  const cardIds = Object.keys(slots).map(id => {
    return {
      id,
      quantity: slots[id],
    };
  });
  const specialCards = cardIds.filter(c => isSpecialCard(cards[c.id]));
  const normalCards = cardIds.filter(c => !isSpecialCard(cards[c.id]));
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
  investigator: CardType,
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
