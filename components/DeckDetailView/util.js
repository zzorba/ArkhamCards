import { filter, forEach, keys, map, pullAt, sortBy, sum } from 'lodash';

export function calculateSpentXp(cards, slots, changedCards, exiledCards) {
  const exiledSlots = {};
  forEach(keys(exiledCards), code => {
    const card = cards[code];
    for (let i = exiledCards[code]; i < 0; i++) {
      exiledSlots.push(card);
    }
  });
  let adaptableUses = (slots['02110'] || 0) * 2;
  let arcaneResearchUses = (slots['04109'] || 0);

  const addedCards = [];
  const removedCards = [];
  forEach(keys(changedCards), code => {
    const card = cards[code];
    if (changedCards[code] < 0) {
      for (let i = changedCards[code]; i < 0; i++) {
        removedCards.push(card);
      }
    } else {
      for (let i = 0; i < changedCards[code]; i++) {
        addedCards.push(card);
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
      // we've found matches for all the other cards already.
      // Only 0 XP cards are left.
      if (addedCard.xp === 0) {
        if (exiledSlots.length > 0) {
          // Every exiled card gives you one free '0' cost insert.
          pullAt(exiledSlots, [0]);
          return 0;
        }
        // You can use adaptable to swap in to level 0s.
        // Technically you have to take
        if (adaptableUses > 0) {
          for (let i = 0; i < removedCards.length; i++) {
            const removedCard = removedCards[i];
            if (removedCard.xp !== null && removedCard.xp === 0) {
              pullAt(removedCards, [i]);
              adaptableUses--;
              return 0;
            }
          }
          // Couldn't find a 0 cost card to remove, that's weird.
          return 1;
        }
        // But if there's no slots it costs you a minimum of 1 xp.
        return 1;
      }
      // XP higher than 0.
      // See if there's a lower version card that counts as an upgrade.
      // TODO: handle card 04109 (Arcane Research) and 04106 (Shrewd Analysis)
      for (let i = 0; i < removedCards.length; i++) {
        const removedCard = removedCards[i];
        if (addedCard.name === removedCard.name &&
            addedCard.xp > removedCard.xp) {

          pullAt(removedCards, [i]);

          // If you have unspent uses of arcaneResearchUses,
          // and its a spell, you get a 1 XP discount on first spell.
          if (arcaneResearchUses > 0 &&
            addedCard.traits_normalized.indexOf('#spell#') !== -1) {
            arcaneResearchUses--;
            return (addedCard.xp - removedCard.xp) - 1;
          }
          // Upgrade of the same name, so you only pay the delta.
          return (addedCard.xp - removedCard.xp);
        }
      }
      return addedCard.xp;
    }
  ));
}

export default {
  calculateSpentXp,
};
