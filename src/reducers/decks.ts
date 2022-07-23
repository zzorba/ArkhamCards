import { filter, find, forEach, keys, flatMap, head, omit, uniq, mapValues } from 'lodash';
import uuid from 'react-native-uuid';

import {
  ARKHAMDB_LOGOUT,
  MY_DECKS_START_REFRESH,
  MY_DECKS_CACHE_HIT,
  MY_DECKS_ERROR,
  SET_MY_DECKS,
  NEW_DECK_AVAILABLE,
  DELETE_DECK,
  UPDATE_DECK,
  CLEAR_DECKS,
  REPLACE_LOCAL_DECK,
  ENSURE_UUID,
  RESTORE_COMPLEX_BACKUP,
  DecksActions,
  NewDeckAvailableAction,
  ReplaceLocalDeckAction,
  UpdateDeckAction,
  Deck,
  DecksMap,
  getDeckId,
  DeckId,
  REDUX_MIGRATION,
  UPLOAD_DECK,
  SET_UPLOADED_DECKS,
  REMOVE_UPLOAD_DECK,
  UploadedDeck,
  GroupedUploadedDecks,
  DraftState,
  SET_CURRENT_DRAFT,
  CLEAR_CURRENT_DRAFT,
  SET_CURRENT_DRAFT_SIZE,
  UPDATE_DECK_EDIT,
  SET_PACK_DRAFT,
  SYNC_IN_COLLECTION,
} from '@actions/types';
import deepEqual from 'deep-equal';

interface DecksState {
  all: DecksMap;
  syncedDecks?: GroupedUploadedDecks;
  replacedLocalIds?: {
    [uuid: string]: DeckId;
  };
  arkhamDbUser: number | undefined;
  dateUpdated: number | null;
  refreshing: boolean;
  error: string | null;
  lastModified?: string;
  draft?: {
    [uuid: string]: DraftState | undefined;
  };
}

const DEFAULT_DECK_STATE: DecksState = {
  all: {},
  replacedLocalIds: {},
  arkhamDbUser: undefined,
  dateUpdated: null,
  refreshing: false,
  error: null,
  lastModified: undefined,
  draft: {},
};

export function updateDeck(
  state: DecksState,
  action: NewDeckAvailableAction | UpdateDeckAction | ReplaceLocalDeckAction
): Deck {
  const deck = { ...action.deck };
  let scenarioCount = 0;
  let currentDeck = deck;
  while (currentDeck && currentDeck.previousDeckId) {
    scenarioCount ++;
    currentDeck = state.all[currentDeck.previousDeckId.uuid];
  }
  deck.scenarioCount = scenarioCount;
  return deck;
}

