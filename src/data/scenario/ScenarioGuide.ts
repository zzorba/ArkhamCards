import { find, tail } from 'lodash';

import { BranchStep, InputStep, Step, Scenario, Resolution } from './types';
import ScenarioStateHelper from './ScenarioStateHelper';

/**
 * Wrapper utility to provide structured access to scenarios.
 */
export default class ScenarioGuide {
  scenario: Scenario;
  constructor(scenario: Scenario) {
    this.scenario = scenario;
  }

  step(id: string): Step | undefined {
    return find(this.scenario.steps, step => step.id === id);
  }

  resolution(id: string): Resolution | undefined {
    return find(this.scenario.resolutions || [], resolution => resolution.id === id);
  }

  setupSteps(scenarioState: ScenarioStateHelper) {
    this.scenario.setup
  }

  expandSteps(
    stepIds: string[],
    scenarioState: ScenarioStateHelper
  ): Step[] {
    if (!stepIds.length) {
      return [];
    }
    return this.expandStep(
      stepIds[0],
      scenarioState,
      tail(stepIds)
    );
  }

  expandStep(
    stepId: string,
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[]
  ): Step[] {
    const step = this.step(stepId);
    if (!step) {
      return this.expandSteps(remainingStepIds, scenarioState);
    }
    switch (step.type) {
      case 'branch': {
        return this.expandBranchStep(step, scenarioState, remainingStepIds);
      }
      case 'input':
        return this.expandInputStep(step, scenarioState, remainingStepIds);
      default:
        return [
          step,
          ...this.expandSteps(remainingStepIds, scenarioState),
        ];
    }
  }

  expandBranchStep(
    step: BranchStep,
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[]
  ): Step[] {
    switch (step.condition.type) {
      case 'campaign_log':
        if (scenarioState.hasDecision(step.id)) {
        }
        return [];
      case 'math':
        return [];
      case 'has_card':
        return [];
      case 'campaign_data': {
        switch (step.condition.campaign_data) {
          case 'difficulty':
          case 'scenario_completed':
          case 'chaos_bag':
          return [];
        }
      }
      case 'scenario_data': {
        switch (step.condition.scenario_data) {
           case 'player_count':
           case 'investigator':
           case 'any_resigned':
           case 'resolution':
           return [];
        }
      }
      case 'trauma': {
        return [];
      }
    }
  }

  expandInputStep(
    step: InputStep,
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[]
  ): Step[] {
    switch (step.input.type) {
      case 'supplies':
      case 'investigator_choice':
      case 'card_choice':
        // No sub-steps possible for this one.
        return [];
      case 'choose_one': {
        if (step.input.choices.length === 1) {
          // Binary prompt
          if (scenarioState.hasDecision(step.id)) {
            if (scenarioState.decision(step.id)) {
              const choice = step.input.choices[0];
              return this.expandSteps(
                [...(choice.steps || []), ...remainingStepIds],
                scenarioState
              );
            }
            return this.expandSteps(remainingStepIds, scenarioState);
          }
          return [];
        }
      }
      case 'use_supplies':
        // TODO: guide
      case 'choose_many':
      case 'counter':
      case 'investigator_counter':
        return [];
    }
  }
}
