import { filter, flatMap, forEach, map, trim } from 'lodash';

import { getAccessToken } from './arkhamBuildAuth';
import { ArkhamBuildDeck, DeckMeta, Slots } from '@actions/types';

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

function cleanDeck(apiDeck: ArkhamBuildApiDeck, arkhambuild_user: string): ArkhamBuildDeck {
  let meta: DeckMeta | undefined;
  if (apiDeck.meta && typeof apiDeck.meta === 'string') {
    try {
      meta = JSON.parse(apiDeck.meta);
    } catch (e) {
      meta = {};
    }
  }

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
    problem: apiDeck.problem as any,
  };

  if (apiDeck.previous_deck != null) {
    deck.previousDeckId = {
      id: undefined,
      arkhamdb_user: undefined,
      arkhambuild_user,
      arkhambuild_id: `${apiDeck.previous_deck}`,
      local: false,
      uuid: `${apiDeck.previous_deck}`,
    };
  }
  if (apiDeck.next_deck != null) {
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

export async function createDeck(
  arkhambuild_user: string,
  investigatorCode: string,
  name: string,
  slots: Slots,
  ignoreDeckLimitSlots?: Slots,
  tabooSetId?: number,
  meta?: DeckMeta,
  description?: string,
  tags?: string
): Promise<ArkhamBuildDeck> {
  const body: Record<string, any> = {
    name,
    investigator_code: investigatorCode,
    slots,
    meta: meta ? JSON.stringify(meta) : '{}',
    description_md: description || '',
    tags: tags || '',
  };
  if (ignoreDeckLimitSlots && Object.keys(ignoreDeckLimitSlots).length > 0) {
    body.ignoreDeckLimitSlots = ignoreDeckLimitSlots;
  }
  if (tabooSetId) {
    body.taboo_id = tabooSetId;
  }
  const response = await authenticatedFetch('/v2/user/decks/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (response.status !== 201) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Create deck failed: ${response.status}`);
  }
  const apiDeck: ArkhamBuildApiDeck = await response.json();
  return cleanDeck(apiDeck, arkhambuild_user);
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
    const batchDecks: ArkhamBuildApiDeck[] = await batchResponse.json();
    const cleaned = flatMap(batchDecks, apiDeck => {
      if (apiDeck && apiDeck.id && apiDeck.name && apiDeck.slots) {
        return [cleanDeck(apiDeck, arkhambuild_user)];
      }
      return [];
    });
    allDecks.push(...cleaned);
  }

  return { decks: allDecks };
}

export default {
  getProfile,
  fetchDecks,
};
