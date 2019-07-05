import Realm from 'realm';

import ScenarioEffect from './ScenarioEffect';

export default class ScenarioChoice {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioChoice',
    properties: {
      text: 'string',
      description: 'string?',
      effects: 'ScenarioEffect[]?',
      steps: 'string[]?',
      resolution: 'string?',
    },
  };
  public text!: string;
  public description!: string | null;
  public effects!: ScenarioEffect[] | null;
  public steps!: string[] | null;
  public resolution!: string | null;
}
