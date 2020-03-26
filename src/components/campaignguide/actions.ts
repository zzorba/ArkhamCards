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

export function setScenarioDecision(
  campaignId: number,
  scenario: string,
  step: string,
  value: boolean
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
  scenario: string,
  step: string,
  value: number
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
  scenario: string,
  step: string,
  supplies: SupplyCounts
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
  scenario: string,
  step: string,
  choices: ListChoices
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
  scenario: string,
  step: string,
  choice: number
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
