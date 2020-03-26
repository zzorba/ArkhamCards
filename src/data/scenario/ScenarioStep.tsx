import { groupBy, flatMap, find, forEach, map, sortBy, sortedUniq } from 'lodash';

import { ListChoices } from 'actions/types';
import {
  BranchStep,
  CardCondition,
  CheckSuppliesCondition,
  CampaignDataCondition,
  InputStep,
  MathCondition,
  Operand,
  ScenarioDataCondition,
  Step,
  Effect,
} from './types';
import ScenarioGuide from './ScenarioGuide';
import GuidedCampaignLog, { EffectsWithInput } from './GuidedCampaignLog';
import ScenarioStateHelper from './ScenarioStateHelper';

export default class ScenarioStep {
  step: Step;
  scenarioGuide: ScenarioGuide;
  campaignLog: GuidedCampaignLog;
  remainingStepIds: string[];
  fullyGuided: boolean = true;

  constructor(
    step: Step,
    scenarioGuide: ScenarioGuide,
    campaignLog: GuidedCampaignLog,
    remainingStepIds: string[]
  ) {
    this.step = step;
    this.scenarioGuide = scenarioGuide;
    this.campaignLog = campaignLog;
    this.remainingStepIds = remainingStepIds;
  }

  nextStep(
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    switch (this.step.type) {
      case 'branch': {
        return this.expandBranchStep(
          this.step,
          scenarioState
        );
      }
      case 'input':
        return this.expandInputStep(
          this.step,
          scenarioState
        );
      case 'story':
      case 'encounter_sets':
      case 'rule_reminder':
      case 'location_setup':
        return this.proceedToNextStep(this.remainingStepIds);
      case 'resolution': {
        const resolution = this.scenarioGuide.resolution(this.step.resolution);
        if (!resolution) {
          throw new Error(`Unknown resolution: ${this.step.resolution}`);
        }
        return this.proceedToNextStep(
          [...resolution.steps, ...this.remainingStepIds]
        );
      }
      default:
        return this.handleEffects(
          this.step.id,
          this.remainingStepIds,
          scenarioState,
          [{
            effects: this.step.effects || [],
          }]
        );
    }
  }


  private expandBranchStep(
    step: BranchStep,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    switch (step.condition.type) {
      case 'check_supplies': {
        return this.handleCheckSupplies(
          step,
          step.condition,
          scenarioState
        );
      }
      case 'campaign_log_section_exists':
      case 'campaign_log':
        const ifTrue = find(step.condition.options, option => option.boolCondition === true);
        const ifFalse = find(step.condition.options, option => option.boolCondition === false);
        if (this.fullyGuided) {
          return this.binaryBranch(
            step.condition.type === 'campaign_log' ?
              this.campaignLog.check(step.condition.section, step.condition.id) :
              this.campaignLog.sectionExists(step.condition.section),
            scenarioState,
            this.remainingStepIds,
            ifTrue,
            ifFalse
          );
        } else {
          return this.decisionTest(
            scenarioState,
            this.remainingStepIds,
            ifTrue,
            ifFalse
          );
        }
      case 'campaign_log_count': {
        const inputCount = scenarioState.count(step.id);
        if (!this.fullyGuided && inputCount === undefined) {
          return undefined;
        }
        const count = this.fullyGuided ?
          this.campaignLog.count(step.condition.section, step.condition.id) :
          inputCount;
        const choice =
          find(step.condition.options, option => option.numCondition === count) ||
          step.condition.defaultOption;
        const extraSteps = choice.steps || [];
        return this.handleEffects(
          step.id,
          [
            ...extraSteps,
            ...this.remainingStepIds,
          ],
          scenarioState,
          [{
            counterInput: count,
            effects: choice.effects || [],
          }]
        );
      }
      case 'math':
        // TODO: handle math
        return this.handleMath(
          step,
          step.condition,
          scenarioState
        );
      case 'campaign_data': {
        return this.handleCampaignData(
          step,
          step.condition,
          scenarioState
        );
      }
      case 'scenario_data': {
        return this.handleScenarioDataCondition(
          step,
          step.condition,
          scenarioState
        );
      }
      case 'has_card': {
        return this.handleCardCondition(
          step,
          step.condition,
          scenarioState
        );
      }
      case 'trauma': {
        // TODO: fullyGuided
        return this.decisionTest(
          scenarioState,
          this.remainingStepIds,
          find(step.condition.options, option => option.boolCondition === true),
          find(step.condition.options, option => option.boolCondition === false || !!option.default)
        );
      }
    }
  }

  private getOperand(op: Operand): number {
    switch (op.type) {
      case 'campaign_log_count':
        return this.campaignLog.count(op.section, '$count');
      case 'chaos_bag':
        // TODO: chaos bag
        return 0;
    }
  }

