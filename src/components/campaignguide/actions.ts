import { forEach, values, map } from 'lodash';
import { Action } from 'redux';
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
  guideInputToId,
  DeckId,
  Campaign,
  UploadedCampaignId,
} from '@actions/types';
import { updateCampaign } from '@components/campaign/actions';
import { AppState, makeCampaignGuideStateSelector, makeCampaignSelector } from '@reducers';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { uploadCampaignDeckHelper } from '@lib/firebaseApi';
import fbdb from '@data/firebase/fbdb';

export function refreshCampaigns(
  user: FirebaseAuthTypes.User
): ThunkAction<Promise<boolean>, AppState, unknown, Action<string>> {
  return async(dispatch) => {
    const campaignIds: UploadedCampaignId[] = values((await fbdb.myCampaigns(user).once('value')).toJSON() || {});
    const removedCampaignIds: UploadedCampaignId[] = values((await fbdb.myRemovedCampaigns(user).once('value')).toJSON() || {});
    const campaigns = await Promise.all(map(campaignIds, campaignId => {
      return fbdb.campaign(campaignId).once('value');
    }));
    return true;
  };
}

function uploadCampaignHelper(
  campaign: Campaign,
  campaignId: UploadedCampaignId,
  guided: boolean,
  user: FirebaseAuthTypes.User,
): ThunkAction<void, AppState, unknown, UpdateCampaignAction> {
  return async(dispatch, getState) => {
    await fbdb.campaignDetail(campaignId).set(campaign);
    // Do something with deck uploads?
    if (guided) {
      const state = getState();
      const guide = makeCampaignGuideStateSelector()(state, campaign.uuid);
      const guideRef = fbdb.campaignGuide(campaignId);
      await Promise.all([
        ...map(guide.inputs, input => {
          return guideRef.child('inputs').child(guideInputToId(input)).set(input);
        }),
        ...map(guide.undo, undo => {
          guideRef.child('undo').child(undo).set(true);
        }),
      ]);
    }
    dispatch(updateCampaign(user, campaignId, { serverId: campaignId.serverId }));
    forEach(campaign.deckIds || [], deckId => {
      dispatch(uploadCampaignDeckHelper(campaignId, deckId, user));
    });
  };
}

export function uploadCampaign(
  user: FirebaseAuthTypes.User,
  createServerCampaign: (campaignId: string) => Promise<UploadedCampaignId>,
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
    const newCampaignId = await createServerCampaign(campaignId.campaignId);
    const guided = !!campaign.guided;
    if (campaign.linkUuid) {
      const campaignA = makeCampaignSelector()(state, campaign.linkUuid.campaignIdA);
      if (campaignA) {
        dispatch(uploadCampaignHelper(campaignA, { campaignId: campaignA.uuid, serverId: newCampaignId.serverId }, guided, user));
      }
      const campaignB = makeCampaignSelector()(state, campaign.linkUuid.campaignIdB);
      if (campaignB) {
        dispatch(uploadCampaignHelper(campaignB, { campaignId: campaignB.uuid, serverId: newCampaignId.serverId }, guided, user));
      }
    }
    dispatch(uploadCampaignHelper(campaign, newCampaignId, guided, user));
    return newCampaignId;
  };
}

export function undo(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  scenarioId: string
): GuideUndoInputAction {
  return {
    type: GUIDE_UNDO_INPUT,
    campaignId,
    scenarioId,
    now: new Date(),
  };
}

export function setBinaryAchievement(
  campaignId: CampaignId,
  achievementId: string,
  value: boolean,
): GuideUpdateAchievementAction {
  return {
    type: GUIDE_UPDATE_ACHIEVEMENT,
    campaignId,
    id: achievementId,
    operation: value ? 'set' : 'clear',
    now: new Date(),
  };
}

export function incCountAchievement(
  campaignId: CampaignId,
  achievementId: string,
  max?: number
): GuideUpdateAchievementAction {
  return {
    type: GUIDE_UPDATE_ACHIEVEMENT,
    campaignId,
    id: achievementId,
    operation: 'inc',
    max,
    now: new Date(),
  };
}

export function decCountAchievement(
  campaignId: CampaignId,
  achievementId: string,
  max?: number
): GuideUpdateAchievementAction {
  return {
    type: GUIDE_UPDATE_ACHIEVEMENT,
    campaignId,
    id: achievementId,
    operation: 'dec',
    max,
    now: new Date(),
  };
}

export function resetScenario(
  campaignId: CampaignId,
  scenarioId: string
): GuideResetScenarioAction {
  return {
    type: GUIDE_RESET_SCENARIO,
    campaignId,
    scenarioId,
    now: new Date(),
  };
}

function setGuideInputAction(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  input: GuideInput
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input,
    now: new Date(),
  };
}
export function startScenario(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  scenario: string
): GuideSetInputAction {
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
): GuideSetInputAction {
  return setGuideInputAction(user, campaignId, scenario);
}

export function setScenarioDecision(
  user: FirebaseAuthTypes.User | undefined,
  campaignId: CampaignId,
  step: string,
  value: boolean,
  scenario?: string
): GuideSetInputAction {
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
): GuideSetInputAction {
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
): GuideSetInputAction {
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
): GuideSetInputAction {
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
): GuideSetInputAction {
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
): GuideSetInputAction {
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
): GuideSetInputAction {
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
): GuideSetInputAction {
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
): GuideSetInputAction {
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
