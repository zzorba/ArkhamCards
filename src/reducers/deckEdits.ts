import { filter } from 'lodash';

import {
  DELETE_DECK,
  UPDATE_DECK,
  RESET_DECK_CHECKLIST,
  SET_DECK_CHECKLIST_CARD,
  EditDeckState,
  START_DECK_EDIT,
  FINISH_DECK_EDIT,
  UPDATE_DECK_EDIT_COUNTS,
  UPDATE_DECK_EDIT,
  DeckEditsActions,
  REPLACE_LOCAL_DECK,
  getDeckId,
  SYNC_DECK,
  Slots,
} from '@actions/types';

interface DeckEditsState {
  edits: {
    [id: string]: EditDeckState | undefined;
  }
  editting: {
    [id: string]: boolean | undefined;
  };
  checklist: {
    [id: string]: string[] | undefined;
  };
  deck_uploads?: {
    [uuid: string]: string[] | undefined;
  };
}

const DEFAULT_DECK_EDITS_STATE: DeckEditsState = {
  edits: {},
  editting: {},
  checklist: {},
  deck_uploads: {},
};

function getCurrentSlots(edits: EditDeckState, type: 'slots' | 'ignoreDeckLimitSlots' | 'side'): Slots {
  switch (type) {
    case 'slots': return { ...edits.slots };
    case 'ignoreDeckLimitSlots': return { ...edits.ignoreDeckLimitSlots };
    case 'side': return { ...edits.side };
  }
}

