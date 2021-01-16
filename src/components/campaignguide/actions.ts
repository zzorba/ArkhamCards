import { keys, map } from 'lodash';
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
} from '@actions/types';
import { updateCampaign } from '@components/campaign/actions';
import database from '@react-native-firebase/database';
import { AppState, makeCampaignGuideStateSelector, makeCampaignSelector } from '@reducers';

export function refreshCampaigns(userId: string): ThunkAction<void, AppState, null, Action> {
  return async(dispatch, getState) => {
    const campaignIds: string[] = keys((await database().ref('/user_campaigns').child(userId).child('campaigns').once('value')).val());
    Promise.all(map(campaignIds, campaignId => {
      return database().ref('/campaigns').child(campaignId).once('value');
    }));
    const state = getState();
  };
}

export function uploadCampaign(
  campaignId: number,
  serverId: string,
  guided: boolean
): ThunkAction<void, AppState, null, UpdateCampaignAction> {
  return async(dispatch, getState) => {
    const state = getState();
    const campaign = makeCampaignSelector()(state, campaignId);
    await database().ref('/campaigns').child(serverId).child('campaign').set(campaign);
    // Do something with deck uploads?
    if (guided) {
      const guide = makeCampaignGuideStateSelector()(state, campaignId);
      const ref = database().ref('/campaigns').child(serverId);
      const guideRef = ref.child('guide');
      await Promise.all([
        ...map(guide.inputs, input => {
          return guideRef.child('inputs').child(guideInputToId(input)).set(input);
        }),
        ...map(guide.undo, undo => {
          guideRef.child('undo').child(undo).set(true);
        }),
      ]);
    }
    dispatch(updateCampaign({ campaignId, serverId }, { serverId }));
  };
}

export function undo(
  { campaignId, serverId }: CampaignId,
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
  { campaignId, serverId }: CampaignId,
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
  { campaignId, serverId }: CampaignId,
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
  { campaignId, serverId }: CampaignId,
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
  { campaignId, serverId }: CampaignId,
  scenarioId: string
): GuideResetScenarioAction {
  return {
    type: GUIDE_RESET_SCENARIO,
    campaignId,
    scenarioId,
    now: new Date(),
  };
}

function setGuideInputAction({ campaignId, serverId }: CampaignId, input: GuideInput): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input,
    now: new Date(),
  };
}
export function startScenario(
  campaignId: CampaignId,
  scenario: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'start_scenario',
    scenario,
    step: undefined,
  });
}


export function startSideScenario(
  campaignId: CampaignId,
  scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput
): GuideSetInputAction {
  return setGuideInputAction(campaignId, scenario);
}

export function setScenarioDecision(
  campaignId: CampaignId,
  step: string,
  value: boolean,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'decision',
    scenario,
    step,
    decision: value,
  });
}

export function setInterScenarioData(
  campaignId: CampaignId,
  value: InvestigatorTraumaData,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'inter_scenario',
    scenario,
    investigatorData: value,
    step: undefined,
  });
}

export function setScenarioCount(
  campaignId: CampaignId,
  step: string,
  value: number,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'count',
    scenario,
    step,
    count: value,
  });
}

export function setScenarioSupplies(
  campaignId: CampaignId,
  step: string,
  supplies: SupplyCounts,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'supplies',
    scenario,
    step,
    supplies,
  });
}

export function setScenarioNumberChoices(
  campaignId: CampaignId,
  step: string,
  choices: NumberChoices,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'choice_list',
    scenario,
    step,
    choices,
  });
}

export function setScenarioStringChoices(
  campaignId: CampaignId,
  step: string,
  choices: StringChoices,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'string_choices',
    scenario,
    step,
    choices,
  });
}

export function setScenarioChoice(
  campaignId: CampaignId,
  step: string,
  choice: number,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'choice',
    scenario,
    step,
    choice,
  });
}

export function setScenarioText(
  campaignId: CampaignId,
  step: string,
  text: string,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
    type: 'text',
    scenario,
    step,
    text,
  });
}

export function setCampaignLink(
  campaignId: CampaignId,
  step: string,
  decision: string,
  scenario?: string
): GuideSetInputAction {
  return setGuideInputAction(campaignId, {
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
