import { findLast } from 'lodash';

import {
  GuideInput,
  NumberChoices,
  StringChoices,
  CampaignGuideState,
  SupplyCounts,
} from 'actions/types';
import Card from 'data/Card';

export interface CampaignGuideActions {
  showChooseDeck: (singleInvestigator?: Card) => void;
  addInvestigator: (code: string, deckId?: number) => void;
  setDecision: (id: string, value: boolean, scenarioId?: string) => void;
  setCount: (id: string, value: number, scenarioId?: string) => void;
  setSupplies: (id: string, supplyCounts: SupplyCounts, scenarioId?: string) => void;
  setNumberChoices: (id: string, choices: NumberChoices, scenarioId?: string) => void;
  setStringChoices: (id: string, choices: StringChoices, scenarioId?: string) => void;
  setChoice: (id: string, choice: number, scenarioId?: string) => void;
  startScenario: (scenarioId: string) => void;
  resetScenario: (scenarioId: string) => void;
  undo: (scenarioId: string) => void;
}

export default class CampaignStateHelper {
  state: CampaignGuideState;
  actions: CampaignGuideActions;

  constructor(
    state: CampaignGuideState,
    actions: CampaignGuideActions
  ) {
    this.state = state;
    this.actions = actions;
  }

  addInvestigator(code: string, deckId?: number) {
    this.actions.addInvestigator(code, deckId);
  }

  showChooseDeck(singleInvestigator?: Card) {
    this.actions.showChooseDeck(singleInvestigator);
  }

  startScenario(scenarioId: string) {
    this.actions.startScenario(scenarioId);
  }

  resetScenario(scenarioId: string) {
    this.actions.resetScenario(scenarioId);
  }

  setChoice(id: string, value: number, scenarioId?: string) {
    this.actions.setChoice(id, value, scenarioId);
  }

  setNumberChoices(id: string, value: NumberChoices, scenarioId?: string) {
    this.actions.setNumberChoices(id, value, scenarioId);
  }

  setStringChoices(id: string, value: StringChoices, scenarioId?: string) {
    this.actions.setStringChoices(id, value, scenarioId);
  }

  setSupplies(id: string, value: SupplyCounts, scenarioId?: string) {
    this.actions.setSupplies(id, value, scenarioId);
  }

  setDecision(id: string, value: boolean, scenarioId?: string) {
    this.actions.setDecision(id, value, scenarioId);
  }

  setCount(id: string, value: number, scenarioId?: string) {
    this.actions.setCount(id, value, scenarioId);
  }

  undo(scenarioId: string) {
    this.actions.undo(scenarioId);
  }

  private entry(type: string, step?: string, scenario?: string): GuideInput | undefined {
    return findLast(
      this.state.inputs,
      input => (
        input.type === type &&
        input.scenario === scenario &&
        (input.type === 'start_scenario' || input.step === step)
      )
    );
  }

  startedScenario(scenario: string): boolean {
    return !!this.entry('start_scenario', undefined, scenario);
  }

  choice(id: string, scenario?: string): number | undefined {
    const entry = this.entry('choice', id, scenario);
    if (entry && entry.type === 'choice') {
      return entry.choice;
    }
    return undefined;
  }

  numberChoices(id: string, scenario?: string): NumberChoices | undefined {
    const entry = this.entry('choice_list', id, scenario);
    if (entry && entry.type === 'choice_list') {
      return entry.choices;
    }
    return undefined;
  }

  stringChoices(id: string, scenario?: string): StringChoices | undefined {
    const entry = this.entry('string_choices', id, scenario);
    if (entry && entry.type === 'string_choices') {
      return entry.choices;
    }
    return undefined;
  }

  supplies(id: string, scenario?: string): SupplyCounts | undefined {
    const entry = this.entry('supplies', id, scenario);
    if (entry && entry.type === 'supplies') {
      return entry.supplies;
    }
    return undefined;
  }

  decision(id: string, scenario?: string): boolean | undefined {
    const entry = this.entry('decision', id, scenario);
    if (entry && entry.type === 'decision') {
      return entry.decision;
    }
    return undefined;
  }

  count(id: string, scenario?: string): number | undefined {
    const entry = this.entry('count', id, scenario);
    if (entry && entry.type === 'count') {
      return entry.count;
    }
    return undefined;
  }
}