  private performOp(
    opA: number,
    opB: number,
    operation: 'compare' | 'sum'
  ): number {
    switch (operation) {
      case 'compare':
        if (opA < opB) {
          return -1;
        }
        if (opA === opB) {
          return 0;
        }
        return 1;
      case 'sum':
        return opA + opB;
    }
  }

  private handleMath(
    step: BranchStep,
    condition: MathCondition,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    const opA = this.getOperand(condition.opA);
    const opB = this.getOperand(condition.opB);
    const value = this.performOp(opA, opB, condition.operation);
    const option = find(condition.options, option => option.numCondition === value) ||
      condition.defaultOption;
    const extraSteps = option.steps || [];
    return this.handleEffects(
      step.id,
      [...extraSteps, ...this.remainingStepIds],
      scenarioState,
      [{
        effects: option.effects || [],
      }]
    );
  }

  private handleCampaignData(
    step: BranchStep,
    condition: CampaignDataCondition,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    switch (condition.campaign_data) {
      case 'difficulty':
      case 'scenario_completed':
      case 'chaos_bag':
      case 'investigator':
        return undefined;
    }
  }


  private handleCardCondition(
    step: BranchStep,
    condition: CardCondition,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    // TODO: fullyGuided
    // Generally only has steps.
    // Occasionally will have a trauma effect.
    switch (condition.investigator) {
      case 'defeated':
      case 'any':
        // For now we'll just ask the question.
        return this.decisionTest(
          scenarioState,
          this.remainingStepIds,
          find(step.condition.options, option => option.boolCondition === true),
          find(step.condition.options, option => option.boolCondition === false || !!option.default)
        );
    }
  }

  private handleScenarioDataCondition(
    step: BranchStep,
    condition: ScenarioDataCondition,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    switch (condition.scenario_data) {
      case 'player_count':
        const playerCount = scenarioState.playerCount();
        const option = find(condition.options, option => option.numCondition === playerCount) ||
          find(condition.options, option => !!option.default);
        const extraSteps = (option && option.steps) || [];
        return this.handleEffects(
          step.id,
          [...extraSteps, ...this.remainingStepIds],
          scenarioState,
          [{
            effects: (option && option.effects) || [],
          }]
        );
      case 'investigator':
        // TODO: make work in fully guided mode.
        if (condition.options.length === 1 && condition.options[0].condition) {
          return this.decisionTest(
            scenarioState,
            this.remainingStepIds,
            condition.options[0]
          );
        }
        // TODO: shouldn't actually happen.
        return undefined;
    }
  }

  private handleCheckSupplies(
    step: BranchStep,
    condition: CheckSuppliesCondition,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    if (this.fullyGuided) {
      // TODO: supplies
      return undefined;
    } else {
      switch (condition.investigator) {
        case 'any':
          return this.decisionTest(
            scenarioState,
            this.remainingStepIds,
            find(step.condition.options, option => option.boolCondition === true),
            find(step.condition.options, option => option.boolCondition === false)
          );
        case 'all': {
          const choiceList = scenarioState.choiceList(step.id);
          if (choiceList === undefined) {
            return undefined;
          }
          const {
            effectsWithInput,
            stepIds,
          } = this.processListChoices(choiceList, condition.options);
          return this.handleEffects(
            step.id,
            [...stepIds, ...this.remainingStepIds],
            scenarioState,
            effectsWithInput
          );
        }
        case 'choice':
          // TODO: check supplies, needs an investigator AND a has supplies test.
          return undefined;
      }
    }
  }

  private processListChoices(
    choiceList: ListChoices,
    choicesByIdx: {
      effects?: Effect[] | null,
      steps?: string[] | null,
    }[]
  ) {
    const groupedEffects = groupBy(
      flatMap(choiceList, (choices, code) => {
        return choices.map(choice => {
          return {
            code,
            choice,
          };
        });
      }),
      element => element.choice
    );
    const stepIds: string[] = [];
    const effectsWithInput: EffectsWithInput[] = flatMap(
      sortBy(groupedEffects, group => group[0].choice),
      group => {
        if (group[0].choice === -1) {
          return [];
        }
        const selectedChoice = choicesByIdx[group[0].choice];
        forEach(
          selectedChoice.steps || [],
          stepId => stepIds.push(stepId)
        );
        const result: EffectsWithInput = {
          input: map(group, item => item.code),
          effects: selectedChoice.effects || [],
        };
        return result;
    });
    return {
      effectsWithInput,
      stepIds,
    };
  }