export default function(
  state = DEFAULT_DECK_STATE,
  action: DecksActions
): DecksState {
  if (action.type === UPDATE_DECK_EDIT) {
    // If the meta changes for this deck, we need to reset
    // the current 'draft' hand.
    if (action.updates.meta !== undefined) {
      return {
        ...state,
        draft: {
          ...(state.draft || {}),
          [action.id.uuid]: {
            ...(state.draft?.[action.id.uuid] || {}),
            current: undefined,
          },
        },
      };
    }
    return state;
  }
  if (action.type === SET_PACK_DRAFT || action.type === SYNC_IN_COLLECTION) {
    // We drop all cards when the pack changes
    const newDraft = mapValues(state.draft || {}, (draft => {
      if (draft) {
        return {
          size: draft.size,
        };
      }
      return undefined;
    }));
    return {
      ...state,
      draft: newDraft,
    };
  }
  if (action.type === SET_CURRENT_DRAFT) {
    return {
      ...state,
      draft: {
        ...(state.draft || {}),
        [action.id.uuid]: {
          ...(state.draft?.[action.id.uuid] || {}),
          current: action.current,
        },
      },
    };
  }
  if (action.type === CLEAR_CURRENT_DRAFT) {
    return {
      ...state,
      draft: {
        ...(state.draft || {}),
        [action.id.uuid]: {
          ...(state.draft?.[action.id.uuid] || {}),
          current: undefined,
        },
      },
    };
  }
  if (action.type === SET_CURRENT_DRAFT_SIZE) {
    return {
      ...state,
      draft: {
        ...(state.draft || {}),
        [action.id.uuid]: {
          ...(state.draft?.[action.id.uuid] || {}),
          size: action.size,
        },
      },
    };
  }
  if (action.type === RESTORE_COMPLEX_BACKUP) {
    const all: DecksMap = { ...state.all };
    forEach(action.decks, deck => {
      all[getDeckId(deck).uuid] = deck;
    });
    return {
      ...state,
      all,
      replacedLocalIds: {},
    };
  }
  if (action.type === REDUX_MIGRATION) {
    const all: DecksMap = { ...state.all };
    forEach(action.decks, deck => {
      all[getDeckId(deck).uuid] = deck;
    });
    return {
      ...DEFAULT_DECK_STATE,
      all,
    };
  }
  if (action.type === ENSURE_UUID) {
    const all: DecksMap = {};
    forEach(state.all, (deck, id: any) => {
      if (!deck || !deck.local || deck.uuid) {
        all[id] = deck;
      } else {
        all[id] = {
          ...deck,
          uuid: uuid.v4(),
        };
      }
    });
    return {
      ...state,
      all,
    };
  }
  if (action.type === SET_UPLOADED_DECKS) {
    return {
      ...state,
      syncedDecks: action.uploadedDecks,
    };
  }
  if (action.type === UPLOAD_DECK) {
    const syncedDecks = state.syncedDecks || {};
    const newUploadedDeck: UploadedDeck = {
      deckId: action.deckId,
      hash: action.hash,
      nextDeckId: action.nextDeckId,
      campaignId: uniq([
        ...(syncedDecks[action.deckId.uuid]?.campaignId || []),
        action.campaignId,
      ]),
    };

    return {
      ...state,
      syncedDecks: {
        ...syncedDecks,
        [action.deckId.uuid]: newUploadedDeck,
      },
    };
  }
  if (action.type === REMOVE_UPLOAD_DECK) {
    const syncedDecks: { [key: string]: UploadedDeck | undefined } = {
      ...(state.syncedDecks || {}),
    };
    const existingUploadedDeck = syncedDecks[action.deckId.uuid];
    const uploadedDeck = existingUploadedDeck && find(existingUploadedDeck.campaignId, id => id.serverId !== action.campaignId.serverId) ? {
      deckId: existingUploadedDeck.deckId,
      hash: existingUploadedDeck.hash,
      nextDeckId: existingUploadedDeck.nextDeckId,
      campaignId: filter(existingUploadedDeck.campaignId, campaignId => campaignId.serverId !== action.campaignId.serverId),
    } : undefined;
    if (uploadedDeck) {
      syncedDecks[action.deckId.uuid] = uploadedDeck;
    } else {
      delete syncedDecks[action.deckId.uuid];
    }
    return {
      ...state,
      syncedDecks,
    };
  }
  if (action.type === ARKHAMDB_LOGOUT || action.type === CLEAR_DECKS) {
    const all: DecksMap = {};
    forEach(state.all, (deck, id: string) => {
      if (deck && deck.local) {
        all[id] = deck;
      }
    });
    return {
      ...DEFAULT_DECK_STATE,
      arkhamDbUser: action.type === ARKHAMDB_LOGOUT ? undefined : state.arkhamDbUser,
      all,
    };
  }
  if (action.type === MY_DECKS_START_REFRESH) {
    return {
      ...state,
      refreshing: true,
      error: null,
    };
  }
  if (action.type === MY_DECKS_CACHE_HIT) {
    return {
      ...state,
      refreshing: false,
      dateUpdated: action.timestamp.getTime(),
      error: null,
    };
  }
  if (action.type === MY_DECKS_ERROR) {
    return {
      ...state,
      refreshing: false,
      error: action.error,
      lastModified: undefined,
    };
  }
  if (action.type === SET_MY_DECKS) {
    const all: DecksMap = { ...state.all };
    const remoteDecks: { [uuid: string]: boolean | undefined } = {};
    forEach(state.all, deck => {
      if (deck) {
        const deckId = getDeckId(deck);
        if (!deckId.local) {
          remoteDecks[deckId.uuid] = true;
        }
      }
    });
    const arkhamDbUser = head(flatMap(action.decks, d => d.user_id ? [d.user_id] : []));
    forEach(action.decks, deck => {
      const deckId = getDeckId(deck);
      all[deckId.uuid] = deck;
      if (remoteDecks[deckId.uuid]) {
        delete remoteDecks[deckId.uuid];
      }
    });
    // Remove decks that are now missing.
    forEach(keys(remoteDecks), uuid => {
      if (all[uuid]) {
        delete all[uuid];
      }
    });
    forEach(action.decks, deck => {
      let scenarioCount = 0;
      let currentDeck: Deck = deck;
      while (currentDeck && currentDeck.previousDeckId) {
        scenarioCount ++;
        currentDeck = all[currentDeck.previousDeckId.uuid];
      }
      deck.scenarioCount = scenarioCount;
    });
    return {
      ...state,
      all,
      arkhamDbUser,
      dateUpdated: action.timestamp.getTime(),
      lastModified: action.lastModified,
      refreshing: false,
      error: null,
    };
  }
  if (action.type === REPLACE_LOCAL_DECK) {
    const deck = updateDeck(state, action);
    const all = {
      ...state.all,
      [getDeckId(deck).uuid]: deck,
    };
    delete all[action.localId.uuid];
    const replacedLocalIds = {
      ...(state.replacedLocalIds || {}),
      [action.localId.uuid]: getDeckId(deck),
    };
    return {
      ...state,
      all,
      replacedLocalIds,
    };
  }
  if (action.type === DELETE_DECK) {
    const all = { ...state.all };
    let deck = all[action.id.uuid];
    const toDelete = [action.id.uuid];
    if (deck) {
      if (action.deleteAllVersions) {
        while (deck.previousDeckId && all[deck.previousDeckId.uuid]) {
          const uuid = deck.previousDeckId.uuid;
          toDelete.push(uuid);
          deck = all[uuid];
          delete all[uuid];
        }
      } else {
        if (deck.previousDeckId && all[deck.previousDeckId.uuid]) {
          all[deck.previousDeckId.uuid] = omit(all[deck.previousDeckId.uuid], ['nextDeckId']) as Deck;
        }
      }
    }
    delete all[action.id.uuid];
    return {
      ...state,
      all,
      // There's a bug on ArkhamDB cache around deletes,
      // so drop lastModified when we detect a delete locally.
      lastModified: undefined,
    };
  }
  if (action.type === UPDATE_DECK) {
    const deck = updateDeck(state, action);
    if (deepEqual(state.all[action.id.uuid] || {}, deck)) {
      return state;
    }

    if (!deck) {
      return state;
    }

    return {
      ...state,
      all: {
        ...state.all,
        [action.id.uuid]: deck,
      },
    };
  }
  if (action.type === NEW_DECK_AVAILABLE) {
    const deck = updateDeck(state, action);
    return {
      ...state,
      all: {
        ...state.all,
        [action.id.uuid]: deck,
      },
    };
  }
  return state;
}
