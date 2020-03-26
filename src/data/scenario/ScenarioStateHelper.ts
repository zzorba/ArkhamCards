import { findLast } from 'lodash';

import {
  GuideInput,
  ListChoices,
  CampaignGuideState,
  SupplyCounts,
} from 'actions/types';

export interface ScenarioStateActions {
  setDecision: (id: string, value: boolean) => void;
  setCount: (id: string, value: number) => void;
  setSupplies: (id: string, supplyCounts: SupplyCounts) => void;
  setChoiceList: (id: string, choices: ListChoices) => void;
  setChoice: (id: string, choice: number) => void;
  resetScenario: () => void;
  undo: () => void;
}

export default class ScenarioStateHelper {
  scenarioId: string;
  state: CampaignGuideState;
  actions: ScenarioStateActions;
  numPlayers: number;

  constructor(
    scenarioId: string,
    state: CampaignGuideState,
    actions: ScenarioStateActions,
    // TODO: maybe break this out to be a choice?
    numPlayers: number
  ) {
    this.scenarioId = scenarioId;
    this.state = state;
    this.actions = actions;
    this.numPlayers = numPlayers;
  }

  resetScenario() {
    this.actions.resetScenario();
  }

  undo() {
    this.actions.undo();
  }

  playerCount(): number {
    return this.numPlayers;
  }

  setChoice(id: string, value: number) {
    this.actions.setChoice(id, value);
  }

  private entry(type: string, step?: string): GuideInput | undefined {
    return findLast(
      this.state.inputs,
      input => (
        input.type === type &&
        input.scenario === this.scenarioId &&
        input.step === step
      )
    );
  }

  choice(id: string): number | undefined {
    const entry = this.entry('choice', id);
    if (entry && entry.type === 'choice') {
      return entry.choice;
    }
    return undefined;
  }

  setChoiceList(id: string, value: ListChoices) {
    this.actions.setChoiceList(id, value);
  }

  choiceList(id: string): ListChoices | undefined {
    const entry = this.entry('choice_list', id);
    if (entry && entry.type === 'choice_list') {
      return entry.choices;
    }
    return undefined;
  }

  setSupplies(id: string, value: SupplyCounts) {
    this.actions.setSupplies(id, value);
  }

  supplies(id: string): SupplyCounts | undefined {
    const entry = this.entry('supplies', id);
    if (entry && entry.type === 'supplies') {
      return entry.supplies;
    }
    return undefined;
  }

  setDecision(id: string, value: boolean) {
    this.actions.setDecision(id, value);
  }

  decision(id: string): boolean | undefined {
    const entry = this.entry('decision', id);
    if (entry && entry.type === 'decision') {
      return entry.decision;
    }
    return undefined;
  }

  setCount(id: string, value: number) {
    this.actions.setCount(id, value);
  }

  count(id: string): number | undefined {
    const entry = this.entry('count', id);
    if (entry && entry.type === 'count') {
      return entry.count;
    }
    return undefined;
  }
}
