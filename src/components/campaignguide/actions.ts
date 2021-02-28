import { forEach, map, omit } from 'lodash';
import { ThunkAction } from 'redux-thunk';

import {
  CampaignId,
  GuideInput,
  GUIDE_SET_INPUT,
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
  GuideAchievement,
} from '@actions/types';

import { AppState, makeCampaignGuideStateSelector, makeCampaignSelector } from '@reducers';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { uploadCampaignDeckHelper } from '@lib/firebaseApi';
import { CreateCampaignActions } from '@data/remote/campaigns';
import { Guide_Input_Insert_Input, Guide_Achievement_Insert_Input, Investigator_Data_Insert_Input } from '@generated/graphql/apollo-schema';

function guideInputToInsert(input: GuideInput, serverId: number): Guide_Input_Insert_Input {
  return {
    campaign_id: serverId,
    scenario: input.scenario,
    step: input.step,
    payload: omit(input, ['scenario', 'step']),
  };
}

function guideAchievementToInsert(a: GuideAchievement, serverId: number): Guide_Achievement_Insert_Input {
  return {
    campaign_id: serverId,
    achievement_id: a.id,
    bool_value: a.type === 'binary' ? a.value : undefined,
    value: a.type === 'count' ? a.value : undefined,
    type: a.type,
  };
}

function uploadCampaignHelper(
  campaign: Campaign,
  campaignId: UploadedCampaignId,
  guided: boolean,
  actions: CreateCampaignActions
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch, getState) => {
    // Do something with deck uploads?
    let inputs: Guide_Input_Insert_Input[] = [];
    let achievements: Guide_Achievement_Insert_Input[] = [];
    if (guided) {
      const state = getState();
      const guide = makeCampaignGuideStateSelector()(state, campaign.uuid);
      inputs = map(guide.inputs, input => guideInputToInsert(input, campaignId.serverId));
      achievements = map(guide.achievements || [], a => guideAchievementToInsert(a, campaignId.serverId));
    }
    const investigator_data: Investigator_Data_Insert_Input[] = [];
    forEach(campaign.investigatorData, (data, investigator) => {
      if (!data) {
        return;
      }
      investigator_data.push({
        campaign_id: campaignId.serverId,
        investigator,
        addedCards: data.addedCards,
        removedCards: data.removedCards,
        storyAssets: data.storyAssets,
        ignoreStoryAssets: data.ignoreStoryAssets,
        insane: data.insane,
        killed: data.killed,
        mental: data.mental,
        physical: data.physical,
        specialXp: data.specialXp,
        spentXp: data.spentXp,
        availableXp: data.availableXp,
      });
    });
    await actions.uploadNewCampaign({
      variables: {
        campaignId: campaignId.serverId,
        name: campaign.name,
        cycleCode: campaign.cycleCode,
        standaloneId: campaign.standaloneId,
        difficulty: campaign.difficulty,
        chaosBag: campaign.chaosBag,
        inputs,
        achievements,
        investigator_data,
        campaignNotes: campaign.campaignNotes,
        nonDeckInvestigators: campaign.nonDeckInvestigators,
        scenarioResults: campaign.scenarioResults,
        showInterludes: campaign.showInterludes,
        weaknessSet: campaign.weaknessSet,
      },
    });
    dispatch({
      type: UPDATE_CAMPAIGN,
      id: campaignId,
      campaign: { serverId: campaignId.serverId },
      now: new Date(),
    });
    forEach(campaign.deckIds || [], deckId => {
      dispatch(uploadCampaignDeckHelper(campaignId, deckId, actions.createDeckActions));
    });
  };
}

export function uploadCampaign(
  user: FirebaseAuthTypes.User,
  actions: CreateCampaignActions,
  campaignId: CampaignId
): ThunkAction<Promise<UploadedCampaignId>, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch, getState): Promise<UploadedCampaignId> => {
    const state = getState();
    if (campaignId.serverId) {
      return campaignId;
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
        dispatch(uploadCampaignHelper(campaignA, ids.campaignIdA, guided, actions));
      }
      const campaignB = makeCampaignSelector()(state, campaign.linkUuid.campaignIdB);
      if (campaignB) {
        dispatch(uploadCampaignHelper(campaignB, ids.campaignIdB, guided, actions));
      }
      dispatch(uploadCampaignHelper(campaign, ids.campaignId, guided, actions));
      return ids.campaignId;
    }
    const newCampaignId = await actions.createCampaign(campaignId.campaignId, guided);
    dispatch(uploadCampaignHelper(campaign, newCampaignId, guided, actions));
    return newCampaignId;
  };
}

