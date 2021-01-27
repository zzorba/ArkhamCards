import { forEach, range } from 'lodash';
import Config from 'react-native-config';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';

import { newLocalDeck, updateLocalDeck, upgradeLocalDeck } from './localHelper';
import { handleAuthErrors } from './authHelper';
import {
  NEW_DECK_AVAILABLE,
  UPDATE_DECK,
  DELETE_DECK,
  REPLACE_LOCAL_DECK,
  RESET_DECK_CHECKLIST,
  SET_DECK_CHECKLIST_CARD,
  ReplaceLocalDeckAction,
  NewDeckAvailableAction,
  UpdateDeckAction,
  DeleteDeckAction,
  Deck,
  DeckMeta,
  DeckProblemType,
  Slots,
  ResetDeckChecklistAction,
  SetDeckChecklistCardAction,
  UpdateDeckEditCountsAction,
  UPDATE_DECK_EDIT_COUNTS,
  UpdateDeckEditAction,
  UPDATE_DECK_EDIT,
  EditDeckState,
  StartDeckEditAction,
  START_DECK_EDIT,
  FinishDeckEditAction,
  FINISH_DECK_EDIT,
  DeckId,
  getDeckId,
  ArkhamDbDeck,
  ArkhamDbDeckId,
} from '@actions/types';
import { login } from '@actions';
import { saveDeck, loadDeck, upgradeDeck, newCustomDeck, UpgradeDeckResult, deleteDeck } from '@lib/authApi';
import { AppState, makeDeckSelector } from '@reducers/index';

function setNewDeck(
  id: DeckId,
  deck: Deck
): NewDeckAvailableAction {
  return {
    type: NEW_DECK_AVAILABLE,
    id,
    deck,
  };
}

function updateDeck(
  id: DeckId,
  deck: Deck,
  isWrite: boolean
): UpdateDeckAction {
  return {
    type: UPDATE_DECK,
    id,
    deck,
    isWrite,
  };
}

export function resetDeckChecklist(
  id: DeckId
): ResetDeckChecklistAction {
  return {
    type: RESET_DECK_CHECKLIST,
    id,
  };
}

export function setDeckChecklistCard(
  id: DeckId,
  card: string,
  value: boolean
): SetDeckChecklistCardAction {
  return {
    type: SET_DECK_CHECKLIST_CARD,
    id,
    card,
    value,
  };
}

export function removeDeck(
  id: DeckId,
  deleteAllVersions?: boolean
): DeleteDeckAction {
  return {
    type: DELETE_DECK,
    id,
    deleteAllVersions: !!deleteAllVersions,
  };
}

export function replaceLocalDeck(
  localId: DeckId,
  deck: ArkhamDbDeck
): ReplaceLocalDeckAction {
  return {
    type: REPLACE_LOCAL_DECK,
    localId,
    deck,
  };
}

export function fetchPrivateDeck(
  id: ArkhamDbDeckId
): ThunkAction<void, AppState, null, Action<string>> {
  return (dispatch) => {
    loadDeck(id.id).then(deck => {
      dispatch(updateDeck(id, deck, false));
    }).catch(err => {
      if (err.message === 'Not Found') {
        dispatch(removeDeck(id));
      }
    });
  };
}

export function fetchPublicDeck(
  id: ArkhamDbDeckId,
  useDeckEndpoint: boolean
): ThunkAction<void, AppState, null, Action<string>> {
  return (dispatch) => {
    const uri = `${Config.OAUTH_SITE}api/public/${useDeckEndpoint ? 'deck' : 'decklist'}/${id.id}`;
    fetch(uri, { method: 'GET' })
      .then(response => {
        if (response.ok === true) {
          return response.json();
        }
        throw new Error(`Unexpected status: ${response.status}`);
      })
      .then(json => {
        dispatch(updateDeck(id, json, false));
      }).catch((err: Error) => {
        if (!useDeckEndpoint) {
          return dispatch(fetchPublicDeck(id, true));
        }
        console.log(err);
      });
  };
}

