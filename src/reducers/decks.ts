import { forEach, omit } from 'lodash';
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
    const diff = deepDiff(state.all[action.id.uuid] || {}, deck);
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
