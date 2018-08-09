import { map } from 'lodash';
import {
  NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  ADD_CAMPAIGN_SCENARIO_RESULT,
} from '../../actions/types';

function getBaseDeckIds(state, latestDeckIds) {
  const decks = state.decks.all || {};
  return map(latestDeckIds, deckId => {
    let deck = decks[deckId];
    while (deck && deck.previous_deck && deck.previous_deck in decks) {
      deck = decks[deck.previous_deck];
    }
    return deck ? deck.id : deckId;
  });
}

export function newCampaign(
  id,
  name,
  pack_code,
  difficulty,
  deckIds,
  chaosBag,
  campaignLog,
  weaknessSet
) {
  return (dispatch, getState) => {
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
  id,
  sparseCampaign,
) {
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

export function deleteCampaign(id) {
  return {
    type: DELETE_CAMPAIGN,
    id,
  };
}

export function addScenarioResult(
  id,
  { scenario, scenarioCode, scenarioPack, resolution, interlude },
  xp,
) {
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
  newCampaign,
  updateCampaign,
  deleteCampaign,
  addScenarioResult,
};