function handleUpgradeDeckResult(
  result: UpgradeDeckResult,
  dispatch: ThunkDispatch<AppState, unknown, Action>
) {
  dispatch(updateDeck(getDeckId(result.deck), result.deck, false));
  dispatch(setNewDeck(getDeckId(result.upgradedDeck), result.upgradedDeck));
}

export const deleteDeckAction: ActionCreator<
  ThunkAction<Promise<boolean>, AppState, unknown, Action>
> = (id: ArkhamDbDeckId, deleteAllVersion: boolean, local: boolean) => {
  return (
    dispatch: ThunkDispatch<AppState, unknown, Action>,
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      if (local) {
        dispatch(removeDeck(id, deleteAllVersion));
        resolve(true);
      } else {
        const deleteDeckPromise = deleteDeck(id.id, deleteAllVersion);
        handleAuthErrors(
          deleteDeckPromise,
          () => {
            dispatch(removeDeck(id, deleteAllVersion));
            resolve(true);
          },
          reject,
          () => null,
          () => {
            dispatch(login());
          }
        );
      }
    });
  };
};

export const saveDeckUpgrade: ActionCreator<
  ThunkAction<Promise<Deck>, AppState, unknown, Action>
> = (
  deck: Deck,
  xp: number,
  exileCounts: Slots,
) => {
  return (dispatch: ThunkDispatch<AppState, unknown, Action>) => {
    return new Promise<Deck>((resolve, reject) => {
      const exileParts: string[] = [];
      forEach(exileCounts, (count, code) => {
        if (count > 0) {
          forEach(range(0, count), () => exileParts.push(code));
        }
      });
      if (deck.local) {
        const result = upgradeLocalDeck(deck, xp, exileParts);
        handleUpgradeDeckResult(result, dispatch);
        resolve(result.upgradedDeck);
      } else {
        const exiles = exileParts.join(',');
        const upgradeDeckPromise = upgradeDeck(deck.id, xp, exiles);
        handleAuthErrors(
          upgradeDeckPromise,
          result => {
            handleUpgradeDeckResult(result, dispatch);
            setTimeout(() => {
              resolve(result.upgradedDeck);
            }, 1000);
          },
          reject,
          // retry
          () => {
            dispatch(saveDeckUpgrade(deck, xp, exileCounts))
              .then(deck => resolve(deck));
          },
          () => {
            dispatch(login());
          }
        );
      }
    });
  };
};

export interface SaveDeckChanges {
  name?: string;
  description?: string;
  slots?: Slots;
  ignoreDeckLimitSlots?: Slots;
  problem?: string;
  spentXp?: number;
  xpAdjustment?: number;
  tabooSetId?: number;
  meta?: DeckMeta;
}

export const saveDeckChanges: ActionCreator<
  ThunkAction<Promise<Deck>, AppState, unknown, Action>
> = (
  deck: Deck,
  changes: SaveDeckChanges
) => {
  return (dispatch: ThunkDispatch<AppState, unknown, Action>): Promise<Deck> => {
    return new Promise((resolve, reject) => {
      if (deck.local) {
        const newDeck = updateLocalDeck(
          deck,
          changes.name || deck.name,
          changes.slots || deck.slots || {},
          changes.ignoreDeckLimitSlots || deck.ignoreDeckLimitSlots || {},
          ((changes.problem !== undefined && changes.problem !== null) ? changes.problem : (deck.problem || '')) as DeckProblemType,
          (changes.spentXp !== undefined && changes.spentXp !== null) ? changes.spentXp : (deck.spentXp || 0),
          (changes.xpAdjustment !== undefined && changes.xpAdjustment !== null) ? changes.xpAdjustment : (deck.xp_adjustment || 0),
          changes.tabooSetId !== undefined ? changes.tabooSetId : deck.taboo_id,
          (changes.meta !== undefined && changes.meta !== null) ? changes.meta : deck.meta,
          (changes.description !== undefined && changes.description !== null) ? changes.description : deck.description_md
        );
        dispatch(updateDeck(getDeckId(newDeck), newDeck, true));
        setTimeout(() => {
          resolve(newDeck);
        }, 1000);
      } else {
        const savePromise = saveDeck(
          deck.id,
          changes.name || deck.name,
          changes.slots || deck.slots || {},
          changes.ignoreDeckLimitSlots || deck.ignoreDeckLimitSlots || {},
          (changes.problem !== undefined && changes.problem !== null) ? changes.problem : (deck.problem || ''),
          (changes.spentXp !== undefined && changes.spentXp !== null) ? changes.spentXp : (deck.spentXp || 0),
          (changes.xpAdjustment !== undefined && changes.xpAdjustment !== null) ? changes.xpAdjustment : (deck.xp_adjustment || 0),
          changes.tabooSetId !== undefined ? changes.tabooSetId : deck.taboo_id,
          (changes.meta !== undefined && changes.meta !== null) ? changes.meta : deck.meta,
          (changes.description !== undefined && changes.description !== null) ? changes.description : deck.description_md
        );
        handleAuthErrors<Deck>(
          savePromise,
          // onSuccess
          (deck: Deck) => {
            dispatch(updateDeck(getDeckId(deck), deck, true));
            resolve(deck);
          },
          reject,
          () => {
            dispatch(saveDeckChanges(deck, changes))
              .then(deck => resolve(deck));
          },
          // login
          () => {
            dispatch(login());
          }
        );
      }
    });
  };
};

