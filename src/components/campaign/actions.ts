import { forEach, map } from 'lodash';
import { ThunkAction } from 'redux-thunk';
import uuid from 'react-native-uuid';

import {
  NEW_CAMPAIGN,
  NEW_LINKED_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  CAMPAIGN_ADD_INVESTIGATOR,
  CAMPAIGN_REMOVE_INVESTIGATOR,
  CLEAN_BROKEN_CAMPAIGNS,
  RESTORE_COMPLEX_BACKUP,
  CleanBrokenCampaignsAction,
  CampaignAddInvestigatorAction,
  CampaignRemoveInvestigatorAction,
  Campaign,
  Deck,
  CampaignNotes,
  CampaignGuideState,
  CampaignCycleCode,
  CampaignDifficulty,
  CustomCampaignLog,
  ScenarioResult,
  WeaknessSet,
  RestoreComplexBackupAction,
  NewCampaignAction,
  NewLinkedCampaignAction,
  UpdateCampaignAction,
  UpdateCampaignXpAction,
  DeleteCampaignAction,
  StandaloneId,
  NewStandaloneCampaignAction,
  NEW_STANDALONE,
  CampaignId,
  DeckId,
  getDeckId,
  RemoveUploadDeckAction,
  REMOVE_UPLOAD_DECK,
  CampaignSyncRequiredAction,
  getCampaignId,
  UPDATE_CAMPAIGN_XP,
  Trauma,
  UpdateCampaignTraumaAction,
  UPDATE_CAMPAIGN_TRAUMA,
  TraumaAndCardData,
  LocalCampaignId,
  TarotReading,
} from '@actions/types';
import { ChaosBag } from '@app_constants';
import { AppState, makeCampaignSelector, getDeck, makeDeckSelector } from '@reducers';
import { DeckActions, uploadCampaignDeckHelper } from '@data/remote/decks';
import { SetCampaignChaosBagAction, SetCampaignNotesAction, SetCampaignShowInterludes, SetCampaignTarotReadingAction, SetCampaignWeaknessSetAction, UpdateCampaignActions } from '@data/remote/campaigns';
import { Action } from 'redux';
import SingleCampaignT from '@data/interfaces/SingleCampaignT';

function getBaseDeckIds(
  state: AppState,
  deckIds: DeckId[]
): DeckId[] {
  const decks = state.decks.all || {};
  return map(deckIds, deckId => {
    let deck = getDeck(decks, deckId);
    while (deck && deck.previousDeckId) {
      const previousDeck = getDeck(decks, deck.previousDeckId);
      if (!previousDeck) {
        break;
      }
      deck = previousDeck;
    }
    return deck ? getDeckId(deck) : deckId;
  });
}

export function restoreComplexBackup(
  campaigns: Campaign[],
  guides: CampaignGuideState[],
  decks: Deck[],
): RestoreComplexBackupAction {
  return {
    type: RESTORE_COMPLEX_BACKUP,
    campaigns,
    guides,
    decks,
  };
}

export function cleanBrokenCampaigns(): CleanBrokenCampaignsAction {
  return {
    type: CLEAN_BROKEN_CAMPAIGNS,
  };
}

export function addInvestigator(
  userId: string | undefined,
  deckActions: DeckActions,
  updateCampaignActions: UpdateCampaignActions,
  id: CampaignId,
  investigator: string,
  deckId?: DeckId,
): ThunkAction<Promise<void>, AppState, unknown, CampaignAddInvestigatorAction> {
  return async(dispatch, getState: () => AppState) => {
    const baseDeckId = deckId ?
      getBaseDeckIds(getState(), [deckId])[0] :
      undefined;
    if (userId && id.serverId) {
      await updateCampaignActions.addInvestigator(id, investigator);
    } else {
      const action: CampaignAddInvestigatorAction = {
        type: CAMPAIGN_ADD_INVESTIGATOR,
        id,
        investigator,
        deckId: baseDeckId,
        now: new Date(),
      };
      dispatch(action);
    }
    if (baseDeckId && id.serverId && userId) {
      await dispatch(uploadCampaignDeckHelper(id, baseDeckId, deckActions));
    }
  };
}

