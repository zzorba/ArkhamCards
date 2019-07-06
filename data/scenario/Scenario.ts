import Realm from 'realm';

import ScenarioResolution from './ScenarioResolution';
import ScenarioStep from './ScenarioStep';

export default class Scenario {
  public static schema: Realm.ObjectSchema = {
    name: 'Scenario',
    properties: {
      scenarioName: 'string',
      setup: 'string[]',
      steps: 'ScenarioStep[]',
      resolutions: 'ScenarioResolution[]?',
      interlude: 'bool?',
    },
  };
  public scenarioName!: string;
  public setup!: string[];
  public steps!: ScenarioStep[];
  public resolutions!: ScenarioResolution[] | null;
  public interlude!: boolean | null;
}
