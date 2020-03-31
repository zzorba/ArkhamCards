import {
  filter,
  flatMap,
  find,
  findIndex,
  forEach,
  groupBy,
  keys,
  map,
  partition,
  sortBy,
  sum,
} from 'lodash';

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
  EffectsWithInput,
} from './types';
import ScenarioGuide from './ScenarioGuide';
import GuidedCampaignLog from './GuidedCampaignLog';
import ScenarioStateHelper from './ScenarioStateHelper';

export default class ScenarioStep {
  step: Step;
  scenarioGuide: ScenarioGuide;
  campaignLog: GuidedCampaignLog;
  remainingStepIds: string[];

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

  scenarioFinished(scenarioState: ScenarioStateHelper) {
    return (
      this.remainingStepIds.length === 0 &&
      !!this.nextCampaignLog(scenarioState) &&
      this.step.id === '$proceed_effects'
    );
  }

  private getSpecialEffectChoiceList(effect: Effect): string | undefined {
    if ((
      effect.type === 'add_card' ||
      effect.type === 'remove_card'
    ) && (
      effect.investigator === 'choice' ||
      effect.investigator === 'any'
    )) {
      return `${this.step.id}_investigator`;
    }
    if (effect.type === 'trauma' && effect.mental_or_physical) {
      return `${this.step.id}_trauma`;
    }
    return undefined;
  }

  nextCampaignLog(
    scenarioState: ScenarioStateHelper
  ): GuidedCampaignLog | undefined {
    if (this.step.type === 'effects') {
      const flatEffects = flatMap(this.step.effectsWithInput, effects => effects.effects);
      const specialInputs = flatMap(flatEffects, effect => {
        const specialInput = this.getSpecialEffectChoiceList(effect);
        if (specialInput) {
          return [specialInput];
        }
        return [];
      })
      if (find(specialInputs, specialInput => scenarioState.choiceList(specialInput) === undefined)) {
        // No input yet, stop for now.
        return undefined;
      }
      return new GuidedCampaignLog(
        flatMap(this.step.effectsWithInput, effects => {
          const result: EffectsWithInput[] = [];
          const [specialEffects, normalEffects] = partition(
            effects.effects,
            effect => this.getSpecialEffectChoiceList(effect)
          );
          if (normalEffects.length) {
            result.push({
              ...effects,
              effects: normalEffects,
            });
          }
          forEach(specialEffects, specialEffect => {
            const input = this.getSpecialEffectChoiceList(specialEffect);
            if (!input) {
              // Impossible
              return;
            }
            const choiceList = scenarioState.choiceList(input);
            if (choiceList === undefined) {
              // Also impossible
              return;
            }
            switch (specialEffect.type) {
              case 'remove_card':
              case 'add_card':
                result.push({
                  input: keys(choiceList),
                  effects: [{
                    ...specialEffect,
                    investigator: '$input_value',
                  }],
                });
                break;
              case 'trauma': {
                const physical: string[] = [];
                const mental: string[] = [];
                forEach(choiceList, (choice, code) => {
                  if (choice[0] === 0) {
                    physical.push(code);
                  } else {
                    mental.push(code);
                  }
                });
                if (physical.length) {
                  result.push({
                    input: physical,
                    effects: [{
                      type: 'trauma',
                      physical: 1,
                      investigator: '$input_value',
                    }],
                  });
                }
                if (mental.length) {
                  result.push({
                    input: mental,
                    effects: [{
                      type: 'trauma',
                      mental: 1,
                      investigator: '$input_value',
                    }],
                  });
                }
              }
            }
          });
          return result;
        }),
        this.scenarioGuide.campaignGuide,
        this.scenarioGuide.id,
        this.campaignLog
      );
    }
    // No mutations if no effects.
    return this.campaignLog;
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
        return this.maybeCreateEffectsStep(
          this.step.id,
          [
            ...(this.step.generated ? [] : resolution.steps),
            ...this.remainingStepIds,
          ],
          [{
            effects: this.step.effects || [],
          }]
        );
      }
      case 'effects': {
        const nextCampaignLog = this.nextCampaignLog(scenarioState);
        if (!nextCampaignLog) {
          return undefined;
        }
        return this.proceedToNextStep(this.remainingStepIds, nextCampaignLog);
      }
      default:
        return this.maybeCreateEffectsStep(
          this.step.id,
          this.remainingStepIds,
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
      case 'campaign_log': {
        const ifTrue = find(step.condition.options, option => option.boolCondition === true);
        const ifFalse = find(step.condition.options, option => option.boolCondition === false);
        return this.binaryBranch(
          step.condition.type === 'campaign_log' ?
            this.campaignLog.check(step.condition.section, step.condition.id) :
            this.campaignLog.sectionExists(step.condition.section),
          scenarioState,
          this.remainingStepIds,
          ifTrue,
          ifFalse
        );
      }
      case 'campaign_log_count': {
        const count = this.campaignLog.count(step.condition.section, step.condition.id);
        const choice =
          find(step.condition.options, option => option.numCondition === count) ||
          step.condition.defaultOption;
        const extraSteps = (choice && choice.steps) || [];
        return this.maybeCreateEffectsStep(
          step.id,
          [
            ...extraSteps,
            ...this.remainingStepIds,
          ],
          [{
            numberInput: count !== undefined ? [count] : undefined,
            effects: (choice && choice.effects) || [],
          }]
        );
      }
      case 'math':
        return this.handleMath(step, step.condition);
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
        return this.campaignLog.chaosBag[op.token] || 0;
      case 'constant':
        return op.value;
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
    condition: MathCondition
  ): ScenarioStep | undefined {
    const opA = this.getOperand(condition.opA);
    const opB = this.getOperand(condition.opB);
    const value = this.performOp(opA, opB, condition.operation);
    const option = find(condition.options, option => option.numCondition === value) ||
      (condition.operation === 'sum' ? condition.defaultOption : undefined);
    const extraSteps = (option && option.steps) || [];
    return this.maybeCreateEffectsStep(
      step.id,
      [...extraSteps, ...this.remainingStepIds],
      [{
        effects: (option && option.effects) || [],
      }]
    );
  }

