import { forEach } from 'lodash';

export function newLocalDeck(id, name, investigator_code, slots) {
  return {
    id,
    name,
    investigator_code,
    slots,
    local: true,
    problem: 'too_few_cards',
    version: '0.1',
  };
}

export function updateLocalDeck(deck, name, slots, problem, spentXp) {
  const versionParts = (deck.version || '0.1').split('.');
  versionParts[1]++;
  return Object.assign(
    {},
    deck,
    {
      name,
      slots,
      problem,
      spentXp,
      version: versionParts.join('.'),
    },
  );
}

export function upgradeLocalDeck(id, deck, xp, exiles) {
  const versionParts = (deck.version || '0.1').split('.');
  versionParts[0]++;
  versionParts[1] = 0;
  const slots = Object.assign({}, deck.slots);
  forEach(exiles, code => {
    slots[code]--;
    if (slots[code] <= 0) {
      delete slots[code];
    }
  });
  return {
    deck: Object.assign({}, deck, { next_deck: id }),
    upgradedDeck: Object.assign(
      {},
      deck,
      {
        id,
        slots,
        problem: exiles.length ? 'too_few_cards' : deck.problem,
        xp: xp + (deck.xp || 0) - (deck.spentXp),
        spentXp: 0,
        version: versionParts.join('.'),
        previous_deck: deck.id,
      },
    ),
  };

}

export default {
  newLocalDeck,
  updateLocalDeck,
  upgradeLocalDeck,
};
