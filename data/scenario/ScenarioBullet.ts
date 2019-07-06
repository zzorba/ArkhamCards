import Realm from 'realm';

export default class ScenarioBullet {
  public static schema: Realm.ObjectSchema = {
    name: 'ScenarioBullet',
    properties: {
      text: 'string',
    },
  };
  public text!: string;
}
