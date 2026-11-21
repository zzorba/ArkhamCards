import { filter, find, flatMap, forEach, fromPairs, keys, map, omit, trim, uniq } from 'lodash';

import { getAccessToken } from './arkhamBuildAuth';
import {
  ArkhamBuildDeck,
  DeckMeta,
  DeckProblemType,
  Slots,
  INVESTIGATOR_PROBLEM,
  TOO_MANY_COPIES,
  INVALID_CARDS,
  NON_POOL_CARDS,
  TOO_FEW_CARDS,
  TOO_MANY_CARDS,
  DECK_OPTIONS_LIMIT,
} from '@actions/types';
import { fanMadeContentFromCards, mergeFanMadeContent, metaCardCodes, parseArkhamBuildMeta, remapMetaCodes } from '@data/arkhamBuildCards';
import { ArkhamBuildFanMadeContent } from '@data/types/ArkhamBuildFanMadeContent';
import { getDatabase } from '@data/sqlite/DatabaseProvider';
import Card from '@data/types/Card';

const API_BASE = 'https://api.arkham.build';

export interface ArkhamBuildUser {
  id: string;
  username: string;
}

interface ManifestDeckEntry {
  source: 'account' | 'arkhamdb';
  id: string | number;
  updatedAt: string;
  version: string;
}

interface ManifestResponse {
  version: string;
  arkhamdbSyncToken: string | null;
  providers: {
    account: { available: boolean };
    arkhamdb: { available: boolean };
  };
  decks: ManifestDeckEntry[];
}

interface ArkhamBuildApiDeck {
  id: string | number;
  source?: string | null;
  name: string;
  investigator_code: string;
  date_creation: string;
  date_update: string;
  description_md?: string;
  meta?: string;
  slots: Slots;
  sideSlots?: Slots | null;
  ignoreDeckLimitSlots?: Slots | null;
  tags?: string;
  taboo_id?: number | null;
  version?: string;
  xp?: number | null;
  xp_adjustment?: number | null;
  xp_spent?: number | null;
  exile_string?: string | null;
  problem?: string | null;
  previous_deck?: string | number | null;
  next_deck?: string | number | null;
  user_id?: number | null;
}

async function authenticatedFetch(path: string, options?: RequestInit): Promise<Response> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('badAccessToken');
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
  });
  if (response.status === 401) {
    throw new Error('unauthorized');
  }
  if (response.status === 403) {
    throw new Error('forbidden');
  }
  return response;
}

export async function getProfile(): Promise<ArkhamBuildUser> {
  const response = await authenticatedFetch('/v2/user/me');
  if (response.status !== 200) {
    throw new Error(`Unexpected status: ${response.status}`);
  }
  return await response.json();
}

const DECK_PROBLEMS: DeckProblemType[] = [
  INVESTIGATOR_PROBLEM,
  TOO_MANY_COPIES,
  INVALID_CARDS,
  NON_POOL_CARDS,
  TOO_FEW_CARDS,
  TOO_MANY_CARDS,
  DECK_OPTIONS_LIMIT,
];