  private expandInputStep(
    step: InputStep,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    const input = step.input;
    switch (input.type) {
      case 'counter': {
        const count = scenarioState.count(step.id);
        if (count === undefined) {
          return undefined;
        }
        return this.handleEffects(
          step.id,
          this.remainingStepIds,
          scenarioState,
          [{
            counterInput: count,
            effects: input.effects,
          }]
        );
      }
      case 'investigator_counter': {
        const choiceList = scenarioState.choiceList(step.id);
        if (choiceList === undefined) {
          return undefined;
        }
        const groupedEffects = groupBy(
          flatMap(choiceList, (choices, code) => {
            return choices.map(choice => {
              return {
                code,
                choice,
              };
            });
          }),
          element => element.choice
        );
        const effectsWithInput: EffectsWithInput[] = flatMap(
          sortBy(groupedEffects, group => group[0].choice),
          group => {
            if (group[0].choice === -1) {
              return [];
            }
            return {
              inputValue: map(group, item => item.code),
              counterInput: group[0].choice,
              effects: input.effects,
            }
          }
        );
        return this.handleEffects(
          step.id,
          this.remainingStepIds,
          scenarioState,
          effectsWithInput
        );
      }
      case 'investigator_choice':
      case 'card_choice': {
        const choices = scenarioState.choiceList(step.id);
        if (choices === undefined) {
          return undefined;
        }
        const {
          effectsWithInput,
          stepIds,
        } = this.processListChoices(
          choices,
          input.choices
        );
        return this.handleEffects(
          step.id,
          [...stepIds, ...this.remainingStepIds],
          scenarioState,
          effectsWithInput
        );
      }
      case 'supplies': {
        if (!scenarioState.supplies(step.id)) {
          return undefined;
        }
        return this.proceedToNextStep(this.remainingStepIds);
      }
      case 'choose_many':
        // TODO: used by inner-circle, needs to iterate until # of choices = 3
        console.log('Missing choose_many effect resolution');
        return undefined;
      case 'choose_one': {
        if (input.choices.length === 1) {
          const choice = input.choices[0];
          return this.decisionTest(
            scenarioState,
            this.remainingStepIds,
            choice
          );
        }

        // Multiple choice prompt
        const index = scenarioState.choice(step.id);
        if (index === undefined) {
          return undefined;
        }
        const choice = input.choices[index];
        return this.handleEffects(
          step.id,
          [...(choice.steps || []), ...this.remainingStepIds],
          scenarioState,
          [{
            effects: choice.effects || []
          }]
        );
      }
      case 'use_supplies':
        // TODO: guide
        return undefined;
    }
  }

  private decisionTest(
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[],
    ifTrue?: {
      steps?: null | string[];
      effects?: null | Effect[];
    },
    ifFalse?: {
      steps?: null | string[];
      effects?: null | Effect[];
    }
  ): ScenarioStep | undefined {
    const decision = scenarioState.decision(this.step.id)
    if (decision !== undefined) {
      return this.binaryBranch(
        decision,
        scenarioState,
        remainingStepIds,
        ifTrue,
        ifFalse
      );
    }
    return undefined;
  }

  private binaryBranch(
    condition: boolean,
    scenarioState: ScenarioStateHelper,
    remainingStepIds: string[],
    ifTrue?: {
      steps?: null | string[];
      effects?: null | Effect[];
    },
    ifFalse?: {
      steps?: null | string[];
      effects?: null | Effect[];
    }
  ): ScenarioStep | undefined {
    const resultCondition = condition ? ifTrue : ifFalse;
    return this.handleEffects(
      this.step.id,
      [
        ...((resultCondition && resultCondition.steps) || []),
        ...remainingStepIds,
      ],
      scenarioState,
      [{
        effects: (resultCondition && resultCondition.effects) || [],
      }]
    );
  }

  private handleEffects(
    id: string,
    remainingStepIds: string[],
    scenarioState: ScenarioStateHelper,
    effects: EffectsWithInput[]
  ): ScenarioStep | undefined {
    const flatEffects = flatMap(effects, effects => effects.effects);
    if (flatEffects.length) {
      const needsInvestigatorChoice = !!find(flatEffects, effect => (
        effect.type === 'add_card' && effect.investigator === 'choice'
      ));
      if (needsInvestigatorChoice) {
        const investigatorChoice = scenarioState.choice(`${id}_investigator`);
        if (investigatorChoice === undefined) {
          return undefined;
        }
      }
    }
    return this.proceedToNextStep(
      remainingStepIds,
      new GuidedCampaignLog(
        this.scenarioGuide.scenario.id,
        effects,
        this.campaignLog
      )
    );
  }

  private proceedToNextStep(
    remainingStepIds: string[],
    campaignLog?: GuidedCampaignLog
  ): ScenarioStep | undefined {
    if (remainingStepIds.length) {
      const [stepId, ...newRemaining] = remainingStepIds;
      const step = this.scenarioGuide.step(stepId)
      if (!step) {
        console.log(`Missing step: ${stepId}`);
        return undefined;
      }
      return new ScenarioStep(
        step,
        this.scenarioGuide,
        campaignLog || this.campaignLog,
        newRemaining
      );
    }
    return undefined;
  }
}
