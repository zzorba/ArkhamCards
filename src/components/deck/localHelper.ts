import { forEach } from 'lodash';
import uuid from 'react-native-uuid';

import { UpgradeDeckResult } from '@lib/authApi';
import { Deck, DeckProblemType, DeckMeta, Slots, DeckId, getDeckId } from '@actions/types';

export function newLocalDeck(
  name: string,
  investigator_code: string,
  slots: Slots,
  tabooSetId?: number,
  meta?: DeckMeta,
  problem?: DeckProblemType,
  description_md?: string
): Deck {
  const timestamp = (new Date()).toISOString();
  return {
    uuid: uuid.v4(),
    description_md,
    date_creation: timestamp,
    date_update: timestamp,
    name,
    investigator_code,
    slots,
    meta,
    taboo_id: tabooSetId,
    ignoreDeckLimitSlots: {},
    local: true,
    problem,
    version: '0.1',
  };
}

export function updateLocalDeck(
  deck: Deck,
  name: string,
  slots: Slots,
  ignoreDeckLimitSlots: Slots,
  problem: DeckProblemType,
  spentXp?: number,
  xp_adjustment?: number,
  tabooSetId?: number,
  meta?: DeckMeta,
  description_md?: string,
  sideSlots?: Slots
): Deck {
  const versionParts = (deck.version || '0.1').split('.');
  // @ts-ignore
  versionParts[1]++;
  const timestamp = (new Date()).toISOString();
  return {
    ...deck,
    name,
    date_update: timestamp,
    slots,
    ignoreDeckLimitSlots,
    problem,
    spentXp,
    xp_adjustment: xp_adjustment || 0,
    version: versionParts.join('.'),
    taboo_id: tabooSetId,
    meta,
    description_md,
    sideSlots,
  };
}

export function upgradeLocalDeck(
  previousDeck: Deck,
  xp: number,
  exiles: string[]
): UpgradeDeckResult {
  const versionParts = (previousDeck.version || '0.1').split('.');
  // @ts-ignore
  versionParts[0]++;
  // @ts-ignore
  versionParts[1] = 0;
  const slots = Object.assign({}, previousDeck.slots);
  forEach(exiles, code => {
    slots[code]--;
    if (slots[code] <= 0) {
      delete slots[code];
    }
  });
  const timestamp = (new Date()).toISOString();
  const id: DeckId = {
    id: undefined,
    arkhamdb_user: undefined,
    local: true,
    uuid: uuid.v4(),
  };
  return {
    deck: {
      ...previousDeck,
      nextDeckId: id,
    },
    upgradedDeck: {
      ...previousDeck,
      local: true,
      uuid: id.uuid,
      slots,
      date_creation: timestamp,
      date_update: timestamp,
      problem: exiles.length ? 'too_few_cards' : previousDeck.problem,
      xp: xp + (previousDeck.xp || 0) + (previousDeck.xp_adjustment || 0) - (previousDeck.spentXp || 0),
      xp_adjustment: 0,
      spentXp: 0,
      version: versionParts.join('.'),
      previousDeckId: getDeckId(previousDeck),
      exile_string: exiles && exiles.length ? exiles.join(',') : '',
    },
  };
}

export default {
  newLocalDeck,
  updateLocalDeck,
  upgradeLocalDeck,
};