export interface NewDeckParams {
  local: boolean;
  deckName: string;
  investigatorCode: string;
  slots: Slots;
  ignoreDeckLimitSlots?: Slots;
  tabooSetId?: number;
  meta?: DeckMeta;
  problem?: DeckProblemType;
  description?: string;
}
export const saveNewDeck: ActionCreator<
  ThunkAction<Promise<Deck>, AppState, unknown, Action>
> = (
  params: NewDeckParams
) => {
  return (dispatch: ThunkDispatch<AppState, unknown, Action>): Promise<Deck> => {
    return new Promise<Deck>((resolve, reject) => {
      if (params.local) {
        const deck = newLocalDeck(
          params.deckName,
          params.investigatorCode,
          params.slots,
          params.tabooSetId,
          params.meta,
          params.problem,
          params.description
        );
        dispatch(setNewDeck(getDeckId(deck), deck));
        setTimeout(() => {
          resolve(deck);
        }, 1000);
      } else {
        const newDeckPromise = newCustomDeck(
          params.investigatorCode,
          params.deckName,
          params.slots,
          params.ignoreDeckLimitSlots || {},
          params.problem,
          params.tabooSetId,
          params.meta,
          params.description
        );
        handleAuthErrors<Deck>(
          newDeckPromise,
          // onSuccess
          (deck: Deck) => {
            dispatch(setNewDeck(getDeckId(deck), deck));
            resolve(deck);
          },
          reject,
          () => {
            dispatch(saveNewDeck(params)).then(deck => resolve(deck));
          },
          // login
          () => {
            dispatch(login());
          }
        );
      }
    });
  };
};

export const saveClonedDeck: ActionCreator<
  ThunkAction<Promise<Deck>, AppState, unknown, Action>
> = (
  local: boolean,
  cloneDeck: Deck,
  deckName: string
) => {
  return (dispatch: ThunkDispatch<AppState, unknown, Action>): Promise<Deck> => {
    return new Promise<Deck>((resolve, reject) => {
      dispatch(saveNewDeck({
        local,
        deckName,
        investigatorCode: cloneDeck.investigator_code,
        slots: cloneDeck.slots,
        ignoreDeckLimitSlots: cloneDeck.ignoreDeckLimitSlots,
        tabooSetId: cloneDeck.taboo_id,
        meta: cloneDeck.meta,
        problem: cloneDeck.problem,
        description: cloneDeck.description_md,
      })).then(deck => {
        setTimeout(() => {
          dispatch(saveDeckChanges(
            deck,
            {
              slots: cloneDeck.slots,
              ignoreDeckLimitSlots: cloneDeck.ignoreDeckLimitSlots,
              problem: cloneDeck.problem,
              spentXp: 0,
              xpAdjustment: 0,
              tabooSetId: cloneDeck.taboo_id,
              description: cloneDeck.description_md,
            }
          )).then(resolve, reject);
        },
        // Slow it down to avoid ADB race conditions
        1000);
      }, reject);
    });
  };
};

