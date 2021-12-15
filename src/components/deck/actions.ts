import { map, forEach, range } from 'lodash';
import Config from 'react-native-config';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

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
  START_DECK_EDIT,
  FinishDeckEditAction,
  FINISH_DECK_EDIT,
  DeckId,
  getDeckId,
  ArkhamDbDeck,
  ArkhamDbDeckId,
  SET_UPLOADED_DECKS,
  SetUploadedDecksAction,
  UploadedCampaignId,
  StartDeckEditAction,
  UPLOAD_DECK,
  LocalDeck,
  GroupedUploadedDecks,
} from '@actions/types';
import { login } from '@actions';
import { saveDeck, loadDeck, upgradeDeck, newCustomDeck, UpgradeDeckResult, deleteDeck } from '@lib/authApi';
import { AppState, getDeckUploadedCampaigns } from '@reducers/index';
import { DeckActions } from '@data/remote/decks';
import LatestDeckT from '@data/interfaces/LatestDeckT';

export interface ServerDeck {
  deckId: DeckId;
  hash: string | undefined;
  nextDeckId: DeckId | undefined;
  campaignId: UploadedCampaignId;
}

export function setServerDecks(
  uploadedDecks: GroupedUploadedDecks
): ThunkAction<void, AppState, unknown, SetUploadedDecksAction> {
  return async(dispatch) => {
    dispatch({ type: SET_UPLOADED_DECKS, uploadedDecks });
  };
}

function setNewDeck(
  userId: string | undefined,
  actions: DeckActions,
  id: DeckId,
  deck: Deck,
): ThunkAction<void, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    dispatch({
      type: NEW_DECK_AVAILABLE,
      id,
      deck,
    });
    if (deck.previousDeckId && userId) {
      const previousDeckId = deck.previousDeckId;
      const uploads = getDeckUploadedCampaigns(getState(), deck.previousDeckId);
      if (uploads?.campaignId.length) {
        await Promise.all(
          map(uploads.campaignId, campaignId => actions.createNextDeck(deck, campaignId, previousDeckId).then(() => {
            dispatch({
              type: UPLOAD_DECK,
              deckId: getDeckId(deck),
              campaignId,
            });
          }))
        );
      }
    }
  };
}

function updateDeck(
  userId: string | undefined,
  actions: DeckActions,
  id: DeckId,
  deck: Deck,
  isWrite: boolean
): ThunkAction<void, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    dispatch({
      type: UPDATE_DECK,
      id,
      deck,
      isWrite,
    });
    if (userId) {
      const uploads = getDeckUploadedCampaigns(getState(), id);
      if (uploads?.campaignId.length) {
        await Promise.all(map(uploads.campaignId, campaignId => actions.updateDeck(deck, campaignId)));
      }
    }
  };
}

export function removeDeck(
  userId: string | undefined,
  actions: DeckActions,
  id: DeckId,
  deleteAllVersions?: boolean
): ThunkAction<Promise<boolean>, AppState, unknown, Action<string>> {
  return async(dispatch, getState) => {
    const uploads = getDeckUploadedCampaigns(getState(), id);
    dispatch({
      type: DELETE_DECK,
      id,
      deleteAllVersions: !!deleteAllVersions,
    });
    if (userId && uploads?.campaignId.length) {
      await Promise.all(
        map(uploads.campaignId, campaignId => {
          return actions.deleteDeck(id, campaignId, !!deleteAllVersions);
        })
      );
    }
    return true;
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
  userId: string | undefined,
  actions: DeckActions,
  id: ArkhamDbDeckId
): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch) => {
    loadDeck(id.id).then(deck => {
      dispatch(updateDeck(userId, actions, id, deck, false));
    }).catch(err => {
      if (err.message === 'Not Found') {
        dispatch(removeDeck(userId, actions, id));
      }
    });
  };
}

