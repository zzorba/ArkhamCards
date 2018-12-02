import { forEach } from 'lodash';

export function newLocalDeck(id, name, investigator_code, slots) {
  const timestamp = (new Date()).toISOString();
  return {
    id,
    date_creation: timestamp,
    date_update: timestamp,
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
  const timestamp = (new Date()).toISOString();
  return Object.assign(
    {},
    deck,
    {
      name,
      date_update: timestamp,
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
  const timestamp = (new Date()).toISOString();
  return {
    deck: Object.assign({}, deck, { next_deck: id }),
    upgradedDeck: Object.assign(
      {},
      deck,
      {
        id,
        slots,
        date_creation: timestamp,
        date_update: timestamp,
        problem: exiles.length ? 'too_few_cards' : deck.problem,
        xp: xp + (deck.xp || 0) - (deck.spentXp || 0),
        spentXp: 0,
        version: versionParts.join('.'),
        previous_deck: deck.id,
      },
    ),
  };
}

export function cloneLocalDeck(id, deck, name) {
  const timestamp = (new Date()).toISOString();
  return Object.assign(
    {},
    deck,
    {
      id,
      date_creation: timestamp,
      date_update: timestamp,
      name,
      local: true,
      version: '0.1',
      xp: 0,
      spentXp: 0,
      previous_deck: null,
      next_deck: null,
    }
  );
}

export default {
  newLocalDeck,
  updateLocalDeck,
  upgradeLocalDeck,
  cloneLocalDeck,
};
