import { map } from 'lodash';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  SET_ALL_CAMPAIGNS,
  NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
  Campaign,
  CampaignCycleCode,
  CampaignDifficultyType,
  CustomCampaignLog,
  WeaknessSet,
  AddCampaignScenarioResultAction,
  NewCampaignAction,
  UpdateCampaignAction,
  DeleteCampaignAction,
  SetAllCampaignsAction,
} from '../../actions/types';
import { ChaosBag } from '../../constants';
import { AppState } from '../../reducers';

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

export function newCampaign(
  id: number,
  name: string,
  pack_code: CampaignCycleCode,
  difficulty: CampaignDifficultyType,
  deckIds: number[],
  chaosBag: ChaosBag,
  campaignLog: CustomCampaignLog,
  weaknessSet: WeaknessSet,
): ThunkAction<void, AppState, null, NewCampaignAction> {
  return (dispatch, getState: () => AppState) => {
    dispatch({
      type: NEW_CAMPAIGN,
      id,
      name: name,
      cycleCode: pack_code,
      difficulty,
      chaosBag,
      campaignLog,
      weaknessSet,
      baseDeckIds: getBaseDeckIds(getState(), deckIds),
      now: new Date(),
    });
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
  id: string,
  sparseCampaign: Campaign,
): ThunkAction<void, AppState, null, UpdateCampaignAction>  {
  return (dispatch, getState) => {
    const campaign = Object.assign({}, sparseCampaign);
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

export function deleteCampaign(id: string): DeleteCampaignAction {
  return {
    type: DELETE_CAMPAIGN,
    id,
  };
}

export function addScenarioResult(
  id: string,
  {
    scenario,
    scenarioCode,
    scenarioPack,
    resolution,
    interlude,
  }: {
    scenario: string;
    scenarioCode: string;
    resolution: string;
    scenarioPack?: string;
    interlude?: boolean;
  },
  xp: number,
): AddCampaignScenarioResultAction {
  return {
    type: ADD_CAMPAIGN_SCENARIO_RESULT,
    id,
    scenarioResult: {
      scenario,
      scenarioCode,
      scenarioPack,
      resolution,
      interlude,
      xp,
    },
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
