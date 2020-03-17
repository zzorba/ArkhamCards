import {
  GUIDE_SET_DECISION,
  GUIDE_SET_COUNT,
  GUIDE_SET_SUPPLIES,
  GUIDE_SET_INVESTIGATOR_CHOICE,
  GUIDE_RESET_SCENARIO,
  GuideSetDecisionAction,
  GuideSetCountAction,
  GuideSetSuppliesAction,
  GuideSetInvestigatorChoiceAction,
  GuideResetScenarioAction,
  SupplyCounts,
  InvestigatorChoices,
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

export function setScenarioInvestigatorChoice(
  campaignId: number,
  scenarioId: string,
  stepId: string,
  choices: InvestigatorChoices
): GuideSetInvestigatorChoiceAction {
  return {
    type: GUIDE_SET_INVESTIGATOR_CHOICE,
    campaignId,
    scenarioId,
    stepId,
    choices,
  };
}
