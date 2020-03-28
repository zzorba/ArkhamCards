import {
  GUIDE_SET_INPUT,
  GUIDE_RESET_SCENARIO,
  GUIDE_UNDO_INPUT,
  GuideSetInputAction,
  GuideResetScenarioAction,
  GuideUndoInputAction,
  SupplyCounts,
  ListChoices,
} from 'actions/types';

export function undo(
  campaignId: number
): GuideUndoInputAction {
  return {
    type: GUIDE_UNDO_INPUT,
    campaignId,
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
    },
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
  };
}

export function setScenarioChoiceList(
  campaignId: number,
  step: string,
  choices: ListChoices,
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
  };
}
