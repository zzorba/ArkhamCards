import { flatMap } from 'lodash';
import {
  NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
} from '../../actions/types';

function findBaseDeckIds(state, decks) {

}

export function newCampaign(
  id,
  name,
  pack_code,
  difficulty,
  deckIds,
  chaosBag,
  campaignLog,
  weaknessPacks
) {
  return {
    type: NEW_CAMPAIGN,
    id,
    name: name,
    cycleCode: pack_code,
    difficulty,
    chaosBag,
    campaignLog,
    weaknessPacks,
    deckIds,
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
  id,
  sparseCampaign,
) {
  return (dispatch, getState) => {
    const decks = getState().decks.all || {};
    const campaign = Object.assign({}, sparseCampaign);
    dispatch({
      type: UPDATE_CAMPAIGN,
      id,
      campaign,
      now: new Date(),
    });
  };
}

export function deleteCampaign(id) {
  return {
    type: DELETE_CAMPAIGN,
    id,
  };
}

export function addScenarioResult(
  id,
  { scenario, scenarioCode, resolution },
  xp,
) {
  return {
    type: ADD_CAMPAIGN_SCENARIO_RESULT,
    id,
    scenarioResult: {
      scenario,
      scenarioCode,
      resolution,
      xp,
    },
    now: new Date(),
  };
}

export default {
  newCampaign,
  updateCampaign,
  deleteCampaign,
  addScenarioResult,
};