export const uploadLocalDeck: ActionCreator<
  ThunkAction<Promise<Deck>, AppState, unknown, Action>
> = (
  localDeck: Deck
) => {
  return (dispatch: ThunkDispatch<AppState, unknown, Action>): Promise<Deck> => {
    return dispatch(saveClonedDeck(
      false,
      localDeck,
      localDeck.name
    )).then(deck => {
      dispatch(replaceLocalDeck(getDeckId(localDeck), deck as ArkhamDbDeck));
      return deck;
    });
  };
};


export function incIgnoreDeckSlot(id: DeckId, code: string, limit?: number): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'inc',
    limit,
    countType: 'ignoreDeckLimitSlots',
  };
}

export function decIgnoreDeckSlot(id: DeckId, code: string): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'dec',
    countType: 'ignoreDeckLimitSlots',
  };
}

export function setIgnoreDeckSlot(id: DeckId, code: string, value: number): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    value,
    operation: 'set',
    countType: 'ignoreDeckLimitSlots',
  };
}

export function incDeckSlot(id: DeckId, code: string, limit?: number): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'inc',
    limit,
    countType: 'slots',
  };
}

export function decDeckSlot(id: DeckId, code: string): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'dec',
    countType: 'slots',
  };
}

export function setDeckSlot(id: DeckId, code: string, value: number): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'set',
    value,
    countType: 'slots',
  };
}

export function setDeckTabooSet(id: DeckId, tabooSetId: number): UpdateDeckEditAction {
  return {
    type: UPDATE_DECK_EDIT,
    id,
    updates: {
      tabooSetChange: tabooSetId,
    },
  };
}


export function setDeckDescription(id: DeckId, description: string): UpdateDeckEditAction {
  return {
    type: UPDATE_DECK_EDIT,
    id,
    updates: {
      descriptionChange: description,
    },
  };
}

export function setDeckXpAdjustment(id: DeckId, xpAdjustment: number): UpdateDeckEditAction {
  return {
    type: UPDATE_DECK_EDIT,
    id,
    updates: {
      xpAdjustment,
    },
  };
}

export function updateDeckMeta(
  id: DeckId,
  investigator_code: string,
  deckEdits: EditDeckState,
  updates: {
    key: keyof DeckMeta;
    value?: string;
  }[]
): ThunkAction<void, AppState, unknown, Action> {
  return (dispatch: ThunkDispatch<AppState, unknown, UpdateDeckEditAction | UpdateDeckEditCountsAction>): void => {
    const updatedMeta: DeckMeta = { ...deckEdits.meta };
    forEach(updates, update => {
      if (update.value === undefined) {
        delete updatedMeta[update.key];
      } else {
        updatedMeta[update.key] = update.value as any;
        if (investigator_code === '06002' && update.key === 'deck_size_selected') {
          dispatch(setDeckSlot(id, '06008', (parseInt(update.value, 10) - 20) / 10));
        }
      }
    });

    dispatch({
      type: UPDATE_DECK_EDIT,
      id,
      updates: {
        meta: updatedMeta,
      },
    });
  };
}

export function startDeckEdit(id: DeckId, initialMode?: 'upgrade' | 'edit'): ThunkAction<void, AppState, unknown, Action> {
  return (dispatch: ThunkDispatch<AppState, unknown, StartDeckEditAction>, getState: () => AppState): void => {
    const deck = makeDeckSelector()(getState(), id);
    if (deck) {
      dispatch({
        type: START_DECK_EDIT,
        id,
        deck,
        mode: initialMode,
      });
    }
  };
}

export function finishDeckEdit(id: DeckId): FinishDeckEditAction {
  return {
    type: FINISH_DECK_EDIT,
    id,
  };
}


export default {
  fetchPrivateDeck,
  fetchPublicDeck,
  replaceLocalDeck,
  removeDeck,
  saveDeckChanges,
  saveDeckUpgrade,
  saveNewDeck,
  saveClonedDeck,
  uploadLocalDeck,
  resetDeckChecklist,
  setDeckChecklistCard,
};
