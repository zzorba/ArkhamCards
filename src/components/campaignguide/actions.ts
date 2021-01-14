import { forEach, keys, map } from 'lodash';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
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
    dispatch(updateCampaign(campaignId, { serverId }));
  };
}
export function undo(
  campaignId: number,
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
  campaignId: number,
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
  campaignId: number,
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
  campaignId: number,
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
  campaignId: number,
  scenarioId: string
): GuideResetScenarioAction {
  return {
    type: GUIDE_RESET_SCENARIO,
    campaignId,
    scenarioId,
    now: new Date(),
  };
}

export function startScenario(
  campaignId: number,
  scenario: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'start_scenario',
      scenario,
      step: undefined,
    },
    now: new Date(),
  };
}


export function startSideScenario(
  campaignId: number,
  scenario: GuideStartSideScenarioInput | GuideStartCustomSideScenarioInput
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: scenario,
    now: new Date(),
  };
}

export function setScenarioDecision(
  campaignId: number,
  step: string,
  value: boolean,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'decision',
      scenario,
      step,
      decision: value,
    },
    now: new Date(),
  };
}

export function setInterScenarioData(
  campaignId: number,
  value: InvestigatorTraumaData,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'inter_scenario',
      scenario,
      investigatorData: value,
      step: undefined,
    },
    now: new Date(),
  };
}

export function setScenarioCount(
  campaignId: number,
  step: string,
  value: number,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'count',
      scenario,
      step,
      count: value,
    },
    now: new Date(),
  };
}

export function setScenarioSupplies(
  campaignId: number,
  step: string,
  supplies: SupplyCounts,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'supplies',
      scenario,
      step,
      supplies,
    },
    now: new Date(),
  };
}

export function setScenarioNumberChoices(
  campaignId: number,
  step: string,
  choices: NumberChoices,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'choice_list',
      scenario,
      step,
      choices,
    },
    now: new Date(),
  };
}

export function setScenarioStringChoices(
  campaignId: number,
  step: string,
  choices: StringChoices,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'string_choices',
      scenario,
      step,
      choices,
    },
    now: new Date(),
  };
}

export function setScenarioChoice(
  campaignId: number,
  step: string,
  choice: number,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'choice',
      scenario,
      step,
      choice,
    },
    now: new Date(),
  };
}

export function setScenarioText(
  campaignId: number,
  step: string,
  text: string,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'text',
      scenario,
      step,
      text,
    },
    now: new Date(),
  };
}

export function setCampaignLink(
  campaignId: number,
  step: string,
  decision: string,
  scenario?: string
): GuideSetInputAction {
  return {
    type: GUIDE_SET_INPUT,
    campaignId,
    input: {
      type: 'campaign_link',
      scenario,
      step,
      decision,
    },
    now: new Date(),
  };
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