export function removeInvestigator(
  userId: string | undefined,
  actions: UpdateCampaignActions,
  id: CampaignId,
  investigator: string,
  deckId?: DeckId
): ThunkAction<void, AppState, unknown, CampaignRemoveInvestigatorAction> {
  return async(dispatch, getState: () => AppState) => {
    const baseDeckId = deckId ?
      getBaseDeckIds(getState(), [deckId])[0] :
      undefined;
    if (userId && id.serverId) {
      if (deckId) {
        // First removal is only for the deck
        await actions.removeInvestigatorDeck(id, investigator);
      } else {
        await actions.removeInvestigator(id, investigator);
      }
    } else {
      const action: CampaignRemoveInvestigatorAction = {
        type: CAMPAIGN_REMOVE_INVESTIGATOR,
        id,
        investigator,
        removeDeckId: baseDeckId,
        now: new Date(),
      };
      dispatch(action);
    }
  };
}

export function newLinkedCampaign(
  userId: string | undefined,
  name: string,
  cycleCode: CampaignCycleCode,
  cycleCodeA: CampaignCycleCode,
  cycleCodeB: CampaignCycleCode,
  weaknessSet: WeaknessSet
): ThunkAction<Promise<{
  campaignId: CampaignId;
  campaignIdA: CampaignId;
  campaignIdB: CampaignId;
}>, AppState, unknown, NewLinkedCampaignAction> {
  return async(dispatch) => {
    const campaignId: string = uuid.v4() as string;
    const campaignIdA: string = uuid.v4() as string;
    const campaignIdB: string = uuid.v4() as string;
    const action: NewLinkedCampaignAction = {
      type: NEW_LINKED_CAMPAIGN,
      name,
      uuid: campaignId,
      uuidA: campaignIdA,
      uuidB: campaignIdB,
      cycleCode,
      cycleCodeA,
      cycleCodeB,
      weaknessSet,
      guided: true,
      now: new Date(),
    };
    dispatch(action);
    return {
      campaignId: { campaignId },
      campaignIdA: { campaignId: campaignIdA },
      campaignIdB: { campaignId: campaignIdB },
    };
  };
}

export function newStandalone(
  userId: string | undefined,
  name: string,
  standaloneId: StandaloneId,
  deckIds: DeckId[],
  investigatorIds: string[],
  weaknessSet: WeaknessSet
): ThunkAction<Promise<CampaignId>, AppState, unknown, NewStandaloneCampaignAction> {
  return async(dispatch, getState: () => AppState) => {
    const campaignId: string = uuid.v4() as string;
    const action: NewStandaloneCampaignAction = {
      type: NEW_STANDALONE,
      uuid: campaignId,
      name: name,
      standaloneId,
      weaknessSet,
      deckIds: getBaseDeckIds(getState(), deckIds),
      investigatorIds,
      now: new Date(),
    };
    dispatch(action);
    return { campaignId };
  };
}

export function newCampaign(
  userId: string | undefined,
  name: string,
  pack_code: CampaignCycleCode,
  difficulty: CampaignDifficulty | undefined,
  deckIds: DeckId[],
  investigatorIds: string[],
  chaosBag: ChaosBag,
  campaignLog: CustomCampaignLog,
  weaknessSet: WeaknessSet,
  guided: boolean
): ThunkAction<Promise<CampaignId>, AppState, unknown, NewCampaignAction> {
  return async(dispatch, getState: () => AppState) => {
    const campaignId: string = uuid.v4() as string;
    const action: NewCampaignAction = {
      type: NEW_CAMPAIGN,
      name: name,
      uuid: campaignId,
      cycleCode: pack_code,
      difficulty,
      chaosBag,
      campaignLog,
      weaknessSet,
      deckIds: getBaseDeckIds(getState(), deckIds),
      investigatorIds,
      guided,
      now: new Date(),
    };
    dispatch(action);
    return { campaignId };
  };
}

