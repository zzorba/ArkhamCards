import {
  GUIDE_SET_DECISION,
  GUIDE_SET_COUNT,
  GuideSetDecisionAction,
  GuideSetCountAction,
} from 'actions/types';

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
