import { InvestigatorChoices, ScenarioState, SupplyCounts } from 'actions/types';

export interface ScenarioStateActions {
  setDecision: (id: string, value: boolean) => void;
  setCount: (id: string, value: number) => void;
  setSupplies: (id: string, supplyCounts: SupplyCounts) => void;
  setInvestigatorChoice: (id: string, choices: InvestigatorChoices) => void;
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

  setInvestigatorChoice(id: string, value: InvestigatorChoices) {
    this.actions.setInvestigatorChoice(id, value);
  }

  hasInvestigatorChoice(id: string): boolean {
    return this.state.investigatorChoices[id] !== undefined;
  }

  investigatorChoice(id: string): InvestigatorChoices {
    return this.state.investigatorChoices[id];
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