export function undo(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  scenarioId: string
): ThunkAction<void, AppState, unknown, GuideUndoInputAction> {
  return (dispatch) => {
    dispatch({
      type: GUIDE_UNDO_INPUT,
      campaignId,
      scenarioId,
      now: new Date(),
    });
  };
}

function updateAchievement(
  user: FirebaseAuthTypes.User | undefined,
  action: GuideUpdateAchievementAction
): ThunkAction<void, AppState, unknown, GuideUpdateAchievementAction> {
  return (dispatch) => {
    dispatch(action);
  };
}

export function setBinaryAchievement(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  achievementId: string,
  value: boolean,
): ThunkAction<void, AppState, unknown, GuideUpdateAchievementAction> {
  return updateAchievement(user, {
    type: GUIDE_UPDATE_ACHIEVEMENT,
    campaignId,
    id: achievementId,
    operation: value ? 'set' : 'clear',
    now: new Date(),
  });
}

export function incCountAchievement(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  achievementId: string,
  max?: number
): ThunkAction<void, AppState, unknown, GuideUpdateAchievementAction> {
  return updateAchievement(user, {
    type: GUIDE_UPDATE_ACHIEVEMENT,
    campaignId,
    id: achievementId,
    operation: 'inc',
    max,
    now: new Date(),
  });
}

export function decCountAchievement(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  achievementId: string,
  max?: number
): ThunkAction<void, AppState, unknown, GuideUpdateAchievementAction> {
  return updateAchievement(user, {
    type: GUIDE_UPDATE_ACHIEVEMENT,
    campaignId,
    id: achievementId,
    operation: 'dec',
    max,
    now: new Date(),
  });
}

export function resetScenario(
  user: FirebaseAuthTypes.User | undefined,
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
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  input: GuideInput
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return async(dispatch) => {
    if (user && campaignId.serverId) {
      /*
      const guideRef = fbdb.campaignGuide(campaignId);
      const id = guideInputToId(input);
      await Promise.all([
        guideRef.child('inputs').child(id).set(input),
        guideRef.child('undo').child(id).remove(),
        guideRef.child('lastUpdated').set(new Date()),
      ]);*/
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
export function startScenario(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  scenario: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'start_scenario',
    scenario,
    step: undefined,
  });
}


export function startSideScenario(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, scenario);
}

export function setScenarioDecision(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  value: boolean,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'decision',
    scenario,
    step,
    decision: value,
  });
}

export function setInterScenarioData(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  value: InvestigatorTraumaData,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'inter_scenario',
    scenario,
    investigatorData: value,
    step: undefined,
  });
}

export function setScenarioCount(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  value: number,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'count',
    scenario,
    step,
    count: value,
  });
}

export function setScenarioSupplies(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  supplies: SupplyCounts,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'supplies',
    scenario,
    step,
    supplies,
  });
}

export function setScenarioNumberChoices(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  choices: NumberChoices,
  deckId?: DeckId,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'choice_list',
    scenario,
    step,
    choices,
    deckId,
  });
}

export function setScenarioStringChoices(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  choices: StringChoices,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'string_choices',
    scenario,
    step,
    choices,
  });
}

export function setScenarioChoice(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  choice: number,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'choice',
    scenario,
    step,
    choice,
  });
}

export function setScenarioText(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  text: string,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
    type: 'text',
    scenario,
    step,
    text,
  });
}

export function setCampaignLink(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  decision: string,
  scenario?: string
): ThunkAction<void, AppState, unknown, GuideSetInputAction> {
  return setGuideInputAction(user, campaignId, {
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
  incCountAchievement,
  decCountAchievement,
};
