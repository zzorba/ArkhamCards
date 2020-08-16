import {
  GUIDE_SET_INPUT,
  GUIDE_RESET_SCENARIO,
  GUIDE_UNDO_INPUT,
  GuideSetInputAction,
  GuideResetScenarioAction,
  GuideStartSideScenarioInput,
  GuideStartCustomSideScenarioInput,
  GuideUndoInputAction,
  SupplyCounts,
  NumberChoices,
  StringChoices,
  InvestigatorTraumaData,
} from '@actions/types';

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