function cleanDeck(apiDeck: ArkhamBuildApiDeck, arkhambuild_user: string): ArkhamBuildDeck {
  const { meta, fan_made_content, hidden_slots } = parseArkhamBuildMeta(apiDeck.meta);

  let tags: string | undefined;
  if (apiDeck.tags) {
    if (apiDeck.tags === '{}') {
      tags = undefined;
    } else {
      try {
        tags = filter(map(apiDeck.tags.split(/[, ]/), x => trim(x)), x => !!x).join(' ');
      } catch (e) {
        tags = undefined;
      }
    }
  }

  const slots = apiDeck.slots || {};
  forEach(Object.keys(slots), code => {
    if ((slots[code] ?? 0) < 0) {
      slots[code] = 0;
    }
  });

  const deck: ArkhamBuildDeck = {
    id: undefined,
    local: undefined,
    uuid: undefined,
    arkhambuild_id: `${apiDeck.id}`,
    arkhambuild_user,
    user_id: undefined,
    name: apiDeck.name,
    investigator_code: apiDeck.investigator_code,
    date_creation: apiDeck.date_creation,
    date_update: apiDeck.date_update,
    description_md: apiDeck.description_md,
    meta,
    fan_made_content,
    hidden_slots,
    slots,
    sideSlots: apiDeck.sideSlots || undefined,
    ignoreDeckLimitSlots: apiDeck.ignoreDeckLimitSlots || {},
    tags,
    taboo_id: apiDeck.taboo_id || undefined,
    version: apiDeck.version,
    xp: apiDeck.xp || undefined,
    xp_adjustment: apiDeck.xp_adjustment || undefined,
    spentXp: apiDeck.xp_spent || undefined,
    exile_string: apiDeck.exile_string || undefined,
    problem: find(DECK_PROBLEMS, problem => problem === apiDeck.problem),
  };

  if (apiDeck.previous_deck !== null && apiDeck.previous_deck !== undefined) {
    deck.previousDeckId = {
      id: undefined,
      arkhamdb_user: undefined,
      arkhambuild_user,
      arkhambuild_id: `${apiDeck.previous_deck}`,
      local: false,
      uuid: `${apiDeck.previous_deck}`,
    };
  }
  if (apiDeck.next_deck !== null && apiDeck.next_deck !== undefined) {
    deck.nextDeckId = {
      id: undefined,
      arkhamdb_user: undefined,
      arkhambuild_user,
      arkhambuild_id: `${apiDeck.next_deck}`,
      local: false,
      uuid: `${apiDeck.next_deck}`,
    };
  }

  return deck;
}

export interface ArkhamBuildDeckContent {
  name: string;
  investigator_code: string;
  slots: Slots;
  sideSlots?: Slots;
  ignoreDeckLimitSlots?: Slots;
  taboo_id?: number;
  meta?: DeckMeta;
  fan_made_content?: ArkhamBuildFanMadeContent;
  hidden_slots?: Slots;
  description_md?: string;
  tags?: string;
  problem?: DeckProblemType;
  xp?: number;
  xp_adjustment?: number;
  spentXp?: number;
  exile_string?: string;
}

interface ArkhamBuildDeckWrite {
  name: string;
  investigator_code: string;
  slots: Slots;
  sideSlots: Slots | null;
  ignoreDeckLimitSlots: Slots | null;
  taboo_id: number | null;
  meta: string;
  description_md: string;
  tags: string;
  problem: string | null;
  xp: number | null;
  xp_adjustment: number | null;
  xp_spent: number | null;
  exile_string: string | null;
}

function deckWriteBody(content: ArkhamBuildDeckContent): ArkhamBuildDeckWrite {
  const meta = {
    ...content.meta,
    ...(content.fan_made_content ? { fan_made_content: content.fan_made_content } : {}),
    ...(content.hidden_slots ? { hidden_slots: content.hidden_slots } : {}),
  };
  return {
    name: content.name,
    investigator_code: content.investigator_code,
    slots: content.slots,
    sideSlots: content.sideSlots && Object.keys(content.sideSlots).length ? content.sideSlots : null,
    ignoreDeckLimitSlots: content.ignoreDeckLimitSlots && Object.keys(content.ignoreDeckLimitSlots).length ? content.ignoreDeckLimitSlots : null,
    taboo_id: content.taboo_id || null,
    meta: JSON.stringify(meta),
    description_md: content.description_md || '',
    tags: content.tags || '',
    problem: content.problem || null,
    xp: content.xp ?? null,
    xp_adjustment: content.xp_adjustment ?? null,
    xp_spent: content.spentXp ?? null,
    exile_string: content.exile_string || null,
  };
}

interface DeckCodeFields {
  investigator_code: string;
  slots?: Slots;
  sideSlots?: Slots;
  ignoreDeckLimitSlots?: Slots;
  hidden_slots?: Slots;
  meta?: DeckMeta;
}

