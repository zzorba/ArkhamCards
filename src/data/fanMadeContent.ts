import { useSyncExternalStore } from 'react';
import { forEach, keys } from 'lodash';

import Card from './types/Card';
import { getDatabase } from './sqlite/DatabaseProvider';
import { upsertArkhamBuildCustomCards } from './arkhamBuildCards';
import { ArkhamBuildFanMadeCard, ArkhamBuildFanMadeContent } from './types/ArkhamBuildFanMadeContent';

/**
 * Fan-made card definitions travel with decks (arkham.build decks, local copies
 * of them, other players' campaign decks) rather than with the card sync. Every
 * definition we see is registered here and written to the card database, and
 * written again whenever a card sync wipes the table.
 */
const known: Required<ArkhamBuildFanMadeContent> = { cards: {}, packs: {}, cycles: {}, encounter_sets: {} };
let written: { [id: string]: string | undefined } = {};
let version = 0;
const listeners = new Set<() => void>();
let flushing: Promise<Card[]> = Promise.resolve([]);

function notify() {
  version++;
  listeners.forEach(listener => listener());
}

/**
 * Every fan-made definition seen so far, including other players' decks.
 */
export function getKnownFanMadeContent(): ArkhamBuildFanMadeContent {
  return known;
}

export function addFanMadeContent(content: ArkhamBuildFanMadeContent | undefined) {
  if (!content?.cards) {
    return;
  }
  Object.assign(known.cards, content.cards);
  Object.assign(known.packs, content.packs);
  Object.assign(known.cycles, content.cycles);
  Object.assign(known.encounter_sets, content.encounter_sets);
}

async function doFlush(): Promise<Card[]> {
  const db = getDatabase();
  if (!db) {
    // Nothing is marked as written, so the next flush picks it all up.
    return [];
  }
  const pending: { [id: string]: ArkhamBuildFanMadeCard } = {};
  const pendingJson: { [id: string]: string } = {};
  forEach(known.cards, (card, id) => {
    const json = JSON.stringify(card);
    if (written[id] !== json) {
      pending[id] = card;
      pendingJson[id] = json;
    }
  });
  if (!keys(pending).length) {
    return [];
  }
  let cards: Card[] = [];
  try {
    cards = await upsertArkhamBuildCustomCards(db, { ...known, cards: pending });
  } catch (e) {
    console.log('[fan-made] Failed to write custom cards:', e);
  }
  // Marked even on failure so a bad definition doesn't get retried forever.
  forEach(pendingJson, (json, id) => {
    written[id] = json;
  });
  notify();
  return cards;
}

/**
 * Write any registered definitions that are not in the card database yet.
 * Resolves with the cards that were written once they can be queried.
 */
export function flushFanMadeContent(): Promise<Card[]> {
  flushing = flushing.then(doFlush, doFlush);
  return flushing;
}

export function registerFanMadeContent(content: ArkhamBuildFanMadeContent | undefined): Promise<Card[]> {
  addFanMadeContent(content);
  return flushFanMadeContent();
}

/**
 * The card sync replaces the card table, so everything has to be written again.
 */
export function resetFanMadeContent(): Promise<Card[]> {
  written = {};
  return flushFanMadeContent();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getVersion() {
  return version;
}

/**
 * Changes whenever new fan-made cards are written, so card lookups that came up
 * short can try again.
 */
export function useFanMadeContentVersion(): number {
  return useSyncExternalStore(subscribe, getVersion);
}
