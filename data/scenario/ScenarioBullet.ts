import Realm from 'realm';

import ScenarioEffect from './ScenarioEffect';

export default class ScenarioBullet {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioBullet',
    properties: {
      text: 'string',
    },
  };
  public text!: string;
}
