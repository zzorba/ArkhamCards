import { ListChoices, ScenarioState, SupplyCounts } from 'actions/types';

export interface ScenarioStateActions {
  setDecision: (id: string, value: boolean) => void;
  setCount: (id: string, value: number) => void;
  setSupplies: (id: string, supplyCounts: SupplyCounts) => void;
  setChoiceList: (id: string, choices: ListChoices) => void;
  setChoice: (id: string, choice: number) => void;
  resetScenario: () => void;
}

export default class ScenarioStateHelper {
  state: ScenarioState;
  actions: ScenarioStateActions;

  constructor(
    state: ScenarioState,
    actions: ScenarioStateActions
  ) {
    this.state = state;
    this.actions = actions;
  }

  resetScenario() {
    this.actions.resetScenario();
  }

  hasStepInput(id: string) {
    return (
      this.hasChoice(id) ||
      this.hasDecision(id) ||
      this.hasChoiceList(id) ||
      this.hasSupplies(id) ||
      this.hasDecision(id) ||
      this.hasCount(id)
    );
  }

  setChoice(id: string, value: number) {
    this.actions.setChoice(id, value);
  }

  hasChoice(id: string): boolean {
    return this.state.choices[id] !== undefined;
  }

  choice(id: string): number {
    return this.state.choices[id];
  }

  setChoiceList(id: string, value: ListChoices) {
    this.actions.setChoiceList(id, value);
  }

  hasChoiceList(id: string): boolean {
    return this.state.ListChoices[id] !== undefined;
  }

  investigatorChoice(id: string): ListChoices {
    return this.state.ListChoices[id];
  }

  setSupplies(id: string, value: SupplyCounts) {
    this.actions.setSupplies(id, value);
  }

  hasSupplies(id: string): boolean {
    return this.state.supplyCounts[id] !== undefined;
  }

  supplies(id: string): SupplyCounts {
    return this.state.supplyCounts[id];
  }

  setDecision(id: string, value: boolean) {
    this.actions.setDecision(id, value);
  }

  hasDecision(id: string) {
    return this.state.decisions[id] !== undefined;
  }

  decision(id: string): boolean {
    return this.state.decisions[id];
  }

  setCount(id: string, value: number) {
    this.actions.setCount(id, value);
  }

  hasCount(id: string) {
    return this.state.counts[id] !== undefined;
  }

  count(id: string): number {
    return this.state.counts[id];
  }
}
