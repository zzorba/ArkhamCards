import { filter, forEach, pickBy } from 'lodash';

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
  ChecklistSlots,
  UpdateDeckEditCountsAction,
  DeckMeta,
} from '@actions/types';
import { encodeMetaSlots, parseMetaSlots } from '@lib/parseDeck';

interface DeckEditsState {
  edits: {
    [id: string]: EditDeckState | undefined;
  }
  editting: {
    [id: string]: boolean | undefined;
  };
  checklist_counts?: {
    [id: string]: ChecklistSlots | undefined;
  };
  deck_uploads?: {
    [uuid: string]: string[] | undefined;
  };
}

const DEFAULT_DECK_EDITS_STATE: DeckEditsState = {
  edits: {},
  editting: {},
  checklist_counts: {},
  deck_uploads: {},
};

function getCurrentSlots(edits: EditDeckState, action: UpdateDeckEditCountsAction): Slots {
  switch (action.countType) {
    case 'slots':
      return { ...edits.slots };
    case 'extra':
      return parseMetaSlots(edits.meta.extra_deck);
    case 'ignoreDeckLimitSlots':
      return { ...edits.ignoreDeckLimitSlots };
    case 'side':
      return { ...edits.side };
    case 'xpAdjustment':
      return {};
    case 'attachment':
      return parseMetaSlots(edits.meta[`attachment_${action.attachment_code}`]);
  }
}

function cleanAttachmentCounts(meta: DeckMeta, code: string, count: number): DeckMeta {
  const newMeta = { ...meta };
  forEach(Object.keys(meta), key => {
    if (key.startsWith('attachment_')) {
      const slots = parseMetaSlots(meta[key]);
      if ((slots[code] ?? 0) > count) {
        slots[code] = count;
        newMeta[key] = encodeMetaSlots(slots);
      }
    }
  });
  return newMeta;
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
        tagsChange: undefined,
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
    if (action.updates.tagsChange !== undefined) {
      updatedEdits.tagsChange = action.updates.tagsChange;
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
        case 'inc':
          xpAdjustment++;
          break;
        case 'dec':
          xpAdjustment--;
          break;
        case 'set':
          xpAdjustment = action.value;
          break;
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
    const currentSlots = getCurrentSlots(currentEdits, action);
    const updatedEdits = { ...currentEdits };
    switch (action.operation) {
      case 'set': {
        currentSlots[action.code] = action.value;
        // Special logic for set related to ignoreDeckLimitSlots.
        switch (action.countType) {
          case 'ignoreDeckLimitSlots':
            if (currentSlots[action.code] > (currentEdits.slots[action.code] || 0)) {
              updatedEdits.slots = {
                ...currentEdits.slots,
                [action.code]: currentSlots[action.code],
              };
            }
            break;
          case 'slots':
            if (currentSlots[action.code] < (currentEdits.ignoreDeckLimitSlots[action.code] || 0)) {
              updatedEdits.ignoreDeckLimitSlots = {
                ...currentEdits.ignoreDeckLimitSlots,
                [action.code]: currentSlots[action.code],
              };
            }
            break;
        }
        break;
      }
      case 'dec': {
        currentSlots[action.code] = Math.max((currentSlots[action.code] || 0) - 1, 0);
        // Special logic for dec related to ignoreDeckLimitSlots.
        switch (action.countType) {
          case 'slots':
            if (currentSlots[action.code] < (currentEdits.ignoreDeckLimitSlots[action.code] || 0)) {
              updatedEdits.ignoreDeckLimitSlots = {
                ...currentEdits.ignoreDeckLimitSlots,
                [action.code]: currentSlots[action.code],
              };
            }
            break;
        }
        break;
      }
      case 'inc': {
        currentSlots[action.code] = Math.min((currentSlots[action.code] || 0) + 1, action.limit || 2);
        // Special logic for inc related to ignoreDeckLimitSlots.
        switch (action.countType) {
          case 'ignoreDeckLimitSlots':
            if (currentSlots[action.code] > (currentEdits.slots[action.code] || 0)) {
              updatedEdits.slots = {
                ...currentEdits.slots,
                [action.code]: currentSlots[action.code],
              };
            }
            break;
        }
        break;
      }
    }
    if (action.countType === 'slots') {
    }
    if (!currentSlots[action.code]) {
      delete currentSlots[action.code];
    }

    switch (action.countType) {
      case 'slots':
        // When we manipulate the main deck, we need to check if any attachments need to be adjusted.
        updatedEdits.meta = cleanAttachmentCounts(currentEdits.meta, action.code, currentSlots[action.code] ?? 0);
        updatedEdits.slots = currentSlots;
        break;
      case 'ignoreDeckLimitSlots':
        updatedEdits.ignoreDeckLimitSlots = currentSlots;
        break;
      case 'side':
        updatedEdits.side = currentSlots;
        break;
      case 'extra':
        updatedEdits.meta = {
          ...currentEdits.meta,
          extra_deck: encodeMetaSlots(currentSlots),
        };
        break;
      case 'attachment':
        updatedEdits.meta = {
          ...currentEdits.meta,
          [`attachment_${action.attachment_code}`]: encodeMetaSlots(currentSlots),
        };
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
      checklist_counts: {
        ...(state.checklist_counts ?? {}),
        [action.id.uuid]: {},
      },
    };
  }
  if (action.type === SET_DECK_CHECKLIST_CARD) {
    const checklist = {
      ...(state.checklist_counts ?? {})[action.id.uuid] ?? {},
    };
    const counts = filter((checklist[action.card] ?? []), card => card !== action.value);
    if (action.toggle) {
      counts.push(action.value);
    }
    checklist[action.card] = counts;
    return {
      ...state,
      checklist_counts: {
        ...(state.checklist_counts ?? {}),
        [action.id.uuid]: checklist,
      },
    };
  }

  if (action.type === DELETE_DECK) {
    const checklist_counts = {
      ...(state.checklist_counts ?? {}),
    };
    if (checklist_counts[action.id.uuid]) {
      delete checklist_counts[action.id.uuid];
    }
    return {
      ...state,
      checklist_counts,
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
            tagsChange: undefined,
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
    const checklist_counts = {
      ...(state.checklist_counts ?? {}),
    };
    if (checklist_counts[action.localId.uuid]) {
      checklist_counts[getDeckId(action.deck).uuid] = checklist_counts[action.localId.uuid];
      delete checklist_counts[action.localId.uuid];
    }
    return {
      ...state,
      checklist_counts,
    };
  }
  return state;
}
