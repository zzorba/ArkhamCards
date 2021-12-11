import { filter, forEach, map } from 'lodash';
import { ThunkAction } from 'redux-thunk';
import uuid from 'react-native-uuid';

import {
  NEW_CAMPAIGN,
  NEW_LINKED_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  UPDATE_CHAOS_BAG_RESULTS,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  EDIT_CAMPAIGN_SCENARIO_RESULT,
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
  ChaosBagResults,
  CustomCampaignLog,
  ScenarioResult,
  WeaknessSet,
  AddCampaignScenarioResultAction,
  EditCampaignScenarioResultAction,
  RestoreComplexBackupAction,
  NewCampaignAction,
  NewLinkedCampaignAction,
  UpdateCampaignAction,
  UpdateCampaignXpAction,
  UpdateChaosBagResultsAction,
  DeleteCampaignAction,
  AdjustBlessCurseAction,
  ADJUST_BLESS_CURSE,
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
  SealedToken,
} from '@actions/types';
import { ChaosBag, ChaosTokenType } from '@app_constants';
import { AppState, makeCampaignSelector, getDeck, makeDeckSelector } from '@reducers';
import { DeckActions, uploadCampaignDeckHelper } from '@data/remote/decks';
import { SetCampaignChaosBagAction, SetCampaignNotesAction, SetCampaignShowInterludes, SetCampaignWeaknessSetAction, UpdateCampaignActions } from '@data/remote/campaigns';
import { ChaosBagActions } from '@data/remote/chaosBag';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';
import { Chaos_Bag_Tarot_Mode_Enum } from '@generated/graphql/apollo-schema';

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

function updateChaosBagResults(
  id: CampaignId,
  chaosBagResults: ChaosBagResults
): ThunkAction<void, AppState, unknown, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CHAOS_BAG_RESULTS,
      id,
      chaosBagResults,
      now: new Date(),
    });
  };
}

export function updateChaosBagClearTokens(
  actions: ChaosBagActions,
  id: CampaignId,
  bless: number,
  curse: number,
  chaosBagResults: ChaosBagResultsT
): ThunkAction<void, AppState, unknown, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    if (id.serverId) {
      actions.clearTokens(id, bless, curse);
    } else {
      dispatch(updateChaosBagResults(id, {
        drawnTokens: [],
        blessTokens: bless,
        curseTokens: curse,
        sealedTokens: chaosBagResults.sealedTokens,
        totalDrawnTokens: chaosBagResults.totalDrawnTokens,
      }));
    }
  };
}

export function updateChaosBagDrawToken(
  actions: ChaosBagActions,
  id: CampaignId,
  drawn: ChaosTokenType[],
  chaosBagResults: ChaosBagResultsT
): ThunkAction<void, AppState, unknown, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    if (id.serverId) {
      actions.drawToken(id, drawn);
    } else {
      dispatch(updateChaosBagResults(id, {
        ...chaosBagResults,
        drawnTokens: drawn,
        totalDrawnTokens: chaosBagResults.totalDrawnTokens + 1,
      }));
    }
  };
}


export function updateChaosBagTarotMode(
  actions: ChaosBagActions,
  id: CampaignId,
  tarot: Chaos_Bag_Tarot_Mode_Enum | undefined,
  chaosBagResults: ChaosBagResultsT
): ThunkAction<void, AppState, unknown, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    if (id.serverId) {
      actions.setTarot(id, tarot);
    } else {
      dispatch(updateChaosBagResults(id, {
        ...chaosBagResults,
        tarot,
      }));
    }
  };
}

export function updateChaosBagReleaseAllSealed(
  actions: ChaosBagActions,
  id: CampaignId,
  chaosBagResults: ChaosBagResultsT
): ThunkAction<void, AppState, unknown, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    if (id.serverId) {
      actions.releaseAllSealed(id);
    } else {
      dispatch(updateChaosBagResults(id, {
        ...chaosBagResults,
        sealedTokens: [],
      }));
    }
  };
}

export function updateChaosBagResetBlessCurse(
  actions: ChaosBagActions,
  id: CampaignId,
  chaosBagResults: ChaosBagResultsT
): ThunkAction<void, AppState, unknown, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    const drawnTokens = filter(chaosBagResults.drawnTokens, t => t !== 'bless' && t !== 'curse');
    const sealedTokens = filter(chaosBagResults.sealedTokens, t => t.icon !== 'bless' && t.icon !== 'curse');
    if (id.serverId) {
      actions.resetBlessCurse(id, drawnTokens, sealedTokens);
    } else {
      dispatch(updateChaosBagResults(id, {
        ...chaosBagResults,
        blessTokens: 0,
        curseTokens: 0,
        drawnTokens,
        sealedTokens,
      }));
    }
  };
}


export function updateChaosBagSealTokens(
  actions: ChaosBagActions,
  id: CampaignId,
  chaosBagResults: ChaosBagResultsT,
  sealedTokens: SealedToken[]
): ThunkAction<void, AppState, unknown, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    if (id.serverId) {
      actions.sealTokens(id, sealedTokens);
    } else {
      dispatch(updateChaosBagResults(id, {
        ...chaosBagResults,
        sealedTokens,
      }));
    }
  };
}

export function adjustBlessCurseChaosBagResults(
  actions: ChaosBagActions,
  id: CampaignId,
  type: 'bless' | 'curse',
  direction: 'inc' | 'dec'
): ThunkAction<void, AppState, unknown, AdjustBlessCurseAction> {
  return (dispatch) => {
    if (id.serverId) {
      actions.adjustBlessCurse(id, type, direction);
    } else {
      dispatch({
        type: ADJUST_BLESS_CURSE,
        id,
        bless: type === 'bless',
        direction,
        now: new Date(),
      });
    }
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
  userId: string | undefined,
  campaignId: CampaignId,
  scenarioResult: ScenarioResult,
  campaignNotes?: CampaignNotes
): ThunkAction<void, AppState, unknown, AddCampaignScenarioResultAction> {
  return async(dispatch) => {
    dispatch({
      type: ADD_CAMPAIGN_SCENARIO_RESULT,
      campaignId,
      scenarioResult,
      campaignNotes,
      now: new Date(),
    });
  };
}

export function editScenarioResult(
  campaignId: CampaignId,
  index: number,
  scenarioResult: ScenarioResult
): EditCampaignScenarioResultAction {
  return {
    type: EDIT_CAMPAIGN_SCENARIO_RESULT,
    campaignId,
    index,
    scenarioResult,
    now: new Date(),
  };
}

export default {
  newCampaign,
  updateCampaign,
  deleteCampaign,
  addScenarioResult,
  addInvestigator,
  removeInvestigator,
};
