import { forEach, omit, find } from 'lodash';
import uuid from 'react-native-uuid';

import {
  ARKHAMDB_LOGOUT,
  RESTORE_BACKUP,
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
  ArkhamDbApiDeck,
  getDeckId,
  DeckId,
} from '@actions/types';
import deepDiff from 'deep-diff';

interface DecksState {
  all: DecksMap;
  replacedLocalIds?: {
    [uuid: string]: DeckId;
  };
  dateUpdated: number | null;
  refreshing: boolean;
  error: string | null;
  lastModified?: string;
}

const DEFAULT_DECK_STATE: DecksState = {
  all: {},
  replacedLocalIds: {},
  dateUpdated: null,
  refreshing: false,
  error: null,
  lastModified: undefined,
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
  if (action.type === RESTORE_COMPLEX_BACKUP) {
    const all: DecksMap = { ...state.all };
    forEach(action.decks, deck => {
      const remappedDeck: Deck = { ...omit(deck, ['previous_deck', 'next_deck']) as Deck };
      if (action.deckRemapping[deck.id]) {
        remappedDeck.id = action.deckRemapping[deck.id];
      }
      const legacyDeck = deck as ArkhamDbApiDeck;
      if (legacyDeck.previous_deck) {
        if (action.deckRemapping[legacyDeck.previous_deck]) {
          const previousId = action.deckRemapping[legacyDeck.previous_deck];
          const previousUuid = find(action.decks, deck => deck.id === previousId)?.uuid;
          if (previousUuid) {
            remappedDeck.previousDeckId = {
              id: previousId,
              local: true,
              uuid: previousUuid,
            };
          }
        } else if (legacyDeck.previous_deck > 0) {
          remappedDeck.previousDeckId = {
            id: legacyDeck.previous_deck,
            local: false,
            uuid: `${legacyDeck.previous_deck}`,
          };
        }
      } else if (deck.previousDeckId && deck.previousDeckId.local && action.deckRemapping[deck.previousDeckId.id]) {
        deck.previousDeckId.id = action.deckRemapping[deck.previousDeckId.id];
      }

      if (legacyDeck.next_deck) {
        if (action.deckRemapping[legacyDeck.next_deck]) {
          const nextId = action.deckRemapping[legacyDeck.next_deck];
          const nextUuid = find(action.decks, deck => deck.id === nextId)?.uuid;
          if (nextUuid) {
            remappedDeck.nextDeckId = {
              id: nextId,
              local: true,
              uuid: nextUuid,
            };
          }
        } else if (legacyDeck.next_deck > 0) {
          remappedDeck.nextDeckId = {
            id: legacyDeck.next_deck,
            local: false,
            uuid: `${legacyDeck.next_deck}`,
          };
        }
      } else if (deck.nextDeckId && deck.nextDeckId.local && action.deckRemapping[deck.nextDeckId.id]) {
        deck.nextDeckId.id = action.deckRemapping[deck.nextDeckId.id];
      }
      all[getDeckId(remappedDeck).uuid] = remappedDeck;
    });
    return {
      ...state,
      all,
      replacedLocalIds: {},
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
  if (action.type === ARKHAMDB_LOGOUT || action.type === CLEAR_DECKS) {
    const all: DecksMap = {};
    forEach(state.all, (deck, id: string) => {
      if (deck && deck.local) {
        all[id] = deck;
      }
    });
    return {
      ...DEFAULT_DECK_STATE,
      all,
    };
  }
  if (action.type === RESTORE_BACKUP) {
    const all: DecksMap = {};
    forEach(state.all, (deck, id: string) => {
      if (deck && !deck.local) {
        all[id] = deck;
      }
    });
    forEach(action.decks, deck => {
      if (deck) {
        all[getDeckId(deck).uuid] = deck;
      }
    });
    return {
      ...DEFAULT_DECK_STATE,
      all,
      replacedLocalIds: {},
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
    forEach(action.decks, deck => {
      all[getDeckId(deck).uuid] = deck;
    });
    forEach(action.decks, deck => {
      let scenarioCount = 0;
      let currentDeck = deck;
      while (currentDeck && currentDeck.previousDeckId) {
        scenarioCount ++;
        currentDeck = all[currentDeck.previousDeckId.uuid];
      }
      deck.scenarioCount = scenarioCount;
    });
    return {
      ...state,
      all,
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
    const diff = deepDiff(state.all[action.deck.id] || {}, deck);
    if (!diff || !diff.length) {
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
