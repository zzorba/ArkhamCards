import { filter } from 'lodash';
import { ThunkAction } from 'redux-thunk';

import {
  UPDATE_CHAOS_BAG_RESULTS,
  ChaosBagResults,
  UpdateChaosBagResultsAction,
  AdjustBlessCurseAction,
  ADJUST_BLESS_CURSE,
  CampaignId,
  SealedToken,
} from '@actions/types';
import { ChaosTokenType } from '@app_constants';
import { AppState } from '@reducers';
import { ChaosBagActions } from '@data/remote/chaosBag';
import ChaosBagResultsT from '@data/interfaces/ChaosBagResultsT';
import { Campaign_Difficulty, Campaign_Difficulty_Enum, Chaos_Bag_Tarot_Mode_Enum } from '@generated/graphql/apollo-schema';


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
        tarot: chaosBagResults.tarot,
        difficulty: chaosBagResults.difficulty,
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




export function updateChaosBagDifficultyOverride(
  actions: ChaosBagActions,
  id: CampaignId,
  difficulty: Campaign_Difficulty_Enum | undefined,
  chaosBagResults: ChaosBagResultsT
): ThunkAction<void, AppState, unknown, UpdateChaosBagResultsAction> {
  return (dispatch) => {
    if (id.serverId) {
      actions.setDifficultyOverride(id, difficulty);
    } else {
      dispatch(updateChaosBagResults(id, {
        ...chaosBagResults,
        difficulty,
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

export function setBlessCurseChaosBagResults(
  actions: ChaosBagActions,
  id: CampaignId,
  bless: number,
  curse: number
): ThunkAction<void, AppState, unknown, AdjustBlessCurseAction> {
  return (dispatch) => {
    if (id.serverId) {
      actions.setBlessCurse(id, bless, curse);
    } else {
      dispatch({
        type: ADJUST_BLESS_CURSE,
        id,
        bless,
        curse,
        now: new Date(),
      });
    }
  };
}

