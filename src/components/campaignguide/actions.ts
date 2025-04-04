import { map } from 'lodash';
import { ThunkAction } from 'redux-thunk';

import {
  CampaignId,
  GuideInput,
  GUIDE_SET_INPUT,
  GUIDE_UPDATE_INPUT,
  GUIDE_RESET_SCENARIO,
  GUIDE_UNDO_INPUT,
  UpdateCampaignAction,
  GuideSetInputAction,
  GuideResetScenarioAction,
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
  GuideUndoInputAction,
  SupplyCounts,
  NumberChoices,
  StringChoices,
  InvestigatorTraumaData,
  GUIDE_UPDATE_ACHIEVEMENT,
  GuideUpdateAchievementAction,
  DeckId,
  Campaign,
  UploadedCampaignId,
  UPDATE_CAMPAIGN,
  DelayedDeckEdits,
  EmbarkData,
  GuideUpdeateInputAction,
} from '@actions/types';

import { AppState, makeCampaignGuideStateSelector, makeCampaignSelector, makeChaosBagResultsSelector } from '@reducers';
import { CreateCampaignActions, GuideActions } from '@data/remote/campaigns';
import { DeckActions, uploadCampaignDeckHelper } from '@data/remote/decks';
import CampaignGuideStateT from '@data/interfaces/CampaignGuideStateT';

function uploadCampaignHelper(
  campaign: Campaign,
  campaignId: UploadedCampaignId,
  guided: boolean,
  actions: CreateCampaignActions,
  deckActions: DeckActions
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch, getState) => {
    // Do something with deck uploads?
    const state = getState();
    const chaosBagResults = makeChaosBagResultsSelector()(state, campaign.uuid);
    if (guided) {
      const guide = makeCampaignGuideStateSelector()(state, campaign.uuid);
      await actions.uploadNewCampaign(campaignId.serverId, campaign, chaosBagResults, guide);
    } else {
      await actions.uploadNewCampaign(campaignId.serverId, campaign, chaosBagResults, undefined);
    }
    dispatch({
      type: UPDATE_CAMPAIGN,
      id: campaignId,
      campaign: { serverId: campaignId.serverId },
      now: new Date(),
    });
    await Promise.all(map(campaign.deckIds || [], deckId => {
      return dispatch(uploadCampaignDeckHelper(campaignId, deckId, deckActions));
    }));
  };
}

type UploadCampaignResult = {
  type: 'linked';
  ids: {
    campaignId: UploadedCampaignId;
    campaignIdA: UploadedCampaignId;
    campaignIdB: UploadedCampaignId;
  };
} | {
  type: 'single';
  id: UploadedCampaignId;
}

export function uploadCampaign(
  actions: CreateCampaignActions,
  deckActions: DeckActions,
  campaignId: CampaignId
): ThunkAction<Promise<UploadCampaignResult>, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch, getState): Promise<UploadCampaignResult> => {
    const state = getState();
    if (campaignId.serverId) {
      return {
        type: 'single',
        id: campaignId,
      };
    }
    const campaign = makeCampaignSelector()(state, campaignId.campaignId);
    if (!campaign) {
      throw new Error('Something went wrong');
    }
    const guided = !!campaign.guided;
    if (campaign.linkUuid) {
      const ids = await actions.createLinkedCampaign(campaignId.campaignId, campaign.linkUuid, guided);
      const campaignA = makeCampaignSelector()(state, campaign.linkUuid.campaignIdA);
      if (campaignA) {
        dispatch(uploadCampaignHelper(campaignA, ids.campaignIdA, guided, actions, deckActions));
      }
      const campaignB = makeCampaignSelector()(state, campaign.linkUuid.campaignIdB);
      if (campaignB) {
        dispatch(uploadCampaignHelper(campaignB, ids.campaignIdB, guided, actions, deckActions));
      }
      dispatch(uploadCampaignHelper(campaign, ids.campaignId, guided, actions, deckActions));
      return {
        type: 'linked',
        ids,
      };
    }
    const newCampaignId = await actions.createCampaign(campaignId.campaignId, guided);
    dispatch(uploadCampaignHelper(campaign, newCampaignId, guided, actions, deckActions));
    return {
      type: 'single',
      id: newCampaignId,
    };
  };
}

export function undo(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  scenarioId: string,
  campaignState: CampaignGuideStateT
): ThunkAction<void, AppState, unknown, GuideUndoInputAction> {
  return async(dispatch) => {
    if (userId && campaignId.serverId) {
      const undoInputs = campaignState.undoInputs(scenarioId);
      if (undoInputs.length) {
        await actions.removeInputs(campaignId, undoInputs);
      }
    } else {
      dispatch({
        type: GUIDE_UNDO_INPUT,
        campaignId,
        scenarioId,
        now: new Date(),
      });
    }
  };
}