function deckCardCodes(deck: DeckCodeFields): string[] {
  return uniq([
    deck.investigator_code,
    ...keys(deck.slots),
    ...keys(deck.sideSlots),
    ...keys(deck.ignoreDeckLimitSlots),
    ...keys(deck.hidden_slots),
    ...metaCardCodes(deck.meta),
  ]);
}

function remapSlots(slots: Slots | undefined, codes: { [code: string]: string }): Slots | undefined {
  if (!slots) {
    return slots;
  }
  const result: Slots = {};
  forEach(slots, (count, code) => {
    result[codes[code] || code] = count;
  });
  return result;
}

function remapCodes<T extends DeckCodeFields>(deck: T, codes: { [code: string]: string }): T {
  const remap = (code: string | undefined) => code ? (codes[code] || code) : code;
  return {
    ...deck,
    investigator_code: remap(deck.investigator_code),
    slots: remapSlots(deck.slots, codes),
    sideSlots: remapSlots(deck.sideSlots, codes),
    ignoreDeckLimitSlots: remapSlots(deck.ignoreDeckLimitSlots, codes),
    hidden_slots: remapSlots(deck.hidden_slots, codes),
    meta: deck.meta ? remapMetaCodes(deck.meta, codes) : deck.meta,
  };
}

/**
 * Our own custom cards are known locally by their z-code, but arkham.build
 * identifies fan-made cards by uuid and needs their full definition in meta.
 */
async function exportCustomCards(content: ArkhamBuildDeckContent): Promise<ArkhamBuildDeckContent> {
  const db = getDatabase();
  if (!db) {
    return content;
  }
  const isExportable = (card: Card) => !!card.uuid && card.custom();
  const cards = filter(await db.getCardsByCodes(deckCardCodes(content)), isExportable);
  if (!cards.length) {
    return content;
  }
  // Required cards (e.g. a signature weakness) may not be in the deck yet, but
  // arkham.build still needs to resolve them from the investigator's requirements.
  const loaded = new Set(map(cards, card => card.code));
  const requiredCodes = filter(
    uniq(flatMap(cards, card => flatMap(card.deck_requirements?.card, req => [
      ...(req.code ? [req.code] : []),
      ...(req.alternates || []),
    ]))),
    code => !loaded.has(code)
  );
  if (requiredCodes.length) {
    cards.push(...filter(await db.getCardsByCodes(requiredCodes), isExportable));
  }
  const toUuid = fromPairs(flatMap(cards, card => card.uuid ? [[card.code, card.uuid]] : []));
  return {
    ...remapCodes(content, toUuid),
    fan_made_content: mergeFanMadeContent(content.fan_made_content, fanMadeContentFromCards(cards)),
  };
}

/**
 * Map any fan-made cards we already have locally back to their z-code, so the
 * deck matches our card database and only unknown content is upserted.
 */
async function importCustomCards(deck: ArkhamBuildDeck): Promise<ArkhamBuildDeck> {
  const content = deck.fan_made_content;
  const db = getDatabase();
  if (!content || !db) {
    return deck;
  }
  const cards = await db.getCardsByUuids(keys(content.cards));
  const toCode = fromPairs(flatMap(cards, card => card.uuid ? [[card.uuid, card.code]] : []));
  if (!keys(toCode).length) {
    return deck;
  }
  const remaining = omit(content.cards, keys(toCode));
  return {
    ...remapCodes(deck, toCode),
    fan_made_content: keys(remaining).length ? { ...content, cards: remaining } : undefined,
  };
}

async function errorFromResponse(response: Response, action: string): Promise<Error> {
  const errorBody: { message?: string } = await response.json().catch(() => ({}));
  return new Error(errorBody.message || `${action} failed: ${response.status}`);
}

export async function createDeck(
  arkhambuild_user: string,
  content: ArkhamBuildDeckContent
): Promise<ArkhamBuildDeck> {
  const response = await authenticatedFetch('/v2/user/decks/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deckWriteBody(await exportCustomCards(content))),
  });
  if (response.status !== 201) {
    throw await errorFromResponse(response, 'Create deck');
  }
  const apiDeck: ArkhamBuildApiDeck = await response.json();
  return await importCustomCards(cleanDeck(apiDeck, arkhambuild_user));
}