export function updateCampaignXp(
  actions: UpdateCampaignActions,
  id: CampaignId,
  investigator: string,
  value: number,
  xpType: 'spentXp' | 'availableXp'
): ThunkAction<void, AppState, unknown, UpdateCampaignXpAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await actions.setXp(id, investigator, xpType, value);
    } else {
      dispatch({
        type: UPDATE_CAMPAIGN_XP,
        id,
        investigator,
        operation: 'set',
        value,
        xpType,
        now: new Date(),
      });
    }
  };
}

export function updateCampaignInvestigatorTrauma(
  actions: UpdateCampaignActions,
  id: CampaignId,
  investigator: string,
  trauma: Trauma,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignTraumaAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await actions.setInvestigatorTrauma(id, investigator, trauma);
    } else {
      dispatch({
        type: UPDATE_CAMPAIGN_TRAUMA,
        id,
        investigator,
        trauma,
        now: now || new Date(),
      });
    }
  };
}


export function updateCampaignInvestigatorData(
  userId: string | undefined,
  actions: UpdateCampaignActions,
  id: CampaignId,
  investigator: string,
  data: TraumaAndCardData,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignTraumaAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await actions.setInvestigatorData(id, investigator, data);
    } else {
      dispatch({
        type: UPDATE_CAMPAIGN_TRAUMA,
        id,
        investigator,
        trauma: data,
        now: now || new Date(),
      });
    }
  };
}

export function updateCampaignArchived(
  userId: string | undefined,
  actions: UpdateCampaignActions,
  id: CampaignId,
  archived: boolean,
  now?: Date
): ThunkAction<Promise<void>, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await actions.setArchived(id, archived);
    } else {
      dispatch(updateCampaign(id, { archived }, now));
    }
  };
}

export function updateCampaignWeaknessSet(
  setWeaknessSet: SetCampaignWeaknessSetAction,
  id: CampaignId,
  weaknessSet: WeaknessSet,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await setWeaknessSet(id, weaknessSet);
    } else {
      dispatch(updateCampaign(id, { weaknessSet }, now));
    }
  };
}


export function updateTarotReading(
  setTarotReading: SetCampaignTarotReadingAction,
  id: CampaignId,
  tarotReading: TarotReading | undefined,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await setTarotReading(id, tarotReading || undefined);
    } else {
      dispatch(updateCampaign(id, { tarotReading: tarotReading || null }, now));
    }
  };
}

export function updateCampaignChaosBag(
  setChaosBag: SetCampaignChaosBagAction,
  id: CampaignId,
  chaosBag: ChaosBag,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await setChaosBag(id, chaosBag);
    } else {
      dispatch(updateCampaign(id, { chaosBag }, now));
    }
  };
}


export function updateCampaignNotes(
  setCampaignNotes: SetCampaignNotesAction,
  id: CampaignId,
  campaignNotes: CampaignNotes,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await setCampaignNotes(id, campaignNotes);
    } else {
      dispatch(updateCampaign(id, { campaignNotes }, now));
    }
  };
}


export function updateCampaignShowInterludes(
  setShowInterludes: SetCampaignShowInterludes,
  id: CampaignId,
  showInterludes: boolean,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await setShowInterludes(id, showInterludes);
    } else {
      dispatch(updateCampaign(id, { showInterludes }, now));
    }
  };
}


export function updateCampaignName(
  actions: UpdateCampaignActions,
  id: CampaignId,
  name: string,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await actions.setCampaigName(id, name);
    } else {
      dispatch(updateCampaign(id, { name }, now));
    }
  };
}

export function updateCampaignDifficulty(
  actions: UpdateCampaignActions,
  id: CampaignId,
  difficulty?: CampaignDifficulty,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await actions.setDifficulty(id, difficulty);
    } else {
      dispatch(updateCampaign(id, { difficulty }, now));
    }
  };
}

export function updateCampaignScenarioResults(
  actions: UpdateCampaignActions,
  id: CampaignId,
  scenarioResults: ScenarioResult[],
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await actions.setScenarioResults(id, scenarioResults);
    } else {
      dispatch(updateCampaign(id, { scenarioResults }, now));
    }
  };
}