function updateAchievement(
  userId: string | undefined,
  action: GuideUpdateAchievementAction
): ThunkAction<void, AppState, unknown, GuideUpdateAchievementAction> {
  return (dispatch) => {
    dispatch(action);
  };
}

export function setBinaryAchievement(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  achievementId: string,
  value: boolean,
): ThunkAction<void, AppState, unknown, GuideUpdateAchievementAction> {
  return async(dispatch) => {
    if (userId && campaignId.serverId) {
      await actions.setBinaryAchievement(campaignId, achievementId, value);
    } else {
      dispatch(
        updateAchievement(userId, {
          type: GUIDE_UPDATE_ACHIEVEMENT,
          campaignId,
          id: achievementId,
          operation: value ? 'set' : 'clear',
          now: new Date(),
        })
      );
    }
  };
}

export function setCountAchievement(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  achievementId: string,
  value: number
): ThunkAction<void, AppState, unknown, GuideUpdateAchievementAction> {
  return async(dispatch) => {
    if (userId && campaignId.serverId) {
      await actions.setCountAchievement(campaignId, achievementId, value);
    } else {
      dispatch(updateAchievement(userId, {
        type: GUIDE_UPDATE_ACHIEVEMENT,
        campaignId,
        id: achievementId,
        operation: 'set_value',
        value,
        now: new Date(),
      }));
    }
  };
}

export function resetScenario(
  userId: string | undefined,
  campaignId: CampaignId,
  scenarioId: string
): ThunkAction<void, AppState, unknown, GuideResetScenarioAction> {
  return (dispatch) => {
    dispatch({
      type: GUIDE_RESET_SCENARIO,
      campaignId,
      scenarioId,
      now: new Date(),
    });
  };
}

function setGuideInputAction(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  input: GuideInput
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return async(dispatch) => {
    if (userId && campaignId.serverId) {
      await actions.setInput(campaignId, input);
    } else {
      dispatch({
        type: GUIDE_SET_INPUT,
        campaignId,
        input,
        now: new Date(),
      });
    }
  };
}

function updateGuideInputAction(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  input: GuideInput
): ThunkAction<void, AppState, unknown, GuideUpdeateInputAction> {
  return async(dispatch) => {
    if (userId && campaignId.serverId) {
      await actions.setInput(campaignId, input);
    } else {
      dispatch({
        type: GUIDE_UPDATE_INPUT,
        campaignId,
        input,
        now: new Date(),
      });
    }
  };
}
export function startScenario(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  scenario: string,
  embarkData: EmbarkData | undefined
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'start_scenario',
    scenario,
    step: undefined,
    embarkData,
  });
}


export function startSideScenario(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, scenario);
}

export function setScenarioDecision(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  value: boolean,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'decision',
    scenario,
    step,
    decision: value,
  });
}

export function setInterScenarioData(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  value: InvestigatorTraumaData,
  scenario: string | undefined,
  campaignLogEntries: string[] | undefined
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'inter_scenario',
    scenario,
    investigatorData: value,
    campaignLogEntries,
    step: undefined,
  });
}

export function setScenarioCount(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  value: number,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'count',
    scenario,
    step,
    count: value,
  });
}

export function setScenarioSupplies(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  supplies: SupplyCounts,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'supplies',
    scenario,
    step,
    supplies,
  });
}

export function setScenarioNumberChoices(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  choices: NumberChoices,
  deckId?: DeckId,
  deckEdits?: DelayedDeckEdits,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'choice_list',
    scenario,
    step,
    choices,
    deckId,
    deckEdits,
  });
}

export function setScenarioStringChoices(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  choices: StringChoices,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'string_choices',
    scenario,
    step,
    choices,
  });
}

export function setScenarioChoice(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  choice: number,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'choice',
    scenario,
    step,
    choice,
  });
}

export function setScenarioText(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  text: string,
  scenario: string | undefined,
  inputId: string | undefined,
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'text',
    scenario,
    step,
    text,
    inputId,
  });
}

export function updateScenarioText(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  text: string,
  scenario: string | undefined,
  inputId: string | undefined,
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return updateGuideInputAction(userId, actions, campaignId, {
    type: 'text',
    scenario,
    step,
    text,
    inputId,
  });
}

export function setCampaignLink(
  userId: string | undefined,
  actions: GuideActions,
  campaignId: CampaignId,
  step: string,
  decision: string,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(userId, actions, campaignId, {
    type: 'campaign_link',
    scenario,
    step,
    decision,
  });
}

export default {
  startScenario,
  startSideScenario,
  resetScenario,
  setScenarioCount,
  setScenarioDecision,
  setScenarioChoice,
  setScenarioSupplies,
  setScenarioNumberChoices,
  setScenarioStringChoices,
  setScenarioText,
  setInterScenarioData,
  setCampaignLink,
  undo,
  setBinaryAchievement,
  setCountAchievement,
  updateScenarioText,
};