export function fetchPublicDeck(
  userId: string | undefined,
  actions: DeckActions,
  id: ArkhamDbDeckId,
  useDeckEndpoint: boolean
): ThunkAction<void, AppState, unknown, Action<string>> {
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
        dispatch(updateDeck(userId, actions, id, json, false));
      }).catch((err: Error) => {
        if (!useDeckEndpoint) {
          return dispatch(fetchPublicDeck(userId, actions, id, true));
        }
        console.log(err);
      });
  };
}

const handleUpgradeDeckResult = (
  userId: string | undefined,
  createDeckActions: DeckActions,
  result: UpgradeDeckResult,
): ThunkAction<void, AppState, unknown, Action<string>> => {
  return (dispatch) => {
    dispatch(updateDeck(userId, createDeckActions, getDeckId(result.deck), result.deck, false));
    dispatch(setNewDeck(userId, createDeckActions, getDeckId(result.upgradedDeck), result.upgradedDeck));
    return Promise.resolve(true);
  };
};

export const deleteDeckAction = (
  userId: string | undefined,
  actions: DeckActions,
  id: DeckId,
  deleteAllVersion: boolean
): ThunkAction<Promise<boolean>, AppState, unknown, Action<string>> => {
  return (dispatch) => {
    return new Promise<boolean>((resolve, reject) => {
      if (id.local) {
        dispatch(removeDeck(userId, actions, id, deleteAllVersion));
        resolve(true);
      } else {
        const deleteDeckPromise = deleteDeck(id.id, deleteAllVersion);
        handleAuthErrors(
          deleteDeckPromise,
          () => {
            dispatch(removeDeck(userId, actions, id, deleteAllVersion));
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

export const saveDeckUpgrade = (
  userId: string | undefined,
  actions: DeckActions,
  deck: Deck,
  xp: number,
  exileCounts: Slots
): ThunkAction<Promise<Deck>, AppState, unknown, Action<string>> => {
  return (dispatch) => {
    return new Promise<Deck>((resolve, reject) => {
      const exileParts: string[] = [];
      forEach(exileCounts, (count, code) => {
        if (count > 0) {
          forEach(range(0, count), () => exileParts.push(code));
        }
      });
      if (deck.local) {
        const result = upgradeLocalDeck(deck, xp, exileParts);
        dispatch(handleUpgradeDeckResult(userId, actions, result));
        resolve(result.upgradedDeck);
      } else {
        const exiles = exileParts.join(',');
        const upgradeDeckPromise = upgradeDeck(deck.id, xp, exiles);
        handleAuthErrors(
          upgradeDeckPromise,
          result => {
            dispatch(handleUpgradeDeckResult(userId, actions, result));
            setTimeout(() => {
              resolve(result.upgradedDeck);
            }, 1000);
          },
          reject,
          // retry
          () => {
            dispatch(saveDeckUpgrade(userId, actions, deck, xp, exileCounts))
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
  side?: Slots,
  problem?: string;
  spentXp?: number;
  xpAdjustment?: number;
  tabooSetId?: number;
  meta?: DeckMeta;
}

export const saveDeckChanges = (
  userId: string | undefined,
  actions: DeckActions,
  deck: Deck,
  changes: SaveDeckChanges,
): ThunkAction<Promise<Deck>, AppState, unknown, Action<string>> => {
  return (dispatch): Promise<Deck> => {
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
          (changes.description !== undefined && changes.description !== null) ? changes.description : deck.description_md,
          changes.side || deck.sideSlots || {},
        );
        dispatch(updateDeck(userId, actions, getDeckId(newDeck), newDeck, true));
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
          (changes.description !== undefined && changes.description !== null) ? changes.description : deck.description_md,
          changes.side || deck.sideSlots || {},
        );
        handleAuthErrors<Deck>(
          savePromise,
          // onSuccess
          (deck: Deck) => {
            dispatch(updateDeck(userId, actions, getDeckId(deck), deck, true));
            resolve(deck);
          },
          reject,
          () => {
            dispatch(saveDeckChanges(userId, actions, deck, changes))
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
export const saveNewDeck = (
  userId: string | undefined,
  actions: DeckActions,
  params: NewDeckParams
): ThunkAction<Promise<Deck>, AppState, unknown, Action<string>> => {
  return (dispatch): Promise<Deck> => {
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
        dispatch(setNewDeck(userId, actions, getDeckId(deck), deck));
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
            dispatch(setNewDeck(userId, actions, getDeckId(deck), deck));
            resolve(deck);
          },
          reject,
          () => {
            dispatch(saveNewDeck(userId, actions, params)).then(deck => resolve(deck));
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

export const saveClonedDeck = (
  userId: string | undefined,
  actions: DeckActions,
  local: boolean,
  cloneDeck: Deck,
  deckName: string
): ThunkAction<Promise<Deck>, AppState, unknown, Action<string>> => {
  return (dispatch): Promise<Deck> => {
    return new Promise<Deck>((resolve, reject) => {
      dispatch(saveNewDeck(userId, actions, {
        local,
        deckName,
        investigatorCode: cloneDeck.investigator_code,
        slots: cloneDeck.slots || {},
        ignoreDeckLimitSlots: cloneDeck.ignoreDeckLimitSlots,
        tabooSetId: cloneDeck.taboo_id,
        meta: cloneDeck.meta,
        problem: cloneDeck.problem,
        description: cloneDeck.description_md,
      })).then(deck => {
        setTimeout(() => {
          dispatch(saveDeckChanges(
            userId,
            actions,
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

export const uploadLocalDeck = (
  userId: string | undefined,
  actions: DeckActions,
  replaceLocalDeckRequest: (localDeckId: string, arkhamDbId: number) => Promise<void>,
  localDeck: LocalDeck
): ThunkAction<Promise<Deck>, AppState, unknown, Action<string>> => {
  return async(dispatch, getState): Promise<Deck> => {
    const uploads = getDeckUploadedCampaigns(getState(), getDeckId(localDeck));
    const deck = await dispatch(saveClonedDeck(
      userId,
      actions,
      false,
      localDeck,
      localDeck.name
    ));
    const theDeck = deck as ArkhamDbDeck;
    dispatch(replaceLocalDeck(getDeckId(localDeck), theDeck));
    if (userId && uploads?.campaignId.length) {
      await replaceLocalDeckRequest(localDeck.uuid, theDeck.id);
    }
    return deck;
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

export function incDeckSlot(id: DeckId, code: string, limit: number | undefined, side?: boolean): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'inc',
    limit,
    countType: side ? 'side' : 'slots',
  };
}

export function decDeckSlot(id: DeckId, code: string, side?: boolean): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'dec',
    countType: side ? 'side' : 'slots',
  };
}

export function setDeckSlot(id: DeckId, code: string, value: number, side: boolean | undefined): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'set',
    value,
    countType: side ? 'side' : 'slots',
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
): ThunkAction<void, AppState, unknown, Action<string>> {
  return (dispatch): void => {
    const updatedMeta: DeckMeta = { ...deckEdits.meta };
    forEach(updates, update => {
      if (update.value === undefined) {
        delete updatedMeta[update.key];
      } else {
        updatedMeta[update.key] = update.value as any;
        if (investigator_code === '06002' && update.key === 'deck_size_selected') {
          dispatch(setDeckSlot(id, '06008', (parseInt(update.value, 10) - 20) / 10, false));
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

export function startDeckEdit(id: DeckId, deck: LatestDeckT, editable: boolean, initialMode: undefined | 'upgrade' | 'edit'): ThunkAction<void, AppState, unknown, StartDeckEditAction> {
  return (dispatch): void => {
    dispatch({
      type: START_DECK_EDIT,
      id,
      deck: deck.deck,
      mode: initialMode,
      editable,
    });
  };
}

export function finishDeckEdit(id: DeckId): FinishDeckEditAction {
  return {
    type: FINISH_DECK_EDIT,
    id,
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
