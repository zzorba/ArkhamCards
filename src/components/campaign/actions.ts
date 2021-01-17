import { map } from 'lodash';
import { ThunkAction } from 'redux-thunk';

import {
  RESTORE_BACKUP,
  NEW_CAMPAIGN,
  NEW_LINKED_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  UPDATE_CHAOS_BAG_RESULTS,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  EDIT_CAMPAIGN_SCENARIO_RESULT,
  CAMPAIGN_ADD_INVESTIGATOR,
  CAMPAIGN_REMOVE_INVESTIGATOR,
  UPDATE_CAMPAIGN_SPENT_XP,
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
  UpdateCampaignSpentXpAction,
  UpdateChaosBagResultsAction,
  DeleteCampaignAction,
  RestoreBackupAction,
  AdjustBlessCurseAction,
  ADJUST_BLESS_CURSE,
  StandaloneId,
  NewStandaloneCampaignAction,
  NEW_STANDALONE,
  CampaignId,
} from '@actions/types';
import { ChaosBag } from '@app_constants';
import { AppState, makeCampaignSelector } from '@reducers';

function getBaseDeckIds(
  state: AppState,
  latestDeckIds: number[]
): number[] {
  const decks = state.decks.all || {};
  return map(latestDeckIds, deckId => {
    let deck = decks[deckId];
    while (deck && deck.previous_deck && deck.previous_deck in decks) {
      deck = decks[deck.previous_deck];
    }
    return deck ? deck.id : deckId;
  });
}

export function restoreBackup(
  campaigns: Campaign[],
  guides: { [id: string]: CampaignGuideState },
  decks: Deck[]
): RestoreBackupAction {
  return {
    type: RESTORE_BACKUP,
    campaigns,
    guides,
    decks,
  };
}


export function restoreComplexBackup(
  campaigns: Campaign[],
  guides: { [id: string]: CampaignGuideState },
  campaignRemapping: { [id: string]: number },
  decks: Deck[],
  deckRemapping: { [id: string]: number }
): RestoreComplexBackupAction {
  return {
    type: RESTORE_COMPLEX_BACKUP,
    campaigns,
    guides,
    decks,
    deckRemapping,
    campaignRemapping,
  };
}

export function cleanBrokenCampaigns(): CleanBrokenCampaignsAction {
  return {
    type: CLEAN_BROKEN_CAMPAIGNS,
  };
}

export function addInvestigator(
  { campaignId, serverId }: CampaignId,
  investigator: string,
  deckId?: number
): ThunkAction<void, AppState, null, CampaignAddInvestigatorAction> {
  return (dispatch, getState: () => AppState) => {
    const baseDeckId = deckId ?
      getBaseDeckIds(getState(), [deckId])[0] :
      undefined;
    const action: CampaignAddInvestigatorAction = {
      type: CAMPAIGN_ADD_INVESTIGATOR,
      id: campaignId,
      investigator,
      baseDeckId,
      now: new Date(),
    };
    dispatch(action);
  };
}

export function removeInvestigator(
  { campaignId, serverId }: CampaignId,
  investigator: string,
  deckId?: number
): ThunkAction<void, AppState, null, CampaignRemoveInvestigatorAction> {
  return (dispatch, getState: () => AppState) => {
    const baseDeckId = deckId ?
      getBaseDeckIds(getState(), [deckId])[0] :
      undefined;
    const action: CampaignRemoveInvestigatorAction = {
      type: CAMPAIGN_REMOVE_INVESTIGATOR,
      id: campaignId,
      investigator,
      removeDeckId: baseDeckId,
      now: new Date(),
    };
    dispatch(action);
  };
}

export function newLinkedCampaign(
  id: number,
  name: string,
  cycleCode: CampaignCycleCode,
  cycleCodeA: CampaignCycleCode,
  cycleCodeB: CampaignCycleCode,
  weaknessSet: WeaknessSet
): NewLinkedCampaignAction {
  return {
    type: NEW_LINKED_CAMPAIGN,
    id,
    name,
    cycleCode,
    cycleCodeA,
    cycleCodeB,
    weaknessSet,
    guided: true,
    now: new Date(),
  };
}

export function newStandalone(
  id: number,
  name: string,
  standaloneId: StandaloneId,
  deckIds: number[],
  investigatorIds: string[],
  weaknessSet: WeaknessSet
): ThunkAction<void, AppState, null, NewStandaloneCampaignAction> {
  return (dispatch, getState: () => AppState) => {
    const action: NewStandaloneCampaignAction = {
      type: NEW_STANDALONE,
      id,
      name: name,
      standaloneId,
      weaknessSet,
      baseDeckIds: getBaseDeckIds(getState(), deckIds),
      investigatorIds,
      now: new Date(),
    };
    dispatch(action);
  };
}

