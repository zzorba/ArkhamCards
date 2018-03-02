import PropTypes from 'prop-types';
import { sum, uniqBy } from 'lodash';

import { CardType } from './types';

function filterBy(cardIds, cards, field, value) {
  return cardIds.filter(c => cards[c.id][field] === value);
}

function groupAssets(cardIds, cards) {
  const assets = filterBy(cardIds, cards, 'type_code', 'asset');
  return [
    { type: 'Hand', data: filterBy(assets, cards, 'slot', 'Hand') },
    { type: 'Arcane', data: filterBy(assets, cards, 'slot', 'Arcane') },
    { type: 'Accessory', data: filterBy(assets, cards, 'slot', 'Accessory') },
    { type: 'Body', data: filterBy(assets, cards, 'slot', 'Body') },
    { type: 'Ally', data: filterBy(assets, cards, 'slot', 'Ally') },
    { type: 'Other', data: filterBy(assets, cards, 'slot', undefined) },
  ].filter(asset => asset.data.length > 0);
}

function isSpecialCard(card) {
  return card.subtype_code === 'weakeness' ||
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
  })
  return result;
}

function computeXp(card) {
  return card.xp ? ((card.exceptional ? 2 : 1) * (card.xp)) : 0;
}

export function parseDeck(deck, cards) {
  if (!deck) {
    return {};
  }
  const cardIds = Object.keys(deck.slots).map(id => {
    return {
      id,
      quantity: deck.slots[id],
    };
  });
  const investigator = deck.investigator_code;
  const specialCards = cardIds.filter(c => isSpecialCard(cards[c.id]));
  const normalCards = cardIds.filter(c => !isSpecialCard(cards[c.id]));
  return {
    investigator: cards[deck.investigator_code],
    deck: deck,
    normalCardCount: sum(normalCards.map(c => c.quantity)),
    totalCardCount: sum(cardIds.map(c => c.quantity)),
    experience: sum(cardIds.map(c => computeXp(cards[c.id]) * c.quantity)),
    packs: uniqBy(cardIds, c => cards[c.id].pack_code).length,
    normalCards: splitCards(normalCards, cards, deck.slots),
    specialCards: splitCards(specialCards, cards, deck.slots),
  };
}

const DeckSectionShape = {
  Assets: PropTypes.array,
  Events: PropTypes.array,
  Skills: PropTypes.array,
  Treachery: PropTypes.array,
  Enemy: PropTypes.array,
};
export const OptioanlDeckSectionType = PropTypes.shape(DeckSectionShape);
export const DeckSectionType = PropTypes.shape(DeckSectionShape).isRequired;

const DeckShape = {
  investigator: CardType,
  deck: PropTypes.object.isRequired,
  normalCardCount: PropTypes.number,
  totalCardCount: PropTypes.number,
  experience: PropTypes.number,
  packs: PropTypes.number,
  normalCards: DeckSectionType,
  specialCards: DeckSectionType,
};
export const OptionalDeckType = PropTypes.shape(DeckShape);
export const DeckType = PropTypes.shape(DeckShape).isRequired;
