import {
  GUIDE_SET_COUNT,
  GUIDE_SET_DECISION,
  GUIDE_CLEAR_COUNT,
  GUIDE_CLEAR_DECISION,
  GUIDE_RESET_SCENARIO,
  LOGOUT,
  GuideActions,
  GuideState,
  ScenarioState,
  DEFAULT_SCENARIO_STATE,
} from 'actions/types';

export interface GuidesState {
  all: {
    [campaignId: string]: GuideState;
  };
}

const DEFAULT_GUIDES_STATE: GuidesState = {
  all: {},
};

function getGuide(id: number, state: GuidesState): GuideState {
  return state.all[id] || {
    scenarios: {},
  };
}

function updateScenario(
  state: GuidesState,
  campaignId: number,
  scenarioId: string,
  update: (scenario: ScenarioState) => ScenarioState
): GuidesState {
  const guide = getGuide(campaignId, state);
  const scenario = guide.scenarios[scenarioId] || DEFAULT_SCENARIO_STATE;
  return {
    ...state,
    all: {
      ...state.all,
      [campaignId]: {
        ...guide,
        scenarios: {
          ...guide.scenarios,
          [scenarioId]: update(scenario),
        },
      },
    },
  };
}

export default function(
  state: GuidesState = DEFAULT_GUIDES_STATE,
  action: GuideActions
): GuidesState {
  if (action.type === LOGOUT) {
    return state;
  }
  return updateScenario(state, action.campaignId, action.scenarioId,
    (scenario: ScenarioState) => {
      if (action.type === GUIDE_SET_COUNT) {
        return {
          ...scenario,
          counts: {
            ...scenario.counts,
            [action.stepId]: action.count,
          },
        };
      }
      if (action.type === GUIDE_CLEAR_COUNT) {
        const newCounts = {
          ...scenario.counts,
        };
        delete newCounts[action.stepId];
        return {
          ...scenario,
          counts: newCounts,
        };
      }

      if (action.type === GUIDE_SET_DECISION) {
        return {
          ...scenario,
          decisions: {
            ...scenario.decisions,
            [action.stepId]: action.decision,
          },
        };
      }
      if (action.type === GUIDE_CLEAR_DECISION) {
        const newDecisions = {
          ...scenario.decisions,
        };
        delete newDecisions[action.stepId];
        return {
          ...scenario,
          decisions: newDecisions,
        };
      }
      if (action.type === GUIDE_RESET_SCENARIO) {
        return DEFAULT_SCENARIO_STATE;
      }
      return scenario;
    }
  );
}