export function updateCampaignGuideVersion(
  actions: UpdateCampaignActions,
  id: CampaignId,
  guideVersion: number,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch) => {
    if (id.serverId !== undefined) {
      await actions.setGuideVersion(id, guideVersion);
    } else {
      dispatch(updateCampaign(id, { guideVersion }, now));
    }
  };
}

/**
 * Pass only the fields that you want to update.
 * {
 *   chaosBag,
 *   campaignNotes,
 *   investigatorData,
 *   latestDeckIds,
 *   weaknessSet,
 * }
 */
function updateCampaign(
  id: LocalCampaignId,
  sparseCampaign: Partial<Campaign>,
  now?: Date
): ThunkAction<void, AppState, unknown, UpdateCampaignAction | CampaignSyncRequiredAction> {
  return async(dispatch) => {
    dispatch({
      type: UPDATE_CAMPAIGN,
      id,
      campaign: sparseCampaign,
      now: (now || new Date()),
    });
  };
}

export function removeLocalCampaign(
  campaign: Campaign
): ThunkAction<void, AppState, unknown, DeleteCampaignAction | RemoveUploadDeckAction> {
  return (dispatch, getState) => {
    if (campaign.serverId) {
      const campaignId = {
        campaignId: campaign.uuid,
        serverId: campaign.serverId,
      };
      // Delink all of the decks.
      const state = getState();
      const getDeck = makeDeckSelector();
      forEach(campaign.deckIds || [], deckId => {
        let deck = getDeck(state, deckId);
        while (deck) {
          dispatch({
            type: REMOVE_UPLOAD_DECK,
            deckId: getDeckId(deck),
            campaignId,
          });
          if (!deck.nextDeckId) {
            break;
          }
          deck = getDeck(state, deck.nextDeckId);
        }
      });
    }
    dispatch({
      type: DELETE_CAMPAIGN,
      id: getCampaignId(campaign),
    });
  };
}

export function deleteCampaign(
  userId: string | undefined,
  { campaignId }: CampaignId
): ThunkAction<void, AppState, unknown, DeleteCampaignAction | RemoveUploadDeckAction> {
  return (dispatch, getState) => {
    const state = getState();
    const getCampaign = makeCampaignSelector();
    const campaign = getCampaign(getState(), campaignId);
    if (campaign) {
      if (campaign.linkUuid) {
        const campaignA = getCampaign(state, campaign.linkUuid.campaignIdA);
        if (campaignA) {
          dispatch(removeLocalCampaign(campaignA));
        }
        const campaignB = getCampaign(state, campaign.linkUuid.campaignIdB);
        if (campaignB) {
          dispatch(removeLocalCampaign(campaignB));
        }
      }
      dispatch(removeLocalCampaign(campaign));
    }
  };
}

export function addScenarioResult(
  actions: UpdateCampaignActions,
  campaign: SingleCampaignT,
  scenarioResult: ScenarioResult,
  campaignNotes?: CampaignNotes
): ThunkAction<void, AppState, unknown, Action> {
  return async(dispatch) => {
    if (campaign) {
      const scenarioResults = [
        ...(campaign.scenarioResults || []),
        { ...scenarioResult },
      ];
      dispatch(updateCampaignScenarioResults(actions, campaign.id, scenarioResults));

      if (campaignNotes) {
        updateCampaignNotes(actions.setCampaignNotes, campaign.id, campaignNotes);
      }
    }
  };
}

export function editScenarioResult(
  actions: UpdateCampaignActions,
  campaign: SingleCampaignT,
  index: number,
  scenarioResult: ScenarioResult
): ThunkAction<void, AppState, unknown, Action> {
  return async(dispatch) => {
    if (campaign) {
      const scenarioResults = [
        ...campaign.scenarioResults || [],
      ];
      scenarioResults[index] = { ...scenarioResult };
      dispatch(updateCampaignScenarioResults(actions, campaign.id, scenarioResults));
    }
  }
}

export default {
  newCampaign,
  updateCampaign,
  deleteCampaign,
  addScenarioResult,
  addInvestigator,
  removeInvestigator,
};
