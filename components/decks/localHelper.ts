import { forEach } from 'lodash';

import { Deck, Slots } from '../../actions/types';

export function newLocalDeck(
  id: number,
  name: string,
  investigator_code: string,
  slots: Slots
): Deck {
  const timestamp = (new Date()).toISOString();
  return {
    id,
    date_creation: timestamp,
    date_update: timestamp,
    name,
    investigator_code,
    slots,
    ignoreDeckLimitSlots: {},
    local: true,
    problem: 'too_few_cards',
    version: '0.1',
  };
}

export function updateLocalDeck(
  deck: Deck,
  name: string,
  slots: Slots,
  problem: string,
  spentXp?: number,
  xp_adjustment?: number
) {
  const versionParts = (deck.version || '0.1').split('.');
  // @ts-ignore
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
      xp_adjustment: xp_adjustment || 0,
      version: versionParts.join('.'),
    },
  );
}

export function upgradeLocalDeck(
  id: number,
  deck: Deck,
  xp: number,
  exiles: string[]
) {
  const versionParts = (deck.version || '0.1').split('.');
  // @ts-ignore
  versionParts[0]++;
  // @ts-ignore
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
        xp: xp + (deck.xp || 0) + (deck.xp_adjustment || 0) - (deck.spentXp || 0),
        xp_adjustment: 0,
        spentXp: 0,
        version: versionParts.join('.'),
        previous_deck: deck.id,
        exile_string: exiles && exiles.length ? exiles.join(',') : null,
      },
    ),
  };
}

export function cloneLocalDeck(id: number, deck: Deck, name: string) {
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
