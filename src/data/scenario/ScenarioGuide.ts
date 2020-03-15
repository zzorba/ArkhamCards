import { find } from 'lodash';

import { Step, Scenario, Resolution } from './types';


/**
 * Wrapper utility to provide structured access to scenarios.
 */
export default class ScenarioGuide {
  scenario: Scenario;
  constructor(scenario: Scenario) {
    this.scenario = scenario;
  }

  step(id: string): Step | undefined {
    return find(this.scenario.steps, step => step.id === id);
  }

  resolution(id: string): Resolution | undefined {
    return find(this.scenario.resolutions || [], resolution => resolution.id === id);
  }
}
