import { find, flatMap, tail } from 'lodash';

import { BranchStep, Effect, InputStep, Step, Scenario, Resolution } from './types';
import ScenarioStateHelper from './ScenarioStateHelper';
import CampaignGuide from './CampaignGuide';

/**
 * Wrapper utility to provide structured access to scenarios.
 */
export default class ScenarioGuide {
  scenario: Scenario;
  campaignGuide: CampaignGuide;

  constructor(scenario: Scenario, campaignGuide: CampaignGuide) {
    this.scenario = scenario;
    this.campaignGuide = campaignGuide;
  }

  step(id: string): Step | undefined {
    return find(this.scenario.steps, step => step.id === id);
  }

  resolution(id: string): Resolution | undefined {
    return find(this.scenario.resolutions || [], resolution => resolution.id === id);
  }

  encounterSets(scenarioState: ScenarioStateHelper): string[] {
    return flatMap(
      this.setupSteps(scenarioState),
      step => {
        if (step.type === 'encounter_sets') {
          return step.encounter_sets;
        }
        return []
      }
    );
  }

  setupSteps(scenarioState: ScenarioStateHelper): Step[] {
    return this.expandSteps(
      this.scenario.setup,
      scenarioState,
      []
    );
  }

  expandSteps(
    stepIds: string[],
    scenarioState: ScenarioStateHelper,
    result: Step[]
  ): Step[] {
    if (!stepIds.length) {
      return result;
    }
    return this.expandStep(
      stepIds[0],
      scenarioState,
      tail(stepIds),
      result,
    );
  }

  expandStep(
    stepId: string,
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[],
    result: Step[]
  ): Step[] {
    const step = this.step(stepId);
    if (!step) {
      console.log(`Missing step: ${stepId}`);
      return this.expandSteps(
        remainingStepIds,
        scenarioState,
        result
      );
    }
    switch (step.type) {
      case 'branch': {
        return this.expandBranchStep(
          step,
          scenarioState,
          remainingStepIds,
          result
        );
      }
      case 'input':
        return this.expandInputStep(
          step,
          scenarioState,
          remainingStepIds,
          result
        );
      case 'story':
      case 'encounter_sets':
      case 'rule_reminder':
      case 'location_setup':
        // No effects on this one.
        return this.expandSteps(
          remainingStepIds,
          scenarioState,
          [...result, step]
        );
      default:
        return this.handleEffects(
          step.id,
          remainingStepIds,
          scenarioState,
          [...result, step],
          step.effects || []
        );
    }
  }

  expandBranchStep(
    step: BranchStep,
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[],
    result: Step[]
  ): Step[] {
    switch (step.condition.type) {
      case 'check_supplies': {
        switch (step.condition.investigator) {
          case 'choice':
            // TODO: check supplies, needs an investigator AND a has supplies test.
            return result;
        }
      }
      case 'campaign_log_section_exists':
        return this.decisionTest(
          step,
          scenarioState,
          remainingStepIds,
          result,
          find(step.condition.options, option => option.boolCondition === true),
          find(step.condition.options, option => option.boolCondition === false)
        );
      case 'campaign_log':
        return this.decisionTest(
          step,
          scenarioState,
          remainingStepIds,
          result,
          find(step.condition.options, option => option.boolCondition === true),
          find(step.condition.options, option => option.boolCondition === false)
        );
      case 'campaign_log_count':
        if (scenarioState.hasCount(step.id)) {
          const count = scenarioState.count(step.id);
          const choice =
            find(step.condition.options, option => option.numCondition === count) ||
            step.condition.defaultOption;
          const extraSteps = choice.steps || [];
          return this.handleEffects(
            step.id,
            [
              ...extraSteps,
              ...remainingStepIds,
            ],
            scenarioState,
            [...result, step],
            choice.effects || []
          );
        }
        // No decision return here.
        return [...result, step];
      case 'math':
        // TODO: handle math
        return [...result, step];
      case 'campaign_data': {
        // TODO: handle campaign_data
        switch (step.condition.campaign_data) {
          case 'difficulty':
          case 'scenario_completed':
          case 'chaos_bag':
          case 'investigator':
            return [...result, step];
        }
      }
      case 'scenario_data': {
        switch (step.condition.scenario_data) {
           case 'player_count':
           case 'investigator':
            return [...result, step];
        }
      }
      case 'has_card': {
        // Generally only has steps.
        // Occasionally wil have a trauma effect.
        switch (step.condition.investigator) {
          case 'defeated':
          case 'any':
            // For now we'll just ask the question.
            return this.decisionTest(
              step,
              scenarioState,
              remainingStepIds,
              result,
              find(step.condition.options, option => option.boolCondition === true),
              find(step.condition.options, option => option.boolCondition === false || !!option.default)
            );
        }
      }
      case 'trauma': {
        return this.decisionTest(
          step,
          scenarioState,
          remainingStepIds,
          result,
          find(step.condition.options, option => option.boolCondition === true),
          find(step.condition.options, option => option.boolCondition === false || !!option.default)
        );
      }
    }
  }

