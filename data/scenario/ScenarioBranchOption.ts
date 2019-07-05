import Realm from 'realm';

import ScenarioEffect from './ScenarioEffect';

export default class ScenarioBranchOption {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioBranchOption',
    properties: {
      boolCondition: 'bool?',
      numCondition: 'int?',
      condition: 'string?',
      default: 'bool?',
      effects: 'ScenarioEffect[]?',
      steps: 'string[]?',
      resolution: 'string?',
    },
  };
  public boolCondition!: boolean | null;
  public numCondition!: number | null;
  public condition!: string | null;
  public default!: boolean | null;

  public effects!: ScenarioEffect[] | null;
  public steps!: string[] | null;
  public resolution!: string | null
}
