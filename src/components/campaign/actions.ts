import { map } from 'lodash';
import { ThunkAction } from 'redux-thunk';

import {
  SET_ALL_CAMPAIGNS,
  NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  UPDATE_CHAOS_BAG_RESULTS,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  EDIT_CAMPAIGN_SCENARIO_RESULT,
  CAMPAIGN_ADD_INVESTIGATOR,
  CampaignAddInvestigatorAction,
  Campaign,
  CampaignNotes,
  CampaignCycleCode,
  CampaignDifficulty,
  ChaosBagResults,
  CustomCampaignLog,
  ScenarioResult,
  WeaknessSet,
  AddCampaignScenarioResultAction,
  EditCampaignScenarioResultAction,
  NewCampaignAction,
  UpdateCampaignAction,
  UpdateChaosBagResultsAction,
  DeleteCampaignAction,
  SetAllCampaignsAction,
} from 'actions/types';
import { ChaosBag } from 'constants';
import { AppState } from 'reducers';

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

export function setAllCampaigns(
  campaigns: { [id: string]: Campaign }
): SetAllCampaignsAction {
  return {
    type: SET_ALL_CAMPAIGNS,
    campaigns,
  };
}

export function addInvestigator(
  campaignId: number,
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
  id: number,
  sparseCampaign: Partial<Campaign>
): ThunkAction<void, AppState, null, UpdateCampaignAction> {
  return (dispatch, getState) => {
    const campaign: Partial<Campaign> = { ...sparseCampaign };
    if (campaign.latestDeckIds) {
      campaign.baseDeckIds = getBaseDeckIds(getState(), campaign.latestDeckIds);
      delete campaign.latestDeckIds;
    }
    dispatch({
      type: UPDATE_CAMPAIGN,
      id,
      campaign,
      now: new Date(),
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

export function deleteCampaign(id: number): DeleteCampaignAction {
  return {
    type: DELETE_CAMPAIGN,
    id,
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
  setAllCampaigns,
  newCampaign,
  updateCampaign,
  deleteCampaign,
  addScenarioResult,
};