  private handleCampaignData(
    step: BranchStep,
    condition: CampaignDataCondition,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    switch (condition.campaign_data) {
      case 'scenario_completed': {
        const ifTrue = find(step.condition.options, option => option.boolCondition === true);
        const ifFalse = find(step.condition.options, option => option.boolCondition === false);
        return this.binaryBranch(
          this.campaignLog.scenarioStatus(condition.scenario) === 'completed',
          scenarioState,
          this.remainingStepIds,
          ifTrue,
          ifFalse
        );
      }
      case 'difficulty':
        const difficulty = this.campaignLog.campaignData.difficulty;
        const option = find(condition.options, option => option.condition === difficulty);
        const extraSteps = (option && option.steps) || [];
        return this.maybeCreateEffectsStep(
          step.id,
          [...extraSteps, ...this.remainingStepIds],
          [{
            effects: (option && option.effects) || [],
          }]
        );
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
    const investigators = this.campaignLog.investigatorCodes();
    const hasCard = filter(investigators, code => {
      if (condition.investigator === 'defeated' &&
        !this.campaignLog.isDefeated(code)) {
        return false;
      }
      return this.campaignLog.hasCard(
        code,
        condition.card
      );
    });

    return this.binaryBranch(
      hasCard.length > 0,
      scenarioState,
      this.remainingStepIds,
      find(condition.options, option => option.boolCondition === true),
      find(condition.options, option => option.boolCondition === false),
      hasCard
    );
  }

  private handleScenarioDataCondition(
    step: BranchStep,
    condition: ScenarioDataCondition,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    switch (condition.scenario_data) {
      case 'player_count': {
        const playerCount = this.campaignLog.playerCount();
        const option = find(condition.options, option => option.numCondition === playerCount) ||
          find(condition.options, option => !!option.default);
        const extraSteps = (option && option.steps) || [];
        return this.maybeCreateEffectsStep(
          step.id,
          [...extraSteps, ...this.remainingStepIds],
          [{
            effects: (option && option.effects) || [],
          }]
        );
      }
      case 'resolution': {
        const resolution = this.campaignLog.resolution();
        console.log(resolution);
        const option = find(condition.options, option => option.condition === resolution);
        const extraSteps = (option && option.steps) || [];
        return this.maybeCreateEffectsStep(
          step.id,
          [...extraSteps, ...this.remainingStepIds],
          [{
            effects: (option && option.effects) || [],
          }]
        );
      }
      case 'investigator': {
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
      case 'investigator_status': {
        if (condition.investigator !== 'defeated')  {
          throw new Error('Unexpected investigator_status scenario condition');
        }
        const investigators = this.campaignLog.investigatorCodes();
        const decision = !!find(investigators, code => {
          return this.campaignLog.isDefeated(code);
        });
        const ifTrue = find(step.condition.options, option => option.boolCondition === true);
        const ifFalse = find(step.condition.options, option => option.boolCondition === false);
        return this.binaryBranch(
          decision,
          scenarioState,
          this.remainingStepIds,
          ifTrue,
          ifFalse
        );
      }
    }
  }

  private handleCheckSupplies(
    step: BranchStep,
    condition: CheckSuppliesCondition,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    switch (condition.investigator) {
      case 'any': {
        const ifTrue = find(step.condition.options, option => option.boolCondition === true);
        const ifFalse = find(step.condition.options, option => option.boolCondition === false);
        const investigatorSupplies = this.campaignLog.investigatorSections[condition.section] || {};
        const decision = !!find(investigatorSupplies,
          supplies => !!find(supplies.entries,
            entry => entry.id === condition.id && !supplies.crossedOut[condition.id]
          )
        );
        return this.binaryBranch(
          decision,
          scenarioState,
          this.remainingStepIds,
          ifTrue,
          ifFalse
        );
      }
      case 'all': {
        const investigatorSupplies = this.campaignLog.investigatorSections[condition.section] || {};
        const choiceList: ListChoices = {};
        forEach(investigatorSupplies, (supplies, investigatorCode) => {
          const hasSupply = !!find(supplies.entries,
            entry => entry.id === condition.id && !supplies.crossedOut[condition.id]
          );
          const matchingOption = findIndex(condition.options, option => option.boolCondition === hasSupply);
          if (matchingOption !== -1) {
            choiceList[investigatorCode] = [matchingOption];
          }
        });
        const {
          effectsWithInput,
          stepIds,
        } = this.processListChoices(
          choiceList,
          condition.options
        );
        return this.maybeCreateEffectsStep(
          step.id,
          [...stepIds, ...this.remainingStepIds],
          effectsWithInput
        );
      }
      case 'choice': {
        const choice = scenarioState.choiceList(this.step.id);
        if (choice === undefined) {
          return undefined;
        }
        const investigator = keys(choice)[0];
        const investigatorSupplies = this.campaignLog.investigatorSections[condition.section] || {};
        const supplies = investigatorSupplies[investigator];
        const hasSupply = !!(
          supplies &&
          !supplies.crossedOut[condition.id] &&
          find(supplies.entries, entry => entry.id === condition.id && entry.type === 'count' && entry.count > 0)
        );
        return this.binaryBranch(
          hasSupply,
          scenarioState,
          this.remainingStepIds,
          find(condition.options, option => option.boolCondition === true),
          find(condition.options, option => option.boolCondition === false),
          [investigator]
        );
      }
    }
  }

  private processListChoices(
    choiceList: ListChoices,
    choicesByIdx: {
      effects?: Effect[] | null;
      steps?: string[] | null;
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
          (selectedChoice && selectedChoice.steps) || [],
          stepId => stepIds.push(stepId)
        );
        const result: EffectsWithInput = {
          input: map(group, item => item.code),
          effects: (selectedChoice && selectedChoice.effects) || [],
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
        return this.maybeCreateEffectsStep(
          step.id,
          this.remainingStepIds,
          [{
            numberInput: [count],
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
            };
          }
        );
        return this.maybeCreateEffectsStep(
          step.id,
          this.remainingStepIds,
          effectsWithInput
        );
      }
      case 'scenario_investigators':
        const choices = scenarioState.choiceList(step.id);
        if (choices === undefined) {
          return undefined;
        }
        const investigators: string[] = [];
        const decks: number[] = [];
        forEach(choices, (deck, investigator) => {
          investigators.push(investigator);
          decks.push(deck[0]);
        });
        const effectsWithInput: EffectsWithInput = {
          input: investigators,
          numberInput: decks,
          effects: [
            {
              type: 'scenario_data',
              setting: 'playing_scenario',
              investigator: '$input_value',
            },
          ],
        };
        return this.maybeCreateEffectsStep(
          step.id,
          this.remainingStepIds,
          [effectsWithInput]
        );
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
        return this.maybeCreateEffectsStep(
          step.id,
          [...stepIds, ...this.remainingStepIds],
          effectsWithInput
        );
      }
      case 'supplies': {
        const supplies = scenarioState.supplies(step.id);
        if (supplies === undefined) {
          return undefined;
        }
        const effects: Effect[] = flatMap(supplies, (investigatorSupplies, code) =>
          flatMap(investigatorSupplies, (count, supplyId) => {
            return {
              type: 'campaign_log_count',
              section: input.section,
              investigator: code,
              operation: 'add',
              id: supplyId,
              value: count,
            };
          })
        );
        return this.maybeCreateEffectsStep(
          step.id,
          this.remainingStepIds,
          [{
            effects,
          }]
        );
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
        return this.maybeCreateEffectsStep(
          step.id,
          [...(choice.steps || []), ...this.remainingStepIds],
          [{
            effects: choice.effects || [],
          }]
        );
      }
      case 'use_supplies': {
        const choice = scenarioState.choiceList(
          input.investigator === 'all' ? `${this.step.id}_used` : this.step.id
        );
        if (choice === undefined) {
          return undefined;
        }
        const consumeSuppliesEffects: Effect[] = map(choice, ([count], code) => {
          return {
            type: 'campaign_log_count',
            section: input.section,
            investigator: code,
            operation: 'add',
            id: input.id,
            value: -(input.investigator === 'all' ? count : 1),
          };
        });
        switch (input.investigator) {
          case 'all': {
            const useCount = sum(map(choice, count => count));
            if (useCount === this.campaignLog.playerCount()) {
              // We got what we needed.
              // And we know there are only 'false' conditions right now.
              return this.maybeCreateEffectsStep(
                this.step.id,
                this.remainingStepIds,
                [{
                  effects: consumeSuppliesEffects,
                }],
              );
            }
            const secondChoice = scenarioState.choiceList(this.step.id);
            if (secondChoice === undefined) {
              return undefined;
            }
            const theBadThing = find(input.choices, choice => choice.boolCondition === false);
            return this.maybeCreateEffectsStep(
              this.step.id,
              [
                ...(theBadThing && theBadThing.steps) || [],
                ...this.remainingStepIds,
              ],
              [{
                effects: consumeSuppliesEffects,
              },
              {
                input: keys(secondChoice),
                effects: (theBadThing && theBadThing.effects) || [],
              }],
            );
          }
          case 'choice': {
            const hasAny = keys(choice).length > 0;
            const branchChoice = find(
              input.choices,
              option => option.boolCondition === hasAny
            );
            console.log(JSON.stringify(branchChoice));
            if (!branchChoice) {
              return this.maybeCreateEffectsStep(
                this.step.id,
                this.remainingStepIds,
                [{
                  effects: consumeSuppliesEffects,
                }],
              );
            }
            return this.maybeCreateEffectsStep(
              this.step.id,
              [
                ...(branchChoice && branchChoice.steps) || [],
                ...this.remainingStepIds,
              ],
              [
                {
                  effects: consumeSuppliesEffects,
                },
                {
                  input: keys(choice),
                  effects: (branchChoice && branchChoice.effects) || [],
                },
              ],
            );
          }
        }
      }
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
    const decision = scenarioState.decision(this.step.id);
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
    },
    input?: string[]
  ): ScenarioStep | undefined {
    const resultCondition = condition ? ifTrue : ifFalse;
    return this.maybeCreateEffectsStep(
      this.step.id,
      [
        ...((resultCondition && resultCondition.steps) || []),
        ...remainingStepIds,
      ],
      [{
        input,
        effects: (resultCondition && resultCondition.effects) || [],
      }]
    );
  }

  private maybeCreateEffectsStep(
    id: string,
    remainingStepIds: string[],
    effectsWithInput: EffectsWithInput[]
  ): ScenarioStep | undefined {
    const flatEffects = flatMap(effectsWithInput, effects => effects.effects);
    if (flatEffects.length) {
      return new ScenarioStep(
        {
          id: `${id}_effects`,
          type: 'effects',
          effectsWithInput,
          stepText: !!this.step.text,
          bullet_type: this.step.bullet_type || undefined,
        },
        this.scenarioGuide,
        this.campaignLog,
        remainingStepIds
      );
    }
    return this.proceedToNextStep(remainingStepIds, this.campaignLog);
  }

  private proceedToNextStep(
    remainingStepIds: string[],
    campaignLog?: GuidedCampaignLog
  ): ScenarioStep | undefined {
    if (remainingStepIds.length) {
      const [stepId, ...newRemaining] = remainingStepIds;
      const step = this.scenarioGuide.step(stepId);
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
