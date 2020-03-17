import {
  GUIDE_SET_DECISION,
  GUIDE_SET_COUNT,
  GUIDE_SET_SUPPLIES,
  GUIDE_RESET_SCENARIO,
  GuideSetDecisionAction,
  GuideSetCountAction,
  GuideSetSuppliesAction,
  GuideResetScenarioAction,
  SupplyCounts,
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
