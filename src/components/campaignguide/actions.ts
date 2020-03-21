import {
  GUIDE_SET_DECISION,
  GUIDE_SET_COUNT,
  GUIDE_SET_SUPPLIES,
  GUIDE_SET_CHOICE,
  GUIDE_SET_CHOICE_LIST,
  GUIDE_RESET_SCENARIO,
  GuideSetDecisionAction,
  GuideSetCountAction,
  GuideSetSuppliesAction,
  GuideSetChoiceAction,
  GuideSetChoiceListAction,
  GuideResetScenarioAction,
  SupplyCounts,
  ListChoices,
} from 'actions/types';

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
  scenarioId: string,
  stepId: string,
  value: boolean
): GuideSetDecisionAction {
  return {
    type: GUIDE_SET_DECISION,
    campaignId,
    scenarioId,
    stepId,
    decision: value,
  };
}

export function setScenarioCount(
  campaignId: number,
  scenarioId: string,
  stepId: string,
  value: number
): GuideSetCountAction {
  return {
    type: GUIDE_SET_COUNT,
    campaignId,
    scenarioId,
    stepId,
    count: value,
  };
}

export function setScenarioSupplies(
  campaignId: number,
  scenarioId: string,
  stepId: string,
  supplyCounts: SupplyCounts
): GuideSetSuppliesAction {
  return {
    type: GUIDE_SET_SUPPLIES,
    campaignId,
    scenarioId,
    stepId,
    supplyCounts,
  };
}

export function setScenarioChoiceList(
  campaignId: number,
  scenarioId: string,
  stepId: string,
  choices: ListChoices
): GuideSetChoiceListAction {
  return {
    type: GUIDE_SET_CHOICE_LIST,
    campaignId,
    scenarioId,
    stepId,
    choices,
  };
}

export function setScenarioChoice(
  campaignId: number,
  scenarioId: string,
  stepId: string,
  choice: number
): GuideSetChoiceAction {
  return {
    type: GUIDE_SET_CHOICE,
    campaignId,
    scenarioId,
    stepId,
    choice,
  };
}
