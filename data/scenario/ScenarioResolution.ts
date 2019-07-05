import Realm from 'realm';

import ScenarioEffect from './ScenarioEffect';

export default class ScenarioResolution {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioResolution',
    properties: {
      id: 'string',
      title: 'string',
      text: 'string?',
      resolution: 'string?',
      steps: 'string[]?',
    },
  };
  public id!: string;
  public title!: string;
  public text!: string | null;
  public resolution!: string | null;
  public steps!: string[] | null;
}