export default function(
  state = DEFAULT_DECK_EDITS_STATE,
  action: DeckEditsActions
): DeckEditsState {
  if (action.type === SYNC_DECK) {
    const deck_uploads = {
      ...(state.deck_uploads || {}),
    };
    const campaign = deck_uploads[action.campaignId.campaignId] || [];
    const newCampaign = action.uploading ? [...campaign, action.investigator] : filter(campaign, i => i !== action.investigator);
    return {
      ...state,
      deck_uploads: {
        ...deck_uploads,
        [action.campaignId.campaignId]: newCampaign,
      },
    };
  }
  if (action.type === START_DECK_EDIT) {
    const newEdits = action.deck ? {
      ...state.edits || {},
      [action.id.uuid]: {
        nameChange: undefined,
        meta: action.deck.meta || {},
        slots: action.deck.slots || {},
        side: action.deck.sideSlots || {},
        ignoreDeckLimitSlots: action.deck.ignoreDeckLimitSlots || {},
        xpAdjustment: action.deck.xp_adjustment || 0,
        mode: action.mode || 'view',
        editable: !action.deck.nextDeckId && action.editable,
      },
    } : state.edits;
    return {
      ...state,
      editting: {
        ...state.editting || {},
        [action.id.uuid]: true,
      },
      edits: newEdits,
    };
  }
  if (action.type === FINISH_DECK_EDIT) {
    const newEditting = { ...state.editting || {} };
    delete newEditting[action.id.uuid];
    const newEdits = { ...state.edits || {} };
    delete newEdits[action.id.uuid];
    return {
      ...state,
      editting: newEditting,
      edits: newEdits,
    };
  }

  if (action.type === UPDATE_DECK_EDIT) {
    const currentEdits = (state.edits || {})[action.id.uuid];
    if (!currentEdits) {
      // Shouldn't happen
      return state;
    }
    const updatedEdits = { ...currentEdits };

    if (action.updates.nameChange !== undefined) {
      updatedEdits.nameChange = action.updates.nameChange;
    }
    if (action.updates.tabooSetChange !== undefined) {
      updatedEdits.tabooSetChange = action.updates.tabooSetChange;
    }
    if (action.updates.meta !== undefined) {
      updatedEdits.meta = action.updates.meta;
    }
    if (action.updates.slots !== undefined) {
      updatedEdits.slots = action.updates.slots;
    }
    if (action.updates.side !== undefined) {
      updatedEdits.side = action.updates.side;
    }
    if (action.updates.ignoreDeckLimitSlots !== undefined) {
      updatedEdits.ignoreDeckLimitSlots = action.updates.ignoreDeckLimitSlots;
    }
    if (action.updates.xpAdjustment !== undefined) {
      updatedEdits.xpAdjustment = action.updates.xpAdjustment;
    }
    if (action.updates.mode !== undefined) {
      updatedEdits.mode = action.updates.mode;
    }
    if (action.updates.descriptionChange !== undefined) {
      updatedEdits.descriptionChange = action.updates.descriptionChange;
    }
    return {
      ...state,
      edits: {
        ...state.edits,
        [action.id.uuid]: updatedEdits,
      },
    };
  }

  if (action.type === UPDATE_DECK_EDIT_COUNTS) {
    const currentEdits = (state.edits || {})[action.id.uuid];
    if (!currentEdits) {
      // Shouldn't happen
      return state;
    }
    if (action.countType === 'xpAdjustment') {
      let xpAdjustment = currentEdits.xpAdjustment;
      switch (action.operation) {
        case 'inc': xpAdjustment++; break;
        case 'dec': xpAdjustment--; break;
        case 'set': xpAdjustment = action.value; break;
      }
      return {
        ...state,
        edits: {
          ...state.edits,
          [action.id.uuid]: {
            ...currentEdits,
            xpAdjustment,
          },
        },
      };
    }
    const currentSlots = getCurrentSlots(currentEdits, action.countType);
    switch (action.operation) {
      case 'set':
        currentSlots[action.code] = action.value;
        break;
      case 'dec':
        currentSlots[action.code] = Math.max((currentSlots[action.code] || 0) - 1, 0);
        break;
      case 'inc':
        currentSlots[action.code] = Math.min((currentSlots[action.code] || 0) + 1, action.limit || 2);
        break;
    }
    if (!currentSlots[action.code]) {
      delete currentSlots[action.code];
    }

    const updatedEdits = { ...currentEdits };
    switch (action.countType) {
      case 'slots':
        updatedEdits.slots = currentSlots;
        break;
      case 'ignoreDeckLimitSlots':
        updatedEdits.ignoreDeckLimitSlots = currentSlots;
        break;
      case 'side':
        updatedEdits.side = currentSlots;
        break;
    }

    return {
      ...state,
      edits: {
        ...state.edits,
        [action.id.uuid]: updatedEdits,
      },
    };
  }
  if (action.type === RESET_DECK_CHECKLIST) {
    return {
      ...state,
      checklist: {
        ...(state.checklist || {}),
        [action.id.uuid]: [],
      },
    };
  }
  if (action.type === SET_DECK_CHECKLIST_CARD) {
    const currentChecklist = (state.checklist || {})[action.id.uuid] || [];
    const checklist = action.value ? [
      ...currentChecklist,
      action.card,
    ] : filter(currentChecklist, card => card !== action.card);
    return {
      ...state,
      checklist: {
        ...(state.checklist || {}),
        [action.id.uuid]: checklist,
      },
    };
  }

  if (action.type === DELETE_DECK) {
    const checklist = {
      ...(state.checklist || {}),
    };
    if (checklist[action.id.uuid]) {
      delete checklist[action.id.uuid];
    }
    return {
      ...state,
      checklist,
    };
  }
  if (action.type === UPDATE_DECK) {
    if (!action.deck) {
      return state;
    }
    if ((state.editting || {})[action.id.uuid]) {
      return {
        ...state,
        edits: {
          ...(state.edits || {}),
          [action.id.uuid]: {
            nameChange: undefined,
            tabooSetChange: undefined,
            slots: action.deck.slots || {},
            side: action.deck.sideSlots || {},
            ignoreDeckLimitSlots: action.deck.ignoreDeckLimitSlots || {},
            meta: action.deck.meta || {},
            xpAdjustment: action.deck.xp_adjustment || 0,
            mode: 'view',
            editable: !action.deck.nextDeckId,
          },
        },
      };
    }
    return state;
  }

  if (action.type === REPLACE_LOCAL_DECK) {
    const checklist = {
      ...(state.checklist || {}),
    };
    if (checklist[action.localId.uuid]) {
      checklist[getDeckId(action.deck).uuid] = checklist[action.localId.uuid];
      delete checklist[action.localId.uuid];
    }
    return {
      ...state,
      checklist,
    };
  }
  return state;
}