export async function updateDeck(
  arkhambuild_user: string,
  arkhambuild_id: string,
  content: ArkhamBuildDeckContent
): Promise<ArkhamBuildDeck> {
  const response = await authenticatedFetch(`/v2/user/decks/account/${encodeURIComponent(arkhambuild_id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deckWriteBody(await exportCustomCards(content))),
  });
  if (response.status !== 200) {
    throw await errorFromResponse(response, 'Update deck');
  }
  const apiDeck: ArkhamBuildApiDeck = await response.json();
  return await importCustomCards(cleanDeck(apiDeck, arkhambuild_user));
}

/**
 * Creates the next deck in the history. The content describes the child deck,
 * including its total XP; the server links it to the parent.
 */
export async function upgradeDeck(
  arkhambuild_user: string,
  arkhambuild_id: string,
  content: ArkhamBuildDeckContent
): Promise<ArkhamBuildDeck> {
  const response = await authenticatedFetch(`/v2/user/decks/account/${encodeURIComponent(arkhambuild_id)}/upgrade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deckWriteBody(await exportCustomCards(content))),
  });
  if (response.status !== 201) {
    throw await errorFromResponse(response, 'Upgrade deck');
  }
  const apiDeck: ArkhamBuildApiDeck = await response.json();
  return await importCustomCards(cleanDeck(apiDeck, arkhambuild_user));
}

export async function deleteDeck(
  arkhambuild_id: string,
  deleteAllVersions: boolean
): Promise<void> {
  const response = await authenticatedFetch(
    `/v2/user/decks/account/${encodeURIComponent(arkhambuild_id)}${deleteAllVersions ? '?all=true' : ''}`,
    { method: 'DELETE' }
  );
  // Already gone is fine.
  if (response.status !== 204 && response.status !== 404) {
    throw await errorFromResponse(response, 'Delete deck');
  }
}

export interface ArkhamBuildDecksResponse {
  decks: ArkhamBuildDeck[];
}

export async function fetchDecks(arkhambuild_user: string): Promise<ArkhamBuildDecksResponse> {
  // Step 1: Get manifest (account decks only, since ArkhamDB decks are synced separately)
  const manifestResponse = await authenticatedFetch('/v2/user/decks/manifest?source=account');
  if (manifestResponse.status !== 200) {
    throw new Error(`Manifest failed: ${manifestResponse.status}`);
  }
  const manifest: ManifestResponse = await manifestResponse.json();

  if (manifest.decks.length === 0) {
    return { decks: [] };
  }

  // Step 2: Batch fetch full deck objects
  const targets = manifest.decks.map(d => ({ source: d.source, id: d.id }));

  // Batch in chunks of 250 (API limit)
  const allDecks: ArkhamBuildDeck[] = [];
  for (let i = 0; i < targets.length; i += 250) {
    const chunk = targets.slice(i, i + 250);
    const batchResponse = await authenticatedFetch('/v2/user/decks/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        arkhamdbSyncToken: null,
        decks: chunk,
      }),
    });
    if (batchResponse.status !== 200) {
      throw new Error(`Batch failed: ${batchResponse.status}`);
    }
    const batch: { decks: ArkhamBuildApiDeck[] } = await batchResponse.json();
    const cleaned = flatMap(batch.decks, apiDeck => {
      if (apiDeck && apiDeck.id && apiDeck.name && apiDeck.slots) {
        return [cleanDeck(apiDeck, arkhambuild_user)];
      }
      return [];
    });
    allDecks.push(...await Promise.all(map(cleaned, importCustomCards)));
  }

  return { decks: allDecks };
}

export default {
  getProfile,
  fetchDecks,
  createDeck,
  updateDeck,
  upgradeDeck,
  deleteDeck,
};
