export interface ScenarioState {
  decisions: {
    [key: string]: boolean;
  };
  counts: {
    [key: string]: number;
  };
}

export const DEFAULT_SCENARIO_STATE: ScenarioState = {
  decisions: {},
  counts: {},
};

export default class ScenarioStateHelper {
  state: ScenarioState;
  updateState: (state: ScenarioState) => void;

  constructor(
    state: ScenarioState,
    updateState: (state: ScenarioState) => void
  ) {
    this.state = state;
    this.updateState = updateState;
  }

  setDecision(id: string, value: boolean) {
    this.updateState({
      ...this.state,
      decisions: {
        ...this.state.decisions,
        [id]: value,
      },
    });
  }

  hasDecision(id: string) {
    return this.state.decisions[id] !== undefined;
  }

  decision(id: string): boolean {
    return this.state.decisions[id];
  }

  setCount(id: string, value: number) {
    this.updateState({
      ...this.state,
      counts: {
        ...this.state.counts,
        [id]: value,
      },
    });
  }
  
  hasCount(id: string) {
    return this.state.counts[id] !== undefined;
  }

  count(id: string): number {
    return this.state.counts[id];
  }


}
