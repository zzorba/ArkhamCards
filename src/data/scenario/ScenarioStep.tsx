import {
  flatMap,
  find,
  findIndex,
  forEach,
  groupBy,
  keys,
  map,
  mapValues,
  partition,
  range,
  sortBy,
  sum,
} from 'lodash';

import { StringChoices } from '@actions/types';
import { Choices } from '@data/scenario';
import {
  BulletType,
  BranchStep,
  InputStep,
  Step,
  Effect,
  EffectsWithInput,
} from '@data/scenario/types';
import { getSpecialEffectChoiceList } from './effectHelper';
import { investigatorChoiceInputChoices, chooseOneInputChoices } from '@data/scenario/inputHelper';
import { conditionResult } from '@data/scenario/conditionHelper';
import ScenarioGuide from '@data/scenario/ScenarioGuide';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ScenarioStateHelper from '@data/scenario/ScenarioStateHelper';
import { PlayingScenarioBranch } from '@data/scenario/fixedSteps';

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

  nextCampaignLog(
    scenarioState: ScenarioStateHelper
  ): GuidedCampaignLog | undefined {
    if (this.step.type === 'effects') {
      const flatEffects = flatMap(this.step.effectsWithInput, effects => effects.effects);
      const specialInputs = flatMap(flatEffects, effect => {
        const specialInput = getSpecialEffectChoiceList(this.step.id, effect);
        if (specialInput) {
          return [specialInput];
        }
        return [];
      });
      const stillNeedsInput = find(specialInputs, id =>
        id !== '$fixed_investigator' &&
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
          effect => !!getSpecialEffectChoiceList(this.step.id, effect)
        );
        if (normalEffects.length) {
          result.push({
            ...effects,
            effects: normalEffects,
          });
        }
        forEach(specialEffects, specialEffect => {
          const input = getSpecialEffectChoiceList(this.step.id, specialEffect);
          if (!input) {
            // Impossible
            return;
          }
          if (input === '$fixed_investigator') {
            switch (specialEffect.type) {
              case 'earn_xp':
              case 'remove_card':
              case 'add_card': {
                result.push({
                  input: specialEffect.fixed_investigator ? [specialEffect.fixed_investigator] : [],
                  numberInput: effects.numberInput,
                  effects: [{
                    ...specialEffect,
                    investigator: '$input_value',
                  }],
                });
                break;
              }
              default:
                // Should not happen
                return;
            }
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
        scenarioState.campaignState,
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
        return this.expandBranchStep(
          this.step,
          scenarioState
        );
      case 'input':
        return this.expandInputStep(
          this.step,
          scenarioState
        );
      case 'table':
      case 'story':
      case 'encounter_sets':
      case 'location_connectors':
      case 'rule_reminder':
      case 'location_setup':
      case 'campaign_log_count':
      case 'xp_count':
        return this.proceedToNextStep(
          this.remainingStepIds,
          scenarioState,
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
          }],
          scenarioState
        );
      }
      case 'effects': {
        const nextCampaignLog = this.nextCampaignLog(scenarioState);
        if (!nextCampaignLog) {
          return undefined;
        }
        return this.proceedToNextStep(
          this.remainingStepIds,
          scenarioState,
          nextCampaignLog
        );
      }
      default:
        return this.maybeCreateEffectsStep(
          this.step.id,
          this.remainingStepIds,
          [{
            effects: this.step.effects || [],
          }],
          scenarioState
        );
    }
  }

  private expandBranchStep(
    step: BranchStep,
    scenarioState: ScenarioStateHelper
  ): ScenarioStep | undefined {
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
            border: (result.option && result.option.border),
            numberInput: result.type === 'number' ? [result.number] : undefined,
            input: result.type === 'binary' ? result.input : undefined,
            effects: (result.option && result.option.effects) || [],
          }],
          scenarioState
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
          effectsWithInput,
          scenarioState
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
          border: (selectedChoice && selectedChoice.border),
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
    const parts = step.id.split('#');
    const baseStepId = parts[0];
    const currentIteration: number | undefined = parts.length > 1 ? parseInt(parts[1], 10) : undefined;
    const nextIteration = (currentIteration || 0) + 1;
    switch (input.type) {
      case 'random_location': {
        // Have to press 'undo' to get past the dead-end here.
        return undefined;
      }
      case 'send_campaign_link': {
        if (this.campaignLog.linked) {
          const decision = scenarioState.campaignLink(
            'send',
            input.id
          );
          if (decision === undefined) {
            return undefined;
          }
        }
        return this.proceedToNextStep(
          this.remainingStepIds,
          scenarioState,
          this.campaignLog
        );
      }
      case 'receive_campaign_link': {
        if (this.campaignLog.linked) {
          const decision = scenarioState.campaignLink('receive', input.id);
          if (decision === undefined) {
            return undefined;
          }
          const choice = find(input.choices, choice => choice.id === decision);
          return this.maybeCreateEffectsStep(
            step.id,
            [...((choice && choice.steps) || []), ...this.remainingStepIds],
            choice ? [{
              effects: choice.effects || [],
            }] : [],
            scenarioState
          );
        }

        // Manually linked campaign.
        if (!input.choices.length) {
          return this.proceedToNextStep(
            this.remainingStepIds,
            scenarioState,
            this.campaignLog
          );
        }
        const index = scenarioState.choice(step.id);
        if (index === undefined) {
          return undefined;
        }
        const choice = input.choices[index];
        return this.maybeCreateEffectsStep(
          step.id,
          [...((choice && choice.steps) || []), ...this.remainingStepIds],
          choice ? [{
            effects: choice.effects || [],
          }] : [],
          scenarioState
        );
      }
      case 'text_box': {
        const text = scenarioState.text(step.id);
        if (text === undefined) {
          return undefined;
        }
        return this.maybeCreateEffectsStep(
          step.id,
          this.remainingStepIds,
          [{
            input: [text],
            effects: input.effects,
          }],
          scenarioState
        );
      }
      case 'play_scenario': {
        const choice = scenarioState.choice(step.id);
        if (choice === undefined) {
          return undefined;
        }
        switch (choice) {
          case PlayingScenarioBranch.RECORD_TRAUMA:
          case PlayingScenarioBranch.DRAW_WEAKNESS: {
            const fixedStep = choice === PlayingScenarioBranch.DRAW_WEAKNESS ?
              '$draw_weakness' :
              '$record_trauma';
            return this.maybeCreateEffectsStep(
              step.id,
              [
                `${fixedStep}#${nextIteration}`,
                `$play_scenario#${nextIteration}`,
                ...this.remainingStepIds,
              ],
              [],
              scenarioState
            );
          }
          case PlayingScenarioBranch.RESOLUTION: {
            const steps: string[] = [];
            if (!input.no_resolutions) {
              steps.push('$choose_resolution');
            }
            return this.maybeCreateEffectsStep(
              step.id,
              [
                ...steps,
                ...this.remainingStepIds,
              ],
              [],
              scenarioState
            );
          }
          case PlayingScenarioBranch.CAMPAIGN_LOG: {
            if (input.campaign_log) {
              const choices = chooseOneInputChoices(
                input.campaign_log || [],
                this.campaignLog
              );
              if (choices.length) {
                const secondInput = scenarioState.choice(`${step.id}_campaign_log`);
                if (secondInput === undefined) {
                  return undefined;
                }
                if (secondInput < choices.length) {
                  const campaignLogChoice = choices[secondInput];
                  const choiceSteps = map(
                    campaignLogChoice.steps || [],
                    stepId => `${stepId}#${nextIteration}`
                  );

                  return this.maybeCreateEffectsStep(
                    step.id,
                    [
                      ...choiceSteps,
                      `$play_scenario#${nextIteration}`,
                      ...this.remainingStepIds,
                    ],
                    [
                      {
                        effects: campaignLogChoice.effects || [],
                      },
                    ],
                    scenarioState
                  );
                }
              }

            }
            return this.maybeCreateEffectsStep(
              step.id,
              [
                `$campaign_log#${nextIteration}`,
                `$play_scenario#${nextIteration}`,
                ...this.remainingStepIds,
              ],
              [],
              scenarioState
            );
          }
          default: {
            if (!input.branches || choice >= input.branches.length) {
              return undefined;
            }
            const branch = input.branches[choice];
            const branchSteps = branch.condition ?
              (branch.steps || []) :
              map(branch.steps || [], stepId => `${stepId}#${nextIteration}`);
            return this.maybeCreateEffectsStep(
              step.id,
              [
                ...branchSteps,
                `$play_scenario#${nextIteration}`,
                ...this.remainingStepIds,
              ],
              [{
                effects: branch.effects || [],
              }],
              scenarioState,
              'small',
              true
            );
          }
        }
      }
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
          }],
          scenarioState
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
            const effectWithInput: EffectsWithInput = {
              input: map(group, item => item.code),
              numberInput: [group[0].choice],
              effects: input.effects,
            };
            return effectWithInput;
          }
        );
        return this.maybeCreateEffectsStep(
          step.id,
          this.remainingStepIds,
          effectsWithInput,
          scenarioState
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
          [effectsWithInput],
          scenarioState
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
          scenarioState,
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
        let followOnStepIds: string[] = [];
        if (input.special_mode === 'sequential') {
          // We might need to repeat the step N times
          const investigators = this.campaignLog.investigators(false);
          if (nextIteration < investigators.length) {
            // Nothing special needed for solo mode.
            followOnStepIds = [`${baseStepId}#${nextIteration}`];
          }
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
          [...stepIds, ...followOnStepIds, ...this.remainingStepIds],
          effectsWithInput,
          scenarioState
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
            ],
            scenarioState
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
          effectsWithInput,
          scenarioState
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
          }],
          scenarioState
        );
      }
      case 'choose_one': {
        if (input.choices.length === 1) {
          const choice = input.choices[0];
          return this.decisionTest(
            this.remainingStepIds,
            scenarioState,
            choice
          );
        }

        // Multiple choice prompt
        const index = scenarioState.choice(step.id);
        if (index === undefined) {
          return undefined;
        }
        const choices = chooseOneInputChoices(input.choices, this.campaignLog);
        const choice = choices[index];
        return this.maybeCreateEffectsStep(
          step.id,
          [...(choice.steps || []), ...this.remainingStepIds],
          [{
            effects: choice.effects || [],
          }],
          scenarioState,
          'small'
        );
      }
      case 'upgrade_decks': {
        const choice = scenarioState.decision(this.step.id);
        if (choice === undefined) {
          return undefined;
        }
        const effectsWithInput: EffectsWithInput[] = [];
        const investigators = this.campaignLog.investigators(false);
        forEach(investigators, investigator => {
          const choices = scenarioState.numberChoices(`${this.step.id}#${investigator.code}`);
          if (choices !== undefined) {
            const effects: Effect[] = [];
            const xpAdjust = (choices.xp && choices.xp[0]) || 0;
            if (xpAdjust !== 0) {
              effects.push({
                type: 'earn_xp',
                investigator: '$input_value',
                bonus: xpAdjust,
              });
            }
            const physicalAdjust = (choices.physical && choices.physical[0]) || 0;
            if (physicalAdjust !== 0) {
              effects.push({
                type: 'trauma',
                investigator: '$input_value',
                physical: physicalAdjust,
                hidden: true,
              });
            }
            if (choices.killed && choices.killed[0]) {
              effects.push({
                type: 'trauma',
                investigator: '$input_value',
                killed: true,
                hidden: true,
              });
            }
            const mentalAdjust = (choices.mental && choices.mental[0]) || 0;
            if (mentalAdjust !== 0) {
              effects.push({
                type: 'trauma',
                investigator: '$input_value',
                mental: mentalAdjust,
                hidden: true,
              });
            }
            if (choices.insane && choices.insane[0]) {
              effects.push({
                type: 'trauma',
                investigator: '$input_value',
                insane: true,
                hidden: true,
              });
            }

            if (effects.length) {
              effectsWithInput.push({
                input: [investigator.code],
                effects,
              });
            }
          }
        });

        // Finally do the deck upgrade to 'bank' it.
        effectsWithInput.push({
          effects: [
            {
              type: 'upgrade_decks',
            },
          ],
        });
        return this.maybeCreateEffectsStep(
          this.step.id,
          this.remainingStepIds,
          effectsWithInput,
          scenarioState
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
                scenarioState
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
                border: true,
                input: keys(secondChoice),
                effects: (theBadThing && theBadThing.effects) || [],
              }],
              scenarioState
            );
          }
          case 'choice': {
            const stringChoice = scenarioState.stringChoices(this.step.id);
            const numberChoice =
              stringChoice !== undefined ?
                mapValues(stringChoice, () => [1]) :
                scenarioState.numberChoices(this.step.id);
            if (numberChoice === undefined) {
              return undefined;
            }
            const consumeSuppliesEffects: Effect[] = map(numberChoice, (counts, code) => {
              return {
                type: 'campaign_log_count',
                section: input.section,
                investigator: code,
                operation: 'add',
                id: input.id,
                value: -counts[0],
              };
            });
            const hasAny = keys(numberChoice).length > 0;
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
                scenarioState
              );
            }
            const effectsInput: string[] = [];
            forEach(numberChoice, (count, code) => {
              forEach(range(0, count[0]), () => effectsInput.push(code));
            });

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
                  border: branchChoice && branchChoice.border,
                  input: effectsInput,
                  effects: (branchChoice && branchChoice.effects) || [],
                },
              ],
              scenarioState
            );
          }
        }
      }
    }
  }

  private decisionTest(
    remainingStepIds: string[],
    scenarioState: ScenarioStateHelper,
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
        scenarioState,
        ifTrue,
        ifFalse
      );
    }
    return undefined;
  }

  private binaryBranch(
    condition: boolean,
    remainingStepIds: string[],
    scenarioState: ScenarioStateHelper,
    ifTrue?: {
      border?: boolean;
      steps?: null | string[];
      effects?: null | Effect[];
    },
    ifFalse?: {
      border?: boolean;
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
        border: (resultCondition && resultCondition.border),
        input,
        effects: (resultCondition && resultCondition.effects) || [],
      }],
      scenarioState
    );
  }

  private maybeCreateEffectsStep(
    id: string,
    remainingStepIds: string[],
    effectsWithInput: EffectsWithInput[],
    scenarioState: ScenarioStateHelper,
    bulletType?: BulletType,
    hiddenResult?: boolean
  ): ScenarioStep | undefined {
    const flatEffects = flatMap(effectsWithInput, effects => effects.effects);
    if (flatEffects.length) {
      return new ScenarioStep(
        {
          id: `${id}_effects`,
          type: 'effects',
          effectsWithInput,
          stepText: !!this.step.text || !!hiddenResult,
          bullet_type: this.step.bullet_type || bulletType,
        },
        this.scenarioGuide,
        this.campaignLog,
        remainingStepIds
      );
    }
    return this.proceedToNextStep(
      remainingStepIds,
      scenarioState,
      this.campaignLog
    );
  }

  private proceedToNextStep(
    remainingStepIds: string[],
    scenarioState: ScenarioStateHelper,
    campaignLog: GuidedCampaignLog
  ): ScenarioStep | undefined {
    if (remainingStepIds.length) {
      const [stepId, ...newRemaining] = remainingStepIds;
      const step = this.scenarioGuide.step(
        stepId,
        scenarioState.campaignState,
        campaignLog
      );
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
