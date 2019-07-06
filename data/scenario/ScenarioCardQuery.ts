import Realm from 'realm';

export default class ScenarioCardQuery {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioCardQuery',
    properties: {
      trait: 'string?',
      unique: 'bool?',
      code: 'string[]?',
    },
  };
  public trait!: string | null;
  public unique!: boolean | null;
  public code!: string[] | null;
}