export function newCampaign(
  id: number,
  name: string,
  pack_code: CampaignCycleCode,
  difficulty: CampaignDifficulty | undefined,
  deckIds: number[],
  investigatorIds: string[],
  chaosBag: ChaosBag,
  campaignLog: CustomCampaignLog,
  weaknessSet: WeaknessSet,
  guided: boolean
): ThunkAction<void, AppState, null, NewCampaignAction> {
  return (dispatch, getState: () => AppState) => {
    const action: NewCampaignAction = {
      type: NEW_CAMPAIGN,
      id,
      name: name,
      cycleCode: pack_code,
      difficulty,
      chaosBag,
      campaignLog,
      weaknessSet,
      baseDeckIds: getBaseDeckIds(getState(), deckIds),
      investigatorIds,
      guided,
      now: new Date(),
    };
    dispatch(action);
  };
}

export function updateCampaignSpentXp(
  id: number,
  investigator: string,
  operation: 'inc' | 'dec'
): UpdateCampaignSpentXpAction {
  return {
    type: UPDATE_CAMPAIGN_SPENT_XP,
    id,
    investigator,
    operation,
    now: new Date(),
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
export function updateCampaign(
  { campaignId, serverId }: CampaignId,
  sparseCampaign: Partial<Campaign>,
  now?: Date
): ThunkAction<void, AppState, null, UpdateCampaignAction> {
  return (dispatch, getState: () => AppState) => {
    const campaign: Partial<Campaign> = { ...sparseCampaign };
    if (campaign.latestDeckIds) {
      campaign.baseDeckIds = getBaseDeckIds(getState(), campaign.latestDeckIds);
      delete campaign.latestDeckIds;
    }
    dispatch({
      type: UPDATE_CAMPAIGN,
      id: campaignId,
      campaign,
      now: (now || new Date()),
    });
  };
}

export function updateChaosBagResults(
  id: number,
  chaosBagResults: ChaosBagResults
): ThunkAction<void, AppState, null, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CHAOS_BAG_RESULTS,
      id,
      chaosBagResults,
      now: new Date(),
    });
  };
}

export function adjustBlessCurseChaosBagResults(
  id: number,
  type: 'bless' | 'curse',
  direction: 'inc' | 'dec'
): ThunkAction<void, AppState, null, AdjustBlessCurseAction> {
  return (dispatch) => {
    dispatch({
      type: ADJUST_BLESS_CURSE,
      id,
      bless: type === 'bless',
      direction,
      now: new Date(),
    });
  };
}


export function removeLocalCampaign(campaign: Campaign): ThunkAction<void, AppState, null, DeleteCampaignAction> {
  return (dispatch) => {
    if (campaign && campaign.link) {
      dispatch({
        type: DELETE_CAMPAIGN,
        id: campaign.link.campaignIdA,
      });
      dispatch({
        type: DELETE_CAMPAIGN,
        id: campaign.link.campaignIdB,
      });
    }
    dispatch({
      type: DELETE_CAMPAIGN,
      id: campaign.id,
    });
  };
}

export function deleteCampaign(
  { campaignId, serverId }: CampaignId
): ThunkAction<void, AppState, null, DeleteCampaignAction> {
  return (dispatch, getState: () => AppState) => {
    const campaign = makeCampaignSelector()(getState(), campaignId);
    if (campaign) {
      dispatch(removeLocalCampaign(campaign));
    }
  };
}

export function addScenarioResult(
  id: number,
  scenarioResult: ScenarioResult,
  campaignNotes?: CampaignNotes
): AddCampaignScenarioResultAction {
  return {
    type: ADD_CAMPAIGN_SCENARIO_RESULT,
    id,
    scenarioResult,
    campaignNotes,
    now: new Date(),
  };
}

export function editScenarioResult(
  id: number,
  index: number,
  scenarioResult: ScenarioResult
): EditCampaignScenarioResultAction {
  return {
    type: EDIT_CAMPAIGN_SCENARIO_RESULT,
    id,
    index,
    scenarioResult,
    now: new Date(),
  };
}

export default {
  restoreBackup,
  newCampaign,
  updateCampaign,
  deleteCampaign,
  addScenarioResult,
  addInvestigator,
  removeInvestigator,
};