  expandInputStep(
    step: InputStep,
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[],
    result: Step[]
  ): Step[] {
    switch (step.input.type) {
      case 'counter':
        if (scenarioState.hasCount(step.id)) {
          return this.handleEffects(
            step.id,
            remainingStepIds,
            scenarioState,
            [...result, step],
            step.input.effects
          );
        }
        return [...result, step];
      case 'investigator_choice':
        if (scenarioState.hasChoiceList(step.id)) {
          // TODO: need to handle random basic weakness effects for the investigator.
          return this.expandSteps(
            remainingStepIds,
            scenarioState,
            [...result, step]
          );
        }
        return [...result, step];
      case 'supplies':
        if (scenarioState.hasSupplies(step.id)) {
          // No effects for supplies entry.
          return this.expandSteps(
            remainingStepIds,
            scenarioState,
            [...result, step]
          );
        }
        return [...result, step];
      case 'investigator_counter':
      case 'card_choice':
        if (scenarioState.hasChoiceList(step.id)) {
          // Only simple effects here, nothing with branches
          return this.expandSteps(
            remainingStepIds,
            scenarioState,
            [...result, step]
          );
        }
        return [...result, step];
      case 'choose_many':
        // TODO: used by inner-circle, needs to iterate until # of choices = 3
        return [...result, step];
      case 'choose_one': {
        if (step.input.choices.length === 1) {
          const choice = step.input.choices[0];
          return this.decisionTest(
            step,
            scenarioState,
            remainingStepIds,
            result,
            choice
          );
        }

        // Multiple choice prompt
        if (scenarioState.hasChoice(step.id)) {
          const index = scenarioState.choice(step.id);
          const choice = step.input.choices[index];
          return this.handleEffects(
            step.id,
            [...(choice.steps || []), ...remainingStepIds],
            scenarioState,
            [...result, step],
            choice.effects || []
          );
        }
        // No decision yet, so stop here
        return [...result, step];
      }
      case 'use_supplies':
        // TODO: guide
        return [...result, step];
    }
  }

  decisionTest(
    step: Step,
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[],
    result: Step[],
    ifTrue?: { steps?: null | string[], effects?: null | Effect[] },
    ifFalse?: { steps?: null| string[], effects?: null | Effect[] }
  ): Step[] {
    if (scenarioState.hasDecision(step.id)) {
      const resultCondition = scenarioState.decision(step.id) ? ifTrue : ifFalse;
      return this.handleEffects(
        step.id,
        [
          ...((resultCondition && resultCondition.steps) || []),
          ...remainingStepIds,
        ],
        scenarioState,
        [...result, step],
        (resultCondition && resultCondition.effects) || []
      );
    }
    // No decision, stop here
    return [...result, step];
  }

  handleEffects(
    id: string,
    remainingStepIds: string[],
    scenarioState: ScenarioStateHelper,
    result: Step[],
    effects: Effect[]
  ): Step[] {
    if (effects && effects.length) {
      const hasChoiceList = !!find(effects, effect => (
        effect.type === 'add_card' && effect.investigator === 'choice'
      ));
      if (hasChoiceList && !scenarioState.hasChoice(`${id}_investigator`)) {
        return result;
      }
    }
    return this.expandSteps(remainingStepIds, scenarioState, result);
  }
}
