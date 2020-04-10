import {
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

import { StringChoices } from 'actions/types';
import { Choices } from 'data/scenario';
import {
  BulletType,
  BranchStep,
  InputStep,
  Step,
  Effect,
  EffectsWithInput,
} from 'data/scenario/types';
import { investigatorChoiceInputChoices, chooseOneInputChoices } from 'data/scenario/inputHelper';
import { conditionResult } from 'data/scenario/conditionHelper';
import ScenarioGuide from 'data/scenario/ScenarioGuide';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from 'data/scenario/ScenarioStateHelper';

export default class ScenarioStep {
  step: Step;
  campaignLog: GuidedCampaignLog;
  private scenarioGuide: ScenarioGuide;
  private remainingStepIds: string[];

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
    const nextCampaignLog = this.nextCampaignLog(scenarioState);
    if (nextCampaignLog &&
      nextCampaignLog.campaignData.result &&
      this.scenarioGuide.scenarioType() !== 'epilogue'
    ) {
      // Actually campaign is finished.
      return true;
    }
    return (
      nextCampaignLog &&
      this.remainingStepIds.length === 0 &&
      this.step.id === '$proceed_effects'
    );
  }

  private getSpecialEffectChoiceList(effect: Effect): string | undefined {
    switch (effect.type) {
      case 'add_card':
        if (effect.investigator === 'lead_investigator' && effect.optional) {
          return `${this.step.id}_investigator`;
        }
        // Intentional fall-through
        /* eslint-disable no-fallthrough */
      case 'remove_card':
        if (
          effect.investigator === 'choice' ||
          effect.investigator === 'any'
        ) {
          return `${this.step.id}_investigator`;
        }
        return undefined;
      case 'trauma':
        if (effect.mental_or_physical) {
          return `${this.step.id}_trauma`;
        }
        return undefined;
      case 'add_weakness':
        return `${this.step.id}_weakness`;
      default:
        return undefined;
    }
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
      });
      const stillNeedsInput = find(specialInputs, id =>
        scenarioState.stringChoices(id) === undefined
      );
      if (stillNeedsInput) {
        // No input yet, stop for now.
        return undefined;
      }

      const effects = flatMap(this.step.effectsWithInput, effects => {
        const result: EffectsWithInput[] = [];
        const [specialEffects, normalEffects] = partition(
          effects.effects,
          effect => !!this.getSpecialEffectChoiceList(effect)
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
          const choiceList = scenarioState.stringChoices(input);
          if (choiceList === undefined) {
            // Also impossible
            return;
          }
          switch (specialEffect.type) {
            case 'add_weakness': {
              forEach(choiceList, (choices, code) => {
                result.push({
                  input: [code],
                  effects: map(choices, card => {
                    return {
                      type: 'add_card',
                      investigator: '$input_value',
                      card,
                    };
                  }),
                });
              });
              break;
            }
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
                switch (choice[0]) {
                  case 'physical':
                    physical.push(code);
                    break;
                  case 'mental':
                    mental.push(code);
                    break;
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
              break;
            }
          }
        });
        return result;
      });

      return new GuidedCampaignLog(
        effects,
        this.scenarioGuide.campaignGuide,
        scenarioState.campaignState.investigators,
        this.campaignLog,
        this.scenarioGuide.id
      );
    }
    // No mutations if no effects.
    return this.campaignLog;
  }

  nextStep(
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
    switch (this.step.type) {
      case 'branch':
        return this.expandBranchStep(this.step);
      case 'input':
        return this.expandInputStep(this.step, scenarioState);
      case 'story':
      case 'encounter_sets':
      case 'rule_reminder':
      case 'location_setup':
        return this.proceedToNextStep(
          this.remainingStepIds,
          this.campaignLog
        );
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

  private expandBranchStep(step: BranchStep): ScenarioStep | undefined {
    const result = conditionResult(step.condition, this.campaignLog);
    switch (result.type) {
      case 'string':
      case 'number':
      case 'binary':
        return this.maybeCreateEffectsStep(
          this.step.id,
          [
            ...((result.option && result.option.steps) || []),
            ...this.remainingStepIds,
          ],
          [{
            numberInput: result.type === 'number' ? [result.number] : undefined,
            effects: (result.option && result.option.effects) || [],
          }]
        );
      case 'investigator': {
        const {
          effectsWithInput,
          stepIds,
        } = this.processListChoices(
          result.investigatorChoices,
          {
            type: 'universal',
            choices: result.options,
          }
        );
        return this.maybeCreateEffectsStep(
          step.id,
          [...stepIds, ...this.remainingStepIds],
          effectsWithInput
        );
      }
    }
  }

  private processListChoices(
    choiceList: StringChoices,
    theChoices: Choices
  ) {
    const groupedEffects = groupBy(
      flatMap(choiceList, (choices, code) => {
        return choices.map(choiceId => {
          return {
            code,
            choice: findIndex(theChoices.choices, choice => choice.id === choiceId),
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
        const selectedChoice = theChoices.choices[group[0].choice];
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
        const choiceList = scenarioState.numberChoices(step.id);
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
      case 'scenario_investigators': {
        const choices = scenarioState.stringChoices(step.id);
        if (choices === undefined) {
          return undefined;
        }
        const investigators: string[] = keys(choices);
        const effectsWithInput: EffectsWithInput = {
          input: investigators,
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
      }
      case 'investigator_choice_supplies': {
        const choice = scenarioState.stringChoices(this.step.id);
        if (choice === undefined) {
          return undefined;
        }
        const investigator = keys(choice)[0];
        const investigatorSupplies = this.campaignLog.investigatorSections[input.section] || {};
        const supplies = investigatorSupplies[investigator];
        const hasSupply = !!(
          supplies &&
          !supplies.crossedOut[input.id] &&
          find(supplies.entries, entry => entry.id === input.id && entry.type === 'count' && entry.count > 0)
        );
        return this.binaryBranch(
          hasSupply,
          this.remainingStepIds,
          input.positiveChoice,
          input.negativeChoice,
          [investigator]
        );
      }
      case 'investigator_choice': {
        const choices = scenarioState.stringChoices(step.id);
        if (choices === undefined) {
          return undefined;
        }
        const {
          effectsWithInput,
          stepIds,
        } = this.processListChoices(
          choices,
          investigatorChoiceInputChoices(input, this.campaignLog)
        );
        return this.maybeCreateEffectsStep(
          step.id,
          [...stepIds, ...this.remainingStepIds],
          effectsWithInput
        );
      }
      case 'card_choice': {
        if (input.include_counts) {
          const choices = scenarioState.numberChoices(step.id);
          if (choices === undefined) {
            return undefined;
          }
          const choice = input.choices[0];
          const cards: string[] = [];
          const cardCounts: number[] = [];
          forEach(choices, (count, card) => {
            cards.push(card);
            cardCounts.push(count[0]);
          });
          return this.maybeCreateEffectsStep(
            step.id,
            [...(choice.steps || []), ...this.remainingStepIds],
            [
              {
                input: cards,
                numberInput: cardCounts,
                effects: choice.effects || [],
              },
            ]
          );
        }
        const choices = scenarioState.stringChoices(step.id);
        if (choices === undefined) {
          return undefined;
        }

        const {
          effectsWithInput,
          stepIds,
        } = this.processListChoices(
          choices,
          {
            type: 'universal',
            choices: input.choices,
          }
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
        const choices = chooseOneInputChoices(input, this.campaignLog);
        const choice = choices[index];
        return this.maybeCreateEffectsStep(
          step.id,
          [...(choice.steps || []), ...this.remainingStepIds],
          [{
            effects: choice.effects || [],
          }],
          'small'
        );
      }
      case 'upgrade_decks': {
        const choice = scenarioState.decision(this.step.id);
        if (choice === undefined) {
          return undefined;
        }
        const effects: EffectsWithInput[] = [];
        const investigators = this.campaignLog.investigators(false);
        forEach(investigators, investigator => {
          const choices = scenarioState.numberChoices(`${this.step.id}#${investigator.code}`);
          if (choices !== undefined) {
            const investigatorEffects: EffectsWithInput = {
              input: [investigator.code],
              effects: [],
            };
            const xpAdjust = (choices.xp && choices.xp[0]) || 0;
            if (xpAdjust !== 0) {
              investigatorEffects.effects.push({
                type: 'earn_xp',
                investigator: '$input_value',
                bonus: xpAdjust,
              });
            }
            const physicalAdjust = (choices.physical && choices.physical[0]) || 0;
            if (physicalAdjust !== 0) {
              investigatorEffects.effects.push({
                type: 'trauma',
                investigator: '$input_value',
                physical: physicalAdjust,
                hidden: true,
              });
            }
            const mentalAdjust = (choices.mental && choices.mental[0]) || 0;
            if (mentalAdjust !== 0) {
              investigatorEffects.effects.push({
                type: 'trauma',
                investigator: '$input_value',
                mental: mentalAdjust,
                hidden: true,
              });
            }

            if (investigatorEffects.effects.length) {
              effects.push(investigatorEffects);
            }
          }
        });

        // Finally do the deck upgrade to 'bank' it.
        effects.push({
          effects: [
            {
              type: 'upgrade_decks',
            },
          ],
        });
        return this.maybeCreateEffectsStep(
          this.step.id,
          this.remainingStepIds,
          effects
        );
      }
      case 'use_supplies': {
        switch (input.investigator) {
          case 'all': {
            const choice = scenarioState.numberChoices(`${this.step.id}_used`);
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
            const useCount = sum(map(choice, count => count[0]));
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
            const secondChoice = scenarioState.stringChoices(this.step.id);
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
            const choice = scenarioState.stringChoices(this.step.id);
            if (choice === undefined) {
              return undefined;
            }
            const consumeSuppliesEffects: Effect[] = map(keys(choice), code => {
              return {
                type: 'campaign_log_count',
                section: input.section,
                investigator: code,
                operation: 'add',
                id: input.id,
                value: -1,
              };
            });
            const hasAny = keys(choice).length > 0;
            const branchChoice = find(
              input.choices,
              option => option.boolCondition === hasAny
            );
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
        remainingStepIds,
        ifTrue,
        ifFalse
      );
    }
    return undefined;
  }

  private binaryBranch(
    condition: boolean,
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
    effectsWithInput: EffectsWithInput[],
    bulletType?: BulletType
  ): ScenarioStep | undefined {
    const flatEffects = flatMap(effectsWithInput, effects => effects.effects);
    if (flatEffects.length) {
      return new ScenarioStep(
        {
          id: `${id}_effects`,
          type: 'effects',
          effectsWithInput,
          stepText: !!this.step.text,
          bullet_type: this.step.bullet_type || bulletType,
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
    campaignLog: GuidedCampaignLog
  ): ScenarioStep | undefined {
    if (remainingStepIds.length) {
      const [stepId, ...newRemaining] = remainingStepIds;
      const step = this.scenarioGuide.step(stepId, campaignLog);
      if (!step) {
        console.log(`Missing step: ${stepId}`);
        return undefined;
      }
      return new ScenarioStep(
        step,
        this.scenarioGuide,
        campaignLog,
        newRemaining
      );
    }
    return undefined;
  }
}
